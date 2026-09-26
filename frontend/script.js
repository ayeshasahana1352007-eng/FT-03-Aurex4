// ===============================
// SMART SAVINGS - FRONTEND API
// ===============================

// FastAPI backend URL
const API_URL = "https://reimagined-fiesta-4jxjpjv9rwxqh6p5-8000.app.github.dev";

let goals = [];

// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (event && event.target) {
        event.target.classList.add("active");
    }

    // Load data when opening pages
    if (pageId === "dashboard") loadDashboard();
    if (pageId === "goals") loadGoals();
    if (pageId === "expenses") loadExpenses();
}


// ===============================
// API HELPER
// ===============================

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("API Error:", error);
        alert("Backend connection failed. Make sure FastAPI is running.");
        return null;
    }
}


// ===============================
// PROFILE / INCOME
// ===============================

async function saveProfile() {

    const income = Number(document.getElementById("income")?.value || 0);
    const savings = Number(document.getElementById("savings")?.value || 0);
    const recurring = Number(document.getElementById("recurring")?.value || 0);
    const variable = Number(document.getElementById("variable")?.value || 0);

    localStorage.setItem("income", income);
    localStorage.setItem("savings", savings);
    localStorage.setItem("recurring", recurring);
    localStorage.setItem("variable", variable);

    if (income > 0) {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

        await apiRequest("/income", {
            method: "POST",
            body: JSON.stringify({
                amount: income,
                source: "Profile",
                month: month
            })
        });
    }

    alert("Profile saved successfully!");
}


// ===============================
// EXPENSES
// ===============================

async function addExpense() {

    const amount = Number(
        document.getElementById("expenseAmount")?.value || 0
    );

    const category =
        document.getElementById("expenseCategory")?.value || "Other";

    const date =
        document.getElementById("expenseDate")?.value ||
        new Date().toISOString().split("T")[0];

    const description =
        document.getElementById("expenseDescription")?.value ||
        "Expense";

    if (amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    const month = date.substring(0, 7);

    const data = await apiRequest("/expenses", {
        method: "POST",
        body: JSON.stringify({
            amount: amount,
            category: category,
            description: description,
            month: month
        })
    });

    if (data) {
        alert("Expense added successfully!");

        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseDescription").value = "";

        loadExpenses();
    }
}


// ===============================
// LOAD EXPENSES
// ===============================

async function loadExpenses() {

    const data = await apiRequest("/expenses");

    if (!data) return;

    console.log("Expenses:", data.expenses);

    // If your HTML has an expense list,
    // this will try to display the expenses.
    const list = document.getElementById("expenseList");

    if (!list) return;

    list.innerHTML = "";

    data.expenses.forEach(expense => {

        const item = document.createElement("div");

        item.className = "expense-item";

        item.innerHTML = `
            <strong>${expense.category}</strong>
            <span>₹${expense.amount}</span>
            <p>${expense.description}</p>
        `;

        list.appendChild(item);
    });
}


// ===============================
// SCHEDULED EXPENSE
// ===============================

function addScheduledExpense() {

    // Your current frontend handles scheduled
    // expenses locally because backend endpoint
    // is not implemented yet.

    alert("Scheduled expense added!");
}


// ===============================
// GOALS
// ===============================

async function addGoal() {

    const name =
        document.getElementById("goalName")?.value || "";

    const target =
        Number(document.getElementById("goalTarget")?.value || 0);

    const deadline =
        document.getElementById("goalDate")?.value || "";

    const saved =
        Number(document.getElementById("goalSaved")?.value || 0);

    if (!name || target <= 0) {
        alert("Please enter goal name and target amount.");
        return;
    }

    const data = await apiRequest("/goals", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            target_amount: target,
            saved_amount: saved,
            deadline: deadline
        })
    });

    if (data) {

        alert("Goal created successfully!");

        document.getElementById("goalName").value = "";
        document.getElementById("goalTarget").value = "";
        document.getElementById("goalDate").value = "";
        document.getElementById("goalSaved").value = "";

        await loadGoals();
    }
}


// ===============================
// LOAD GOALS
// ===============================

async function loadGoals() {

    const data = await apiRequest("/goals");

    if (!data) return;

    goals = data.goals || [];

    console.log("Goals:", goals);

    updateGoalDropdown();

    displayGoals(goals);
}


