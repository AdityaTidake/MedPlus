from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date as date_type
import random

from db import get_db, Base, engine
from models import User, Doctor, Patient, Pharmacist, Appointment, Prescription, PrescriptionItem, DispensaryRecord
from schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    DoctorCreate, DoctorResponse,
    PatientCreate, PatientResponse,
    AppointmentCreate, AppointmentResponse,
    PrescriptionCreate, PrescriptionResponse,
    DispensaryRecordCreate, DispensaryRecordResponse
)
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, require_role, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospify API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ENDPOINTS ====================

@app.post("/auth/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create role-specific record
    if user.role == "patient":
        patient = Patient(user_id=user.id)
        db.add(patient)
    elif user.role == "doctor":
        doctor = Doctor(user_id=user.id, specialization="General", department="General")
        db.add(doctor)
    elif user.role == "pharmacist":
        pharmacist = Pharmacist(user_id=user.id)
        db.add(pharmacist)
    
    db.commit()
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/auth/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== PATIENT ENDPOINTS ====================

@app.post("/patient/appointments", response_model=AppointmentResponse)
def book_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(require_role(["patient"])),
    db: Session = Depends(get_db)
):
    # Get patient record
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    # Generate token number
    existing_appointments = db.query(Appointment).filter(
        Appointment.doctor_id == appointment_data.doctor_id,
        Appointment.date == appointment_data.date
    ).count()
    token_number = existing_appointments + 1
    
    # Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=appointment_data.doctor_id,
        date=appointment_data.date,
        time=appointment_data.time,
        token_number=token_number,
        status="scheduled"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    return appointment

