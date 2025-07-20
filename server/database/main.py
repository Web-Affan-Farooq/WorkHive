from schemas import OrganizationData
import bcrypt
from rich import print

class Database:
    def __init__(self,pool):
        self.pool = pool
        
    async def create_employee(self, name:str, department:str, position:str, email:str, password:str, skills:list[str]):
        async with self.pool.acquire() as conn:
            new_employee = await conn.execute(f"""
INSERT INTO employees (name,department,position,email,password,skills)
VALUES ($1,$2,$3,$4,$5,$6)
""",name , department , position , email , password , skills)
            print("database : employee created successfully Line-12 ", new_employee)
            return new_employee
    
    async def create_organization(self, organizationData: OrganizationData):
        print("create_organization  Line 19 :", organizationData)
        password_binary = b"" + organizationData["orgPassword"].encode("utf-8")
        salt = bcrypt.gensalt(rounds=10)
        password_hash = bcrypt.hashpw(password_binary, salt)

        print("created binary password  Line 22 : ", password_binary)
        print("Hashed password    Line 23: ", password_hash)

        async with self.pool.acquire() as conn:
            new_organization = await conn.execute("""
        INSERT INTO "Organization" (
            name, industryType, address, telephone, email, password, maximumEmployees, maximumManagers
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        )
        """,
        organizationData["orgName"],
        organizationData["industryType"],
        organizationData["orgAddress"],
        organizationData["orgPhone"],
        organizationData["orgEmail"],
        password_hash.decode("utf-8"),
        organizationData["staffSize"]["employees"],
        organizationData["staffSize"]["managers"]
        )
            print("Organization created Database class  Line 42 : ",new_organization)
            return new_organization
            
#     async def edit_employee(self,email , ):
#         async with self.pool.acquire() as conn:
#             await conn.execute(
#                 """
# UPDATE employees
# SET name = 
# """
#             )