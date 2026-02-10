from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Float
from sqlalchemy.orm import relationship
from db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, doctor, patient, pharmacist
    
    # Relationships
    doctor = relationship("Doctor", back_populates="user", uselist=False)
    patient = relationship("Patient", back_populates="user", uselist=False)
    pharmacist = relationship("Pharmacist", back_populates="user", uselist=False)

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialization = Column(String, nullable=False)
    department = Column(String, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
    prescriptions = relationship("Prescription", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer)
    gender = Column(String)
    
    # Relationships
    user = relationship("User", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")

class Pharmacist(Base):
    __tablename__ = "pharmacists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Relationships
    user = relationship("User", back_populates="pharmacist")
    dispensary_records = relationship("DispensaryRecord", back_populates="pharmacist")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    token_number = Column(Integer, nullable=False)
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    prescription = relationship("Prescription", back_populates="appointment", uselist=False)

class Prescription(Base):
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), unique=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    notes = Column(String)
    
    # Relationships
    appointment = relationship("Appointment", back_populates="prescription")
    doctor = relationship("Doctor", back_populates="prescriptions")
    patient = relationship("Patient", back_populates="prescriptions")
    items = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan")
    dispensary_record = relationship("DispensaryRecord", back_populates="prescription", uselist=False)

class PrescriptionItem(Base):
    __tablename__ = "prescription_items"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"))
    medicine_name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    
    # Relationships
    prescription = relationship("Prescription", back_populates="items")

class DispensaryRecord(Base):
    __tablename__ = "dispensary_records"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), unique=True)
    pharmacist_id = Column(Integer, ForeignKey("pharmacists.id"))
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String, default="pending")  # pending, paid
    
    # Relationships
    prescription = relationship("Prescription", back_populates="dispensary_record")
    pharmacist = relationship("Pharmacist", back_populates="dispensary_records")
