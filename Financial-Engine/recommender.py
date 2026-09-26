def generate_recommendations(available_savings, goals):

    recommendations = []

    if available_savings <= 0:
        recommendations.append(
            "Your current income is not sufficient to cover planned expenses."
        )

    for goal in goals:

        prediction = goal["prediction"]

        if prediction["status"] == "May miss target date":
            recommendations.append(
                f"Increase your monthly contribution for {goal['name']} "
                f"or consider extending the target date."
            )

        elif prediction["status"] == "On track":
            recommendations.append(
                f"You are currently on track for your {goal['name']} goal."
            )

    if not recommendations:
        recommendations.append(
            "Your current financial plan is stable."
        )

    return recommendations
