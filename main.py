import datetime
import random
import string
from typing import Optional, List, Dict

import jwt as jwt
import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi import Header, HTTPException, status
from jose import JWTError, jwt
from pymongo import MongoClient
from fastapi.responses import HTMLResponse
from starlette.templating import Jinja2Templates

app = FastAPI()

client = MongoClient("mongodb+srv://applicaster:yAZmIDR62adN39Pj@cluster0.xwumj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client["myFirstDatabase"]


SECRET_KEY = "6341472a9fbeebb6e469abd1b579445a4959421d48a39215d844053f98207151"
ALGORITHM = "HS256"

templates = Jinja2Templates('templates')

async def get_app_bucket(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Auth required')

    token = authorization.replace('Bearer ', '')

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
    while True:
        pin = ''.join(random.choices(string.digits, k=5))
        if db["loggs"].find_one({'pin': pin}):
            continue
        expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        db["loggs"].insert({'pin': pin, 'expires': expires})
        return pin


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

    # todo: insert app data to db

    oid = str(record.get("_id"))
    jwt_token = jwt.encode({"sub": oid}, key=SECRET_KEY, algorithm=ALGORITHM)

    return {
        'jwt': jwt_token,
        'expires': record.get('expires'),
    }


@app.post("/postBatchEvents")
def post_events(events: List[dict],
                oid: str = Depends(get_app_bucket)) -> str:
    # todo: write to db with ObjectId oid
    pass
    return "OK"


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse(
        "index.tpl", dict(request=request, title="Zapp Logs")
    )

uvicorn.run(app,
            host='0.0.0.0',
            port=8000)
