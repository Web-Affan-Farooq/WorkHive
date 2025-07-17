from fastapi import FastAPI

from routes import login_router

app = FastAPI()

app.include_router(login_router)