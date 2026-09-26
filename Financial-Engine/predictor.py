def calculate_prediction(target, saved, monthly_contribution, target_months):

    remaining = target - saved

    if remaining <= 0:
        return {
            "estimated_months": 0,
            "status": "Goal already completed"
        }

    if monthly_contribution <= 0:
        return {
            "estimated_months": None,
            "status": "No contribution available"
        }

    estimated_months = remaining / monthly_contribution

    if estimated_months <= target_months:
        status = "On track"
    else:
        status = "May miss target date"

    return {
        "estimated_months": round(estimated_months, 2),
        "status": status
    }