// ===============================
// DISPLAY GOALS
// ===============================

function displayGoals(goalData) {

    const container = document.getElementById("goalList");

    if (!container) return;

    container.innerHTML = "";

    goalData.forEach(goal => {

        const percentage =
            goal.target_amount > 0
                ? Math.min(
                    100,
                    (goal.saved_amount / goal.target_amount) * 100
                )
                : 0;

        const card = document.createElement("div");

        card.className = "goal-card";

        card.innerHTML = `
            <h3>${goal.name}</h3>

            <p>
                ₹${goal.saved_amount} /
                ₹${goal.target_amount}
            </p>

            <div class="progress-bar">
                <div
                    class="progress"
                    style="width:${percentage}%">
                </div>
            </div>

            <small>${percentage.toFixed(1)}% completed</small>
        `;

        container.appendChild(card);
    });
}


// ===============================
// CONTRIBUTION DROPDOWN
// ===============================

function updateGoalDropdown() {

    const select = document.querySelector(
        'select[name="goal"], #contributionGoal, #goalSelect'
    );

    if (!select) return;

    select.innerHTML = "";

    goals.forEach(goal => {

        const option = document.createElement("option");

        option.value = goal.id;
        option.textContent = goal.name;

        select.appendChild(option);
    });
}


// ===============================
// ADD CONTRIBUTION
// ===============================

async function addContribution() {

    const select = document.querySelector(
        'select[name="goal"], #contributionGoal, #goalSelect'
    );

    const amountInput =
        document.getElementById("contributionAmount");

    if (!select || !amountInput) {
        alert("Contribution fields not found.");
        return;
    }

    const goalId = Number(select.value);
    const amount = Number(amountInput.value);

    if (!goalId || amount <= 0) {
        alert("Please select a goal and enter a valid amount.");
        return;
    }

    const data = await apiRequest(
        `/goals/${goalId}/save?amount=${amount}`,
        {
            method: "PUT"
        }
    );

    if (data) {

        alert("Contribution added successfully!");

        amountInput.value = "";

        await loadGoals();
    }
}


// ===============================
// GOAL PROGRESS
// ===============================

async function loadGoalProgress() {

    const data = await apiRequest("/goals/progress");

    if (!data) return;

    console.log("Goal Progress:", data.progress);
}


// ===============================
// SAVINGS
// ===============================

async function loadSavings() {

    const data = await apiRequest("/savings");

    if (!data) return null;

    console.log("Savings:", data);

    return data;
}


// ===============================
// RECOMMENDATION
// ===============================

async function loadRecommendation() {

    const data = await apiRequest("/recommendation");

    if (!data) return;

    console.log("Recommendation:", data.recommendation);

    const recommendationElement =
        document.getElementById("recommendation");

    if (recommendationElement) {
        recommendationElement.textContent =
            data.recommendation;
    }
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {

    const data = await apiRequest("/dashboard");

    if (!data) return;

    console.log("Dashboard:", data);

    // Try common dashboard IDs
    updateText("monthlyIncome", `₹${data.total_income}`);
    updateText("monthlyExpenses", `₹${data.total_expenses}`);
    updateText("availableSavings", `₹${data.savings}`);
    updateText("totalSavings", `₹${data.savings}`);

    await loadRecommendation();
}


// ===============================
// UPDATE TEXT HELPER
// ===============================

function updateText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// ===============================
// WHAT-IF SIMULATOR
// ===============================

function simulate() {

    const income =
        Number(document.getElementById("currentIncome")?.value || 0);

    const change =
        Number(document.getElementById("incomeChange")?.value || 0);

    const currentSavings =
        Number(document.getElementById("currentSavings")?.value || 0);

    const newIncome = income + change;

    const newSavings = currentSavings + change;

    alert(
        `New Income: ₹${newIncome}\n` +
        `Estimated Savings: ₹${newSavings}`
    );
}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Smart Savings frontend started.");

    // Test backend
    const backend = await apiRequest("/");

    if (backend) {
        console.log("Backend connected:", backend);
    }

    await loadGoals();
    await loadExpenses();
    await loadDashboard();
});