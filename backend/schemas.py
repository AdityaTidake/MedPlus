from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, time

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Doctor Schemas
class DoctorBase(BaseModel):
    specialization: str
    department: str

class DoctorCreate(DoctorBase):
    user_id: int

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    user: UserResponse
    
    class Config:
        from_attributes = True

# Patient Schemas
class PatientBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None

class PatientCreate(PatientBase):
    user_id: int

class PatientResponse(PatientBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    doctor_id: int
    date: date
    time: time

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    date: date
    time: time
    token_number: int
    status: str
    doctor: DoctorResponse
    
    class Config:
        from_attributes = True

# Prescription Schemas
class PrescriptionItemCreate(BaseModel):
    medicine_name: str
    dosage: str
    frequency: str
    duration: str

class PrescriptionItemResponse(PrescriptionItemCreate):
    id: int
    prescription_id: int
    
    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    appointment_id: int
    notes: Optional[str] = None
    items: List[PrescriptionItemCreate]

class PrescriptionResponse(BaseModel):
    id: int
    appointment_id: int
    doctor_id: int
    patient_id: int
    notes: Optional[str]
    items: List[PrescriptionItemResponse]
    
    class Config:
        from_attributes = True

# Dispensary Schemas
class DispensaryRecordCreate(BaseModel):
    prescription_id: int
    total_amount: float
    payment_status: str = "pending"

class DispensaryRecordResponse(BaseModel):
    id: int
    prescription_id: int
    pharmacist_id: int
    total_amount: float
    payment_status: str
    prescription: PrescriptionResponse
    
    class Config:
        from_attributes = True
