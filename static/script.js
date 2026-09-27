
const API_URL =
    "https://oqhvkrbznl.execute-api.ap-south-1.amazonaws.com/dev/requests";

const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const loadRequestsButton = document.getElementById("loadRequests");
const requestsContainer = document.getElementById("requests");


// =========================
// Submit Support Request
// =========================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "Submitting your request...";

    const requestData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim()
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {

            message.textContent =
                `Request submitted successfully. Request ID: ${result.requestId}`;

            form.reset();

        } else {

            message.textContent =
                result.message || "Failed to submit request.";

        }

    } catch (error) {

        console.error("Error:", error);

        message.textContent =
            "Unable to connect to the server.";

    }

});


// =========================
// Retrieve Support Requests
// =========================

loadRequestsButton.addEventListener("click", async function () {

    requestsContainer.innerHTML = "<p>Loading your requests...</p>";

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok) {

            requestsContainer.innerHTML = `
                <p>${result.message || "Failed to retrieve requests."}</p>
            `;

            return;
        }

        const requests = result.data || [];

        if (requests.length === 0) {

            requestsContainer.innerHTML =
                "<p>No support requests found.</p>";

            return;
        }

        requestsContainer.innerHTML = "";


        // =========================
        // Create Request Cards
        // =========================

        requests.forEach(request => {

            const requestElement = document.createElement("div");

            requestElement.className = "request-card";

            requestElement.innerHTML = `

                <h3>
                    ${request.requestId}
                </h3>

                <div class="request-row">
                    <strong>Name:</strong>
                    ${request.name}
                </div>

                <div class="request-row">
                    <strong>Email:</strong>
                    ${request.email}
                </div>

                <div class="request-row">
                    <strong>Category:</strong>
                    ${request.category}
                </div>

                <div class="request-row">
                    <strong>Description:</strong>
                    ${request.description}
                </div>

                <div class="request-row">
                    <strong>Status:</strong>

                    <span class="status">
                        ${request.status}
                    </span>
                </div>

                <div class="request-row">
                    <strong>Created:</strong>
                    ${request.createdAt}
                </div>

            `;

            requestsContainer.appendChild(requestElement);

        });

    } catch (error) {

        console.error("Error:", error);

        requestsContainer.innerHTML = `
            <p>Unable to connect to the server.</p>
        `;

    }

});

