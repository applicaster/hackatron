import datetime
import json
import random
import string
from io import StringIO
from typing import Optional, List

import jwt as jwt
import uvicorn
from bson import ObjectId
from fastapi import FastAPI, Depends, Request, Form
from fastapi import Header, HTTPException, status
from fastapi.responses import HTMLResponse
from jose import JWTError, jwt
from pymongo import MongoClient
from starlette.responses import StreamingResponse
from starlette.templating import Jinja2Templates

app = FastAPI()


# todo: pull from environment
remote_logger_url = 'https://hackatron-logger-2rrbvh5fwa-uc.a.run.app/'
mongodb_url = "mongodb+srv://applicaster:yAZmIDR62adN39Pj@cluster0.xwumj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

client = MongoClient(mongodb_url)
db = client["myFirstDatabase"]

SECRET_KEY = "6341472a9fbeebb6e469abd1b579445a4959421d48a39215d844053f98207151"
ALGORITHM = "HS256"

templates = Jinja2Templates('templates')


def _new_pin() -> str:
    while True:
        pin = ''.join(random.choices(string.digits, k=5))
        if _get_collection().find_one({'pin': pin}):
            continue
        expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        _get_collection().insert_one({'pin': pin, 'expires': expires})
        return pin


def _get_collection():
    return db["loggs"]


def _default_configuration() -> dict:
    return {
        'remote_logger_url': remote_logger_url
    }


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

    collection = _get_collection()

    appInfo = data.get('appInfo')
    if not appInfo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'appInfo is required')
    record = collection.find_one({'pin': pin})
    if not record:
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=f'PIN is not found')

    # check it its not already activated (does not has appdata)
    if record.get('appInfo'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Already taken')

    objectId = record.get("_id")
    # insert app data to db
    # todo: check success
    collection.update_one({'_id': objectId}, {'$set': {'appInfo': appInfo}})

    jwt_token = jwt.encode({"sub": str(objectId)}, key=SECRET_KEY, algorithm=ALGORITHM)

    return {
        'jwt': jwt_token,
        'expires': record.get('expires'),
        'configuration': _default_configuration()
    }


@app.post("/postBatchEvents")
def post_events(events: List[dict],
                oid: str = Depends(get_app_bucket)) -> str:
    # todo: add if condition that appInfo is there
    # todo: check result
    _get_collection().update_one({'_id': ObjectId(oid)},
                                 {'$push': {'events': {"$each": events}}})
    return "OK"


@app.get("/get_configuration")
def get_configuration(oid: str = Depends(get_app_bucket)) -> dict:
    record = _get_collection().find_one({'_id': ObjectId(oid)})
    if not record:
        raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=f'PIN is not found')
    configuration = record.get('configuration', {})
    return {**configuration, **_default_configuration()}


@app.get("/new_bucket", response_class=HTMLResponse)
def create_pin(request: Request):
    pin = _new_pin()
    return _render_home(request, pin)


@app.get("/download/{pin}")
def download_log(pin: str):
    record = _get_collection().find_one({'pin': pin})
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


@app.post("/")
def update_configuration(request: Request,
                         pin: str = Form(None),
                         local_url: str = Form(None)):
    if local_url:
        collection = _get_collection()
        record = collection.find_one({'pin': pin})
        if not record:
            raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=f'PIN is not found')
        collection.update_one({'pin': pin}, {'$set': {'configuration.local_logger_url': local_url}})
    return _render_home(request, None)


def _render_home(request, pin: Optional[str]):
    collection = _get_collection()
    entries = list(collection.find())
    for entry in entries:
        entry.pop("_id")
        entry['has_events'] = bool(entry.pop("events", None))
        if not entry.get('configuration'):
            entry['configuration'] = {'local_logger_url': ''}
    return templates.TemplateResponse(
        "index.tpl", dict(request=request, title="Zapp Logs", entries=entries, pin=pin)
    )


# uvicorn.run(app,
#             host='0.0.0.0',
#             port=8000)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))