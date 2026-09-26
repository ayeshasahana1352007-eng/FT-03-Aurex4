from calculator import calculate_available_savings
from planner import calculate_goal
from predictor import calculate_prediction
from recommender import generate_recommendations


def financial_engine(data):

    # 1. Calculate available savings
    available_savings = calculate_available_savings(
        data["income"],
        data["expenses"],
        data["scheduled_expenses"]
    )

    goal_results = []

    # 2. Process each goal
    for goal in data["goals"]:

        goal_result = calculate_goal(
            goal["target"],
            goal["saved"],
            goal["months_remaining"]
        )

        prediction = calculate_prediction(
            goal["target"],
            goal["saved"],
            goal["monthly_contribution"],
            goal["months_remaining"]
        )

        goal_result["prediction"] = prediction

        goal_results.append({
            "name": goal["name"],
            **goal_result
        })

    # 3. Generate recommendations
    recommendations = generate_recommendations(
        available_savings,
        goal_results
    )

    # 4. Return complete result
    return {
        "available_savings": available_savings,
        "goals": goal_results,
        "recommendations": recommendations
    }


# Test data
if __name__ == "__main__":

    financial_data = {
        "income": 30000,
        "expenses": 18000,
        "scheduled_expenses": 2000,

        "goals": [
            {
                "name": "Laptop",
                "target": 60000,
                "saved": 10000,
                "months_remaining": 5,
                "monthly_contribution": 7000
            }
        ]
    }

    result = financial_engine(financial_data)

    print("\n===== FINANCIAL ENGINE =====")
    print("Available Savings:", result["available_savings"])

    for goal in result["goals"]:
        print("\nGoal:", goal["name"])
        print("Remaining:", goal["remaining"])
        print("Progress:", goal["progress_percentage"], "%")
        print("Required Monthly:", goal["required_monthly"])
        print("Prediction:", goal["prediction"])

    print("\nRecommendations:")

    for recommendation in result["recommendations"]:
        print("-", recommendation)
