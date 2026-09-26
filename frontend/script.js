// ================= LOGIN =================

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const message =
        document.getElementById("loginMessage");

    const loginPage =
        document.getElementById("loginPage");

    const appContent =
        document.getElementById("appContent");


    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

        return;
    }


    // Frontend prototype login
    // Backend authentication can be connected later.

    message.textContent = "";


    loginPage.style.display = "none";

    appContent.style.display = "block";


    // Load Lucide icons again
    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}



// ================= PAGE NAVIGATION =================

function showPage(pageId) {

    // Hide all pages

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    // Show selected page

    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    // Update sidebar button

    const buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    // Find the clicked button

    if (event && event.target) {

        const clickedButton =
            event.target.closest(".nav-btn");

        if (clickedButton) {

            clickedButton.classList.add("active");

        }

    }

}



// ================= PROFILE =================

function saveProfile() {

    const income =
        document.getElementById("income").value;

    const savings =
        document.getElementById("savings").value;

    const recurring =
        document.getElementById("recurring").value;

    const variable =
        document.getElementById("variable").value;


    localStorage.setItem(
        "income",
        income
    );

    localStorage.setItem(
        "savings",
        savings
    );

    localStorage.setItem(
        "recurring",
        recurring
    );

    localStorage.setItem(
        "variable",
        variable
    );


    document.getElementById(
        "profileMessage"
    ).innerText =
        "Profile saved successfully!";
}



// ================= EXPENSE =================

function addExpense() {

    const amount =
        document.getElementById(
            "expenseAmount"
        ).value;

    const category =
        document.getElementById(
            "expenseCategory"
        ).value;

    const description =
        document.getElementById(
            "expenseDescription"
        ).value;


    if (!amount) {

        alert(
            "Please enter an amount."
        );

        return;
    }


    const expenseList =
        document.getElementById(
            "expenseList"
        );


    const item =
        document.createElement("div");


    item.className =
        "expense-item";


    item.innerHTML = `

        <span>

            <i data-lucide="receipt"></i>

            ${category}

        </span>

        <strong>
            ₹${amount}
        </strong>

    `;


    expenseList.prepend(item);


    document.getElementById(
        "expenseAmount"
    ).value = "";


    document.getElementById(
        "expenseDescription"
    ).value = "";


    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}



// ================= SCHEDULED EXPENSE =================

function addScheduledExpense() {

    const name =
        document.getElementById(
            "scheduledName"
        ).value;

    const amount =
        document.getElementById(
            "scheduledAmount"
        ).value;

    const date =
        document.getElementById(
            "scheduledDate"
        ).value;


    if (!name || !amount || !date) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    const list =
        document.getElementById(
            "scheduledList"
        );


    const item =
        document.createElement("div");


    item.className =
        "expense-item";


    item.innerHTML = `

        <div>

            <strong>
                ${name}
            </strong>

            <p>
                ${date}
            </p>

        </div>


        <strong>
            ₹${amount}
        </strong>

    `;


    list.prepend(item);


    document.getElementById(
        "scheduledName"
    ).value = "";


    document.getElementById(
        "scheduledAmount"
    ).value = "";

}



// ================= GOAL =================

function addGoal() {

    const name =
        document.getElementById(
            "goalName"
        ).value;


    const target =
        Number(
            document.getElementById(
                "goalTarget"
            ).value
        );


    const saved =
        Number(
            document.getElementById(
                "goalSaved"
            ).value
        );


    if (!name || !target) {

        alert(
            "Please enter goal details."
        );

        return;
    }


    const percentage =
        Math.min(
            (saved / target) * 100,
            100
        );


    const goalList =
        document.getElementById(
            "goalList"
        );


    const card =
        document.createElement("div");


    card.className =
        "section-card";


    card.innerHTML = `

        <div class="goal-header">

            <h3>

                <i data-lucide="target"></i>

                ${name}

            </h3>


            <strong>
                ₹${saved} / ₹${target}
            </strong>

        </div>


        <div class="progress">

            <div
                class="progress-bar"
                style="width:${percentage}%">
            </div>

        </div>


        <p>
            ${percentage.toFixed(0)}% completed
        </p>

    `;


    goalList.appendChild(card);


    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}



// ================= CONTRIBUTION =================

function addContribution() {

    const amount =
        document.getElementById(
            "contributionAmount"
        ).value;


    if (!amount) {

        alert(
            "Please enter contribution amount."
        );

        return;
    }


    alert(
        "Contribution added successfully!"
    );


    document.getElementById(
        "contributionAmount"
    ).value = "";

}



// ================= WHAT IF =================

function simulate() {

    const currentIncome =
        Number(
            document.getElementById(
                "currentIncome"
            ).value
        );


    const incomeChange =
        Number(
            document.getElementById(
                "incomeChange"
            ).value
        );


    const currentSavings =
        Number(
            document.getElementById(
                "currentSavings"
            ).value
        );


    const newIncome =
        currentIncome + incomeChange;


    const expenseEstimate =
        currentIncome - currentSavings;


    const newSavings =
        newIncome - expenseEstimate;


    const result =
        document.getElementById(
            "simulationResult"
        );


    result.innerHTML = `

        <h3>
            Simulation Result
        </h3>


        <p>

            Current Income:

            <strong>
                ₹${currentIncome}
            </strong>

        </p>


        <p>

            New Income:

            <strong>
                ₹${newIncome}
            </strong>

        </p>


        <p>

            Estimated Monthly Savings:

            <strong>
                ₹${newSavings}
            </strong>

        </p>


        <p>

            ${
                newSavings < currentSavings

                ? "Your savings capacity has decreased."

                : "Your savings capacity has improved."
            }

        </p>

    `;

}



// ================= CHARTS =================

const expenseChart =
    document.getElementById(
        "expenseChart"
    );


if (expenseChart) {

    new Chart(
        expenseChart,
        {

            type: "doughnut",

            data: {

                labels: [

                    "Food",
                    "Transport",
                    "Shopping",
                    "Bills",
                    "Entertainment"

                ],


                datasets: [{

                    data: [

                        4000,
                        2000,
                        3500,
                        5000,
                        1500

                    ]

                }]

            }

        }
    );

}



const monthlyChart =
    document.getElementById(
        "monthlyChart"
    );


if (monthlyChart) {

    new Chart(
        monthlyChart,
        {

            type: "bar",

            data: {

                labels: [

                    "May",
                    "June",
                    "July",
                    "August",
                    "September"

                ],


                datasets: [{

                    label:
                        "Monthly Expenses",

                    data: [

                        16000,
                        17500,
                        15000,
                        19000,
                        18000

                    ]

                }]

            }

        }
    );

}
