from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Optional
from datetime import datetime
import random

app = FastAPI(title="Patient Kiosk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Table
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    address = Column(String)
    department = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False)
    created_at = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)


# Request Model
class PatientCreate(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=1, le=120)
    gender: str
    mobile: str
    address: Optional[str] = None
    department: str

    @validator("mobile")
    def validate_mobile(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Mobile number must be exactly 10 digits")
        return v

    @validator("department")
    def validate_department(cls, v):
        allowed = [
            "General Medicine",
            "Cardiology",
            "Orthopedics",
            "Dermatology",
            "Pediatrics"
        ]

        if v not in allowed:
            raise ValueError(
                f"Department must be one of {allowed}"
            )

        return v


def generate_token(department):
    prefix = department[:4].upper().replace(" ", "")
    return f"{prefix}-{random.randint(1000,9999)}"


# Create Patient
@app.post("/api/patients")
def create_patient(patient: PatientCreate):

    db = SessionLocal()

    new_patient = Patient(
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        mobile=patient.mobile,
        address=patient.address,
        department=patient.department,
        token=generate_token(patient.department),
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    result = {
        "id": new_patient.id,
        "name": new_patient.name,
        "age": new_patient.age,
        "gender": new_patient.gender,
        "mobile": new_patient.mobile,
        "address": new_patient.address,
        "department": new_patient.department,
        "token": new_patient.token,
        "created_at": new_patient.created_at,
    }

    db.close()
    return result


# Get All Patients
@app.get("/api/patients")
def get_patients(search: Optional[str] = Query(None)):

    db = SessionLocal()

    if search:
        patients = db.query(Patient).filter(
            Patient.name.contains(search)
        ).all()
    else:
        patients = db.query(Patient).all()

    result = []

    for p in patients:
        result.append({
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "mobile": p.mobile,
            "address": p.address,
            "department": p.department,
            "token": p.token,
            "created_at": p.created_at,
        })

    db.close()
    return result


# Get Patient By ID
@app.get("/api/patients/{id}")
def get_patient_by_id(id: int):

    db = SessionLocal()

    patient = db.query(Patient).filter(
        Patient.id == id
    ).first()

    if not patient:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    result = {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "mobile": patient.mobile,
        "address": patient.address,
        "department": patient.department,
        "token": patient.token,
        "created_at": patient.created_at,
    }

    db.close()
    return result