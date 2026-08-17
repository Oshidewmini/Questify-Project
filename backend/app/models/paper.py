import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    subject = Column(String)
    exam_board = Column(String)
    qualification_level = Column(String)
    template_type = Column(String)
    total_marks = Column(Integer, default=0)
    duration_minutes = Column(Integer)
    bloom_distribution = Column(JSON)  # Store Bloom's settings
    ao_distribution = Column(JSON)     # Store AO percentages
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_archived = Column(Boolean, default=False)
    
    questions = relationship("Question", back_populates="paper", cascade="all, delete-orphan")
    user = relationship("User")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"))
    text = Column(String, nullable=False)
    answer = Column(String)
    mark_value = Column(Integer, default=1)
    bloom_level = Column(String)
    bloom_confidence = Column(Float)
    ao_code = Column(String)
    question_type = Column(String)
    options = Column(JSON)  # For MCQ options
    correct_option = Column(String)
    is_answerable = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    paper = relationship("Paper", back_populates="questions")
