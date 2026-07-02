from sqlalchemy.orm import Session
from .models import Plan
from .schemas import PlanCreate


def create_plan(db: Session, plan: PlanCreate):
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_plans(db: Session):
    return db.query(Plan).all()