from pydantic import BaseModel
from typing import Dict

class OrganizationData(BaseModel):
    id:str
    industryType:str
    orgAddress: str
    orgEmail :str
    orgName:str
    orgPassword:str
    orgPhone:str
    staffSize: Dict[str,int]