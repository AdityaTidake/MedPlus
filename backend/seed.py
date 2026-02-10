from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import User, Doctor, Patient, Pharmacist, Appointment
from auth import get_password_hash
from datetime import date, time, timedelta

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Appointment).delete()
        db.query(Doctor).delete()
        db.query(Patient).delete()
        db.query(Pharmacist).delete()
        db.query(User).delete()
        db.commit()
        
        # Create users
        admin_user = User(
            name="Admin User",
            email="admin@hospify.com",
            phone="1234567890",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        
        doctor_user = User(
            name="Dr. Sharma",
            email="doctor@hospify.com",
            phone="1234567891",
            password_hash=get_password_hash("doctor123"),
            role="doctor"
        )
        
        doctor_user2 = User(
            name="Dr. Patel",
            email="patel@hospify.com",
            phone="1234567892",
            password_hash=get_password_hash("doctor123"),
            role="doctor"
        )
        
        doctor_user3 = User(
            name="Dr. Kumar",
            email="kumar@hospify.com",
            phone="1234567893",
            password_hash=get_password_hash("doctor123"),
            role="doctor"
        )
        
        patient_user = User(
            name="John Doe",
            email="patient@hospify.com",
            phone="1234567894",
            password_hash=get_password_hash("patient123"),
            role="patient"
        )
        
        pharma_user = User(
            name="Pharmacist Smith",
            email="pharma@hospify.com",
            phone="1234567895",
            password_hash=get_password_hash("pharma123"),
            role="pharmacist"
        )
        
        db.add_all([admin_user, doctor_user, doctor_user2, doctor_user3, patient_user, pharma_user])
        db.commit()
        
        # Create doctors
        doctor1 = Doctor(
            user_id=doctor_user.id,
            specialization="Cardiology",
            department="Cardiology"
        )
        
        doctor2 = Doctor(
            user_id=doctor_user2.id,
            specialization="Dermatology",
            department="Dermatology"
        )
        
        doctor3 = Doctor(
            user_id=doctor_user3.id,
            specialization="Orthopedics",
            department="Orthopedics"
        )
        
        db.add_all([doctor1, doctor2, doctor3])
        db.commit()
        
        # Create patient
        patient = Patient(
            user_id=patient_user.id,
            age=30,
            gender="male"
        )
        db.add(patient)
        db.commit()
        
        # Create pharmacist
        pharmacist = Pharmacist(user_id=pharma_user.id)
        db.add(pharmacist)
        db.commit()
        
        # Create sample appointments
        today = date.today()
        tomorrow = today + timedelta(days=1)
        
        appointment1 = Appointment(
            patient_id=patient.id,
            doctor_id=doctor1.id,
            date=today,
            time=time(10, 0),
            token_number=1,
            status="scheduled"
        )
        
        appointment2 = Appointment(
            patient_id=patient.id,
            doctor_id=doctor2.id,
            date=tomorrow,
            time=time(14, 0),
            token_number=1,
            status="scheduled"
        )
        
        db.add_all([appointment1, appointment2])
        db.commit()
        
        print("✅ Database seeded successfully!")
        print("\n📋 Test Credentials:")
        print("Admin: admin@hospify.com / admin123")
        print("Doctor: doctor@hospify.com / doctor123")
        print("Patient: patient@hospify.com / patient123")
        print("Pharmacist: pharma@hospify.com / pharma123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
