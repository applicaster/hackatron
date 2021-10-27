import datetime
import json
import random
import string
from io import StringIO
from typing import Optional, List

import jwt as jwt
import uvicorn
from bson import ObjectId
from fastapi import FastAPI, Depends, Request
from fastapi import Header, HTTPException, status
from fastapi.responses import HTMLResponse
from jose import JWTError, jwt
from pymongo import MongoClient
from starlette.responses import StreamingResponse
from starlette.templating import Jinja2Templates

app = FastAPI()

client = MongoClient("mongodb+srv://applicaster:yAZmIDR62adN39Pj@cluster0.xwumj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client["myFirstDatabase"]


SECRET_KEY = "6341472a9fbeebb6e469abd1b579445a4959421d48a39215d844053f98207151"
ALGORITHM = "HS256"

templates = Jinja2Templates('templates')


def _new_pin() -> str:
    while True:
        pin = ''.join(random.choices(string.digits, k=5))
        if db["loggs"].find_one({'pin': pin}):
            continue
        expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        db["loggs"].insert_one({'pin': pin, 'expires': expires})
        return pin


async def get_app_bucket(Authorization: Optional[str] = Header(None)):
    if not Authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Auth required')

    token = Authorization.replace('Bearer ', '')

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        bucket_id: str = payload.get("sub") # ObjectId
    except JWTError as e:
        raise credentials_exception

    if not bucket_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Bucket {bucket_id} is missing')
    return bucket_id


@app.post("/create")
def create_pin() -> str:
    return _new_pin()

@app.post("/activate")
def activate(data: dict) -> dict:
    pin = data.get('pin')
    if not pin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'PIN is required')

    appInfo = data.get('appInfo')
    if not appInfo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'appInfo is required')
    record = db["loggs"].find_one({'pin': pin})
    if not record:
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=f'PIN is not found')

    # todo: check it its not already activated (does not has appdata)
    if record.get('appInfo'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Already taken')

    objectId = record.get("_id")
    # insert app data to db
    # todo: check success
    db["loggs"].update_one({'_id': objectId}, {'$set': {'appInfo': appInfo}})

    jwt_token = jwt.encode({"sub": str(objectId)}, key=SECRET_KEY, algorithm=ALGORITHM)

    return {
        'jwt': jwt_token,
        'expires': record.get('expires'),
        'configuration': {
            'local_logger_url': 'http://192.168.15.237:9080/',
            'remote_logger_url': 'https://hackatron-logger-2rrbvh5fwa-uc.a.run.app/'
        }
    }


@app.post("/postBatchEvents")
def post_events(events: List[dict],
                oid: str = Depends(get_app_bucket)) -> str:
    # todo: add if condition that appInfo is there
    # todo: check result
    db["loggs"].update_one({'_id': ObjectId(oid)},
                           {'$push': {'events': {"$each": events}}})
    return "OK"


@app.get("/new_bucket", response_class=HTMLResponse)
def create_pin(request: Request):
    pin = _new_pin()
    return _render_home(request, pin)


@app.get("/download/{pin}")
def download_log(pin: str):
    record = db["loggs"].find_one({'pin': pin})
    if not record:
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=f'PIN is not found')
    stream = StringIO()
    events = record.get('events')
    # todo: super ineffective
    stream.write(json.dumps(events))
    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type='text/json',
        headers={"Content-Disposition": "inline; filename=log.json"})
    return response


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return _render_home(request, None)


def _render_home(request, pin: Optional[str]):
    entries = list(db["loggs"].find())
    for entry in entries:
        entry.pop("_id")
        entry['has_events'] = bool(entry.pop("events", None))
    return templates.TemplateResponse(
        "index.tpl", dict(request=request, title="Zapp Logs", entries=entries, pin=pin)
    )


uvicorn.run(app,
            host='0.0.0.0',
            port=8000)

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))