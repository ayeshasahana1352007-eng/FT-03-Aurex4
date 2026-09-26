def calculate_goal(target, saved, months_remaining):

    remaining = target - saved

    if remaining < 0:
        remaining = 0

    if months_remaining > 0:
        required_monthly = remaining / months_remaining
    else:
        required_monthly = remaining

    if target > 0:
        progress = (saved / target) * 100
    else:
        progress = 0

    return {
        "remaining": round(remaining, 2),
        "required_monthly": round(required_monthly, 2),
        "progress_percentage": round(progress, 2)
    }
