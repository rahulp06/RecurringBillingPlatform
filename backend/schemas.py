from pydantic import BaseModel


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