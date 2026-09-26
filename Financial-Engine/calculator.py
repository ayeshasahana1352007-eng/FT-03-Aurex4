def calculate_total_expenses(expenses, scheduled_expenses):
    return expenses + scheduled_expenses


def calculate_available_savings(
    income,
    expenses,
    scheduled_expenses
):
    total_expenses = calculate_total_expenses(
        expenses,
        scheduled_expenses
    )

    return income - total_expenses


def calculate_savings_rate(income, available_savings):

    if income <= 0:
        return 0

    return (available_savings / income) * 100


def calculate_expense_ratio(income, expenses):

    if income <= 0:
        return 0

    return (expenses / income) * 100


def calculate_monthly_scheduled_allocation(
    amount,
    months_remaining
):

    if months_remaining <= 0:
        return amount

    return amount / months_remaining
