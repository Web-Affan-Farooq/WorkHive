# from database import Database , connection_pool
# import asyncio

# async def main():
#     pool = await connection_pool()
#     database = Database(pool)
#     await database.create_employee(
#             'Ali Khan',
#         'Engineering',
#         'Software Engineer',
#         'ali.khan@example.com',
#         'securepassword123',
#         ['Python', 'FastAPI', 'Docker']
# )

# asyncio.run(main())

from fastapi import FastAPI

from routes import login_router, create_organization_router

app = FastAPI()

app.include_router(login_router)
app.include_router(create_organization_router)