@app.get("/patient/appointments", response_model=List[AppointmentResponse])
def get_patient_appointments(
    current_user: User = Depends(require_role(["patient"])),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    appointments = db.query(Appointment).filter(Appointment.patient_id == patient.id).all()
    return appointments

@app.delete("/patient/appointments/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    current_user: User = Depends(require_role(["patient"])),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = "cancelled"
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}

# ==================== DOCTOR ENDPOINTS ====================

@app.get("/doctor/appointments", response_model=List[AppointmentResponse])
def get_doctor_appointments(
    current_user: User = Depends(require_role(["doctor"])),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor record not found")
    
    today = date_type.today()
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == doctor.id,
        Appointment.date == today,
        Appointment.status == "scheduled"
    ).order_by(Appointment.token_number).all()
    
    return appointments

@app.put("/doctor/appointments/{appointment_id}/complete")
def complete_appointment(
    appointment_id: int,
    current_user: User = Depends(require_role(["doctor"])),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == doctor.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = "completed"
    db.commit()
    
    return {"message": "Appointment marked as completed"}

@app.post("/doctor/prescriptions", response_model=PrescriptionResponse)
def create_prescription(
    prescription_data: PrescriptionCreate,
    current_user: User = Depends(require_role(["doctor"])),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor record not found")
    
    # Get appointment
    appointment = db.query(Appointment).filter(Appointment.id == prescription_data.appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Create prescription
    prescription = Prescription(
        appointment_id=appointment.id,
        doctor_id=doctor.id,
        patient_id=appointment.patient_id,
        notes=prescription_data.notes
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    
    # Add prescription items
    for item_data in prescription_data.items:
        item = PrescriptionItem(
            prescription_id=prescription.id,
            medicine_name=item_data.medicine_name,
            dosage=item_data.dosage,
            frequency=item_data.frequency,
            duration=item_data.duration
        )
        db.add(item)
    
    db.commit()
    db.refresh(prescription)
    
    # Mark appointment as completed
    appointment.status = "completed"
    db.commit()
    
    return prescription

# ==================== PHARMACY ENDPOINTS ====================

@app.get("/pharmacy/prescriptions", response_model=List[PrescriptionResponse])
def get_pending_prescriptions(
    current_user: User = Depends(require_role(["pharmacist"])),
    db: Session = Depends(get_db)
):
    # Get prescriptions without dispensary records
    prescriptions = db.query(Prescription).filter(
        ~Prescription.id.in_(db.query(DispensaryRecord.prescription_id))
    ).all()
    
    return prescriptions

@app.post("/pharmacy/dispense", response_model=DispensaryRecordResponse)
def dispense_prescription(
    record_data: DispensaryRecordCreate,
    current_user: User = Depends(require_role(["pharmacist"])),
    db: Session = Depends(get_db)
):
    pharmacist = db.query(Pharmacist).filter(Pharmacist.user_id == current_user.id).first()
    if not pharmacist:
        raise HTTPException(status_code=404, detail="Pharmacist record not found")
    
    # Check if prescription exists
    prescription = db.query(Prescription).filter(Prescription.id == record_data.prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    # Check if already dispensed
    existing_record = db.query(DispensaryRecord).filter(
        DispensaryRecord.prescription_id == record_data.prescription_id
    ).first()
    if existing_record:
        raise HTTPException(status_code=400, detail="Prescription already dispensed")
    
    # Create dispensary record
    record = DispensaryRecord(
        prescription_id=record_data.prescription_id,
        pharmacist_id=pharmacist.id,
        total_amount=record_data.total_amount,
        payment_status=record_data.payment_status
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record

# ==================== ADMIN ENDPOINTS ====================

@app.get("/admin/stats")
def get_hospital_stats(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    total_doctors = db.query(Doctor).count()
    total_patients = db.query(Patient).count()
    total_pharmacists = db.query(Pharmacist).count()
    
    today = date_type.today()
    today_appointments = db.query(Appointment).filter(Appointment.date == today).count()
    completed_appointments = db.query(Appointment).filter(Appointment.status == "completed").count()
    
    pending_prescriptions = db.query(Prescription).filter(
        ~Prescription.id.in_(db.query(DispensaryRecord.prescription_id))
    ).count()
    
    return {
        "total_doctors": total_doctors,
        "total_patients": total_patients,
        "total_pharmacists": total_pharmacists,
        "today_appointments": today_appointments,
        "completed_appointments": completed_appointments,
        "pending_prescriptions": pending_prescriptions
    }

@app.get("/admin/doctors", response_model=List[DoctorResponse])
def get_all_doctors(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    doctors = db.query(Doctor).all()
    return doctors

@app.delete("/admin/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    user = db.query(User).filter(User.id == doctor.user_id).first()
    
    db.delete(doctor)
    if user:
        db.delete(user)
    db.commit()
    
    return {"message": "Doctor deleted successfully"}

@app.get("/admin/pharmacists")
def get_all_pharmacists(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    pharmacists = db.query(Pharmacist).all()
    return [{"id": p.id, "user": p.user} for p in pharmacists]

# ==================== PUBLIC ENDPOINTS ====================

@app.get("/doctors", response_model=List[DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    return doctors

@app.post("/chatbot/message")
def chatbot_message(request: dict):
    user_msg = request.get("message", "").lower()
    
    # Simple keyword-based responses
    if "cardio" in user_msg or "heart" in user_msg:
        return {"reply": "I can help you book an appointment with our Cardiologist, Dr. Sharma. Would you like to schedule a consultation?"}
    elif "derma" in user_msg or "skin" in user_msg:
        return {"reply": "Our Dermatologist, Dr. Patel, is available for skin consultations. Shall I help you book an appointment?"}
    elif "ortho" in user_msg or "bone" in user_msg or "joint" in user_msg:
        return {"reply": "Dr. Kumar, our Orthopedic specialist, can help with bone and joint issues. Would you like to book an appointment?"}
    else:
        return {"reply": f"I understood: '{request.get('message')}'. Please select a doctor and available slot from the booking form to schedule your appointment."}

@app.get("/")
def root():
    return {"message": "Hospify API - Hospital Management System"}
