# routes/login.py
import os
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from schemas import LoginSchema
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

@router.options("/login")
async def preflight_login():
    # Handle preflight OPTIONS request manually
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.status_code = 204
    return response

@router.post("/login")

async def login(request: Request):
    body :LoginSchema = await request.json()
#         employeeId:int
#         employeeEmail: str
#         employeePassword:str
#         employeeDepartment:str 

    employee = {
        "id":body.get("employeeId"),
        "email":body.get("employeeEmail"),
        "password":body.get("employeePassword"),
        "department": body.get("employeeDepartment")
    }

    # Handle your login logic here
    return JSONResponse(
        {"message": "Login successful" , "employee":employee},
        headers={
            "Access-Control-Allow-Origin": os.getenv("CLIENT_URL"),
        }
    )
