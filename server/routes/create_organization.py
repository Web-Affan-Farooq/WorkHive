import os
from fastapi import APIRouter , Response, Request
from fastapi.responses import JSONResponse
from schemas import OrganizationData
from dotenv import load_dotenv

from jose import jwt
from datetime import timedelta
from database import Database
from database import connection_pool
from rich import print

load_dotenv()
router = APIRouter()

@router.options("/create-organization")
async def preflight_organization_check():
    # Handle preflight OPTIONS request manually
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.status_code = 204
    return response

@router.post("/create-organization")
async def create_organization(req:Request):
    body :OrganizationData= await req.json()
    print("get body : ",body)
    # try:
    pool = await connection_pool()
    database_source = Database(pool)
    organization = await database_source.create_organization(body)
    print("Organization : ",organization)
    return JSONResponse(
        {"Message":"Organization created successfull ", "data_recieved":body,},

        headers={
            "Access-Control-Allow-Origin": os.getenv("CLIENT_URL"),
        }
    )
    # except Exception as e:
    #      return JSONResponse(
    #           {"Message":e},
    #         headers={
    #         "Access-Control-Allow-Origin": os.getenv("CLIENT_URL"),
    #     },
    #         status_code=500,
    #      )