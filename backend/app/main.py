from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import auth, groups, expenses, settlements
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Expense Tracker API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(expenses.router)
app.include_router(settlements.router)


@app.get("/")
def root():
    return {
        "message": "Expense Tracker API is running!"
    }