import os 
from dotenv import load_dotenv
import asyncpg

async def pool():
    load_dotenv()
    source_url = os.getenv("NEON_CONNECTION_STRING")
    pool = await asyncpg.create_pool(source_url)
    return pool        
    
    # Acquire a connection from the pool
    async with pool.acquire() as conn:
        # Execute SQL commands to retrieve the current time and version from PostgreSQL
        # time = await conn.fetchval('SELECT NOW();')
        # version = await conn.fetchval('SELECT version();')
        table = await conn.execute(q)
        print("Table : ",table)
    # Close the pool
    await pool.close()

    # Print the results
    # print('Current time:', time)
    # print('PostgreSQL version:', version)
