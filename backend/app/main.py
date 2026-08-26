from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import user, paper
from .api import papers, generate

# Create all tables (in MVP we use this instead of Alembic for immediate setup)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Questify API", version="1.0.0")

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(papers.router, prefix="/api/v1")
app.include_router(generate.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Questify API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

