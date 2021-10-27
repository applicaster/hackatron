from typing import Optional

from fastapi import FastAPI
import pymongo
from bson import ObjectId
from pymongo import MongoClient
from pymongo import ReturnDocument
from pymongo.results import UpdateResult
from pydantic import BaseModel
from fastapi import APIRouter, Header, HTTPException, Depends, Query, status
from jose import JWTError, jwt
import uvicorn

app = FastAPI()

client = MongoClient("")
class Item(BaseModel):

    name: str

    price: float

    is_offer: Optional[bool] = None


@app.get("/")
def read_root() -> list:
    mydb = client["myFirstDatabase"]
    tmp_result =  list(mydb["loggs"].find())
    print(str(tmp_result))
    return tmp_result


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}



@app.put("/items/{item_id}")

def update_item(item_id: int, item: Item):

    return {"item_name": item.name, "item_id": item_id}


uvicorn.run(app,
            host='0.0.0.0',
            port=8000)