from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv("backend/.env")

MONGO_URL = os.getenv("MONGO_URL")

# MongoDB connection
client = MongoClient(MONGO_URL)
db = client["smart_savings"]

goals_collection = db["goals"]
income_collection = db["income"]
expenses_collection = db["expenses"]

# FastAPI app
app = FastAPI(title="Smart Savings API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# MODELS
# -------------------------

class Goal(BaseModel):
    name: str
    target_amount: float
    saved_amount: float = 0
    deadline: str


class Income(BaseModel):
    amount: float
    source: str
    month: str


class Expense(BaseModel):
    amount: float
    category: str
    description: str
    month: str


# -------------------------
# HOME
# -------------------------

@app.get("/")
def home():
    return {
        "message": "Smart Savings Backend is running"
    }


# -------------------------
# GOALS
# -------------------------

@app.get("/goals")
def get_goals():
    goals = list(goals_collection.find({}, {"_id": 0}))
    return {
        "goals": goals
    }


@app.post("/goals")
def create_goal(goal: Goal):

    last_goal = goals_collection.find_one(
        sort=[("id", -1)]
    )

    if last_goal:
        new_id = last_goal["id"] + 1
    else:
        new_id = 1

    new_goal = {
        "id": new_id,
        "name": goal.name,
        "target_amount": goal.target_amount,
        "saved_amount": goal.saved_amount,
        "deadline": goal.deadline
    }

    result = goals_collection.insert_one(new_goal)

    new_goal["_id"] = str(result.inserted_id)

    return {
        "message": "Goal created successfully",
        "goal": new_goal
    }


@app.put("/goals/{goal_id}/save")
def save_to_goal(goal_id: int, amount: float):

    goal = goals_collection.find_one({"id": goal_id})

    if not goal:
        return {
            "message": "Goal not found"
        }

    new_saved_amount = goal.get("saved_amount", 0) + amount

    goals_collection.update_one(
        {"id": goal_id},
        {
            "$set": {
                "saved_amount": new_saved_amount
            }
        }
    )

    return {
        "message": "Amount saved successfully",
        "goal_id": goal_id,
        "saved_amount": new_saved_amount
    }


@app.get("/goals/progress")
def goal_progress():

    goals = list(goals_collection.find({}, {"_id": 0}))

    result = []

    for goal in goals:

        target = goal.get("target_amount", 0)
        saved = goal.get("saved_amount", 0)

        if target > 0:
            percentage = (saved / target) * 100
        else:
            percentage = 0

        result.append({
            "id": goal.get("id"),
            "name": goal.get("name"),
            "target_amount": target,
            "saved_amount": saved,
            "progress_percentage": round(percentage, 2)
        })

    return {
        "progress": result
    }


# -------------------------
# INCOME
# -------------------------

@app.get("/income")
def get_income():

    income = list(
        income_collection.find({}, {"_id": 0})
    )

    return {
        "income": income
    }


@app.post("/income")
def add_income(income: Income):

    last_income = income_collection.find_one(
        sort=[("id", -1)]
    )

    if last_income:
        new_id = last_income["id"] + 1
    else:
        new_id = 1

    new_income = {
        "id": new_id,
        "amount": income.amount,
        "source": income.source,
        "month": income.month
    }

    result = income_collection.insert_one(new_income)

    new_income["_id"] = str(result.inserted_id)

    return {
        "message": "Income added successfully",
        "income": new_income
    }


# -------------------------
# EXPENSES
# -------------------------

@app.get("/expenses")
def get_expenses():

    expenses = list(
        expenses_collection.find({}, {"_id": 0})
    )

    return {
        "expenses": expenses
    }


@app.post("/expenses")
def add_expense(expense: Expense):

    last_expense = expenses_collection.find_one(
        sort=[("id", -1)]
    )

    if last_expense:
        new_id = last_expense["id"] + 1
    else:
        new_id = 1

    new_expense = {
        "id": new_id,
        "amount": expense.amount,
        "category": expense.category,
        "description": expense.description,
        "month": expense.month
    }

    result = expenses_collection.insert_one(new_expense)

    new_expense["_id"] = str(result.inserted_id)

    return {
        "message": "Expense added successfully",
        "expense": new_expense
    }


# -------------------------
# SAVINGS
# -------------------------

@app.get("/savings")
def get_savings():

    income_data = list(
        income_collection.find({}, {"_id": 0})
    )

    expense_data = list(
        expenses_collection.find({}, {"_id": 0})
    )

    total_income = sum(
        item.get("amount", 0)
        for item in income_data
    )

    total_expenses = sum(
        item.get("amount", 0)
        for item in expense_data
    )

    savings = total_income - total_expenses

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "savings": savings
    }


# -------------------------
# RECOMMENDATION
# -------------------------

@app.get("/recommendation")
def recommendation():

    income_data = list(
        income_collection.find({}, {"_id": 0})
    )

    expense_data = list(
        expenses_collection.find({}, {"_id": 0})
    )

    total_income = sum(
        item.get("amount", 0)
        for item in income_data
    )

    total_expenses = sum(
        item.get("amount", 0)
        for item in expense_data
    )

    savings = total_income - total_expenses

    if total_income == 0:

        message = "Add your income details to get a savings recommendation."

    elif savings <= 0:

        message = "Your expenses are high. Try reducing unnecessary spending."

    elif savings < total_income * 0.2:

        message = "Try to save at least 20% of your income."

    else:

        message = "Good job! You are maintaining a healthy savings habit."

    return {
        "recommendation": message
    }


# -------------------------
# DASHBOARD
# -------------------------

@app.get("/dashboard")
def dashboard():

    income_data = list(
        income_collection.find({}, {"_id": 0})
    )

    expense_data = list(
        expenses_collection.find({}, {"_id": 0})
    )

    goals = list(
        goals_collection.find({}, {"_id": 0})
    )

    total_income = sum(
        item.get("amount", 0)
        for item in income_data
    )

    total_expenses = sum(
        item.get("amount", 0)
        for item in expense_data
    )

    savings = total_income - total_expenses

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "savings": savings,
        "goals": goals
    }