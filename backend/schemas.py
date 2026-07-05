from pydantic import BaseModel,EmailStr

class PlanBase(BaseModel):
    name: str
    price: float
    billing_interval: str
    trial_days: int
    features: str


class PlanCreate(PlanBase):
    pass


class PlanResponse(PlanBase):
    id: int

    class Config:
        from_attributes = True

class CustomerSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_name: str


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class CustomerUpdate(BaseModel):
    name: str
    email: EmailStr
    company_name: str