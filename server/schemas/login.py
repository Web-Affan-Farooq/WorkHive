from pydantic import BaseModel

class LoginSchema(BaseModel):
        employeeId:int
        employeeEmail: str
        employeePassword:str
        employeeDepartment:str   