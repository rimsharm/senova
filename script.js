function handleGoogleSignIn(response) {
    console.log("Google Sign-In response:", response);
    // Process the user info here (send it to your backend, etc.)
}

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const selectField = document.getElementById("pitch-category");
    const selectedFieldsContainer = document.getElementById("selected-fields");

    selectField.addEventListener("change", function () {
        const selectedOptions = Array.from(selectField.selectedOptions).map(option => option.value);
        updateSelectedFields(selectedOptions);
    });

    function updateSelectedFields(selectedOptions) {
        selectedFieldsContainer.innerHTML = ""; // Clear previous selections
        selectedOptions.forEach(option => {
            const div = document.createElement("div");
            div.classList.add("selected-option");
            div.textContent = option;

            // Remove button (cross ❌)
            const removeBtn = document.createElement("span");
            removeBtn.innerHTML = " ❌";
            removeBtn.classList.add("remove-option");
            removeBtn.onclick = function () {
                removeSelection(option);
            };

            div.appendChild(removeBtn);
            selectedFieldsContainer.appendChild(div);
        });
    }

    function removeSelection(option) {
        for (let i = 0; i < selectField.options.length; i++) {
            if (selectField.options[i].value === option) {
                selectField.options[i].selected = false;
                break;
            }
        }
        updateSelectedFields(Array.from(selectField.selectedOptions).map(option => option.value));
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Wait for navbar to be loaded
    const checkNavbarReady = setInterval(() => {
        const dropdown = document.getElementById("notification-dropdown");
        if (dropdown) {
            clearInterval(checkNavbarReady);
            initNotifications();
        }
    }, 100);
});

function toggleNotifications() {
    const dropdown = document.getElementById("notification-dropdown");
    if (dropdown) dropdown.classList.toggle("hidden");
}

function initNotifications() {
    const list = document.getElementById("notification-list");
    const count = document.getElementById("notification-count");

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [
        "Jon Doe pitched to you!",
        "Your request to Maria was accepted.",
        "The request you sent to Israa was rejected."
    ];

    if (notifications.length > 0) {
        count.textContent = notifications.length;
        notifications.forEach(note => {
            const item = document.createElement("p");
            item.classList.add("notification-item");  // 🔹 Add this line
            item.textContent = note;
            list.appendChild(item);
        });
    } else {
        list.innerHTML = "<p class='no-updates'>No new notifications</p>";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const matchesList = document.getElementById("matches-list");

    if (matchesList) {
        const matches = [
            { name: "John Doe", type: "individual", fields: ["Artificial Intelligence", "Machine Learning"], description: "Looking for AI and ML collaboration.", status: "Requested (Pending)", pitchedTo: "user" },
            { name: ["Jane Smith", "Alex Johnson"], type: "group", fields: ["Computer Graphics"], description: "Team working on rendering projects.", status: "Accept / Reject", pitchedTo: "them" },
            { name: "Michael Johnson", type: "individual", fields: ["Machine Learning", "Data Science"], description: "Exploring data analysis using deep learning.", status: "Requested (Rejected)", pitchedTo: "user" },
            { name: ["Alice Brown", "Sam Wilson"], type: "group", fields: ["Computer Vision", "Artificial Intelligence"], description: "Developing a new object detection model.", status: "Accept / Reject", pitchedTo: "them" },
            { name: "Sara Davis", type: "individual", fields: ["Data Science", "Mathematics"], description: "Looking for partners for mathematical modeling.", status: "Accept / Reject", pitchedTo: "them" },
            { name: "Chris Lee", type: "individual", fields: ["Cybersecurity"], description: "Building a secure network protocol.", status: "Requested (Finalize)", pitchedTo: "user" }
        ];

        let currentFilterType = 'all';
        let currentFieldFilter = 'all';
        let currentTypeFilter = 'all';

        function renderMatches() {
            matchesList.innerHTML = "";

            const filteredMatches = matches.filter(match =>
                (currentFilterType === 'all' ||
                    (currentFilterType === 'pitches' && match.pitchedTo === 'them') ||
                    (currentFilterType === 'requests' && match.pitchedTo === 'user')) &&
                (currentFieldFilter === 'all' || match.fields.includes(currentFieldFilter)) &&
                (currentTypeFilter === 'all' || match.type === currentTypeFilter)
            );

            filteredMatches.forEach(match => {
                const matchCard = document.createElement("div");
                matchCard.classList.add("match-card");

                const nameDisplay = Array.isArray(match.name) ? match.name.join(", ") : match.name;
                const typeLabel = `<div class="type-label" style="color: grey;">${match.type.charAt(0).toUpperCase() + match.type.slice(1)}</div>`;

                matchCard.innerHTML = `
                    <div class="card-content">
                        <div class="card-section name" style="color: #154063;">
                            ${nameDisplay}
                            ${typeLabel}
                        </div>
                        <div class="card-section description">${match.description}</div>
                        <div class="card-section fields">${match.fields.join(", ")}</div>
                        <div class="card-section status">${getStatusButtons(match.status)}</div>
                    </div>
                `;

                matchesList.appendChild(matchCard);
            });
        }

        function getStatusButtons(status) {
            if (status === "Accept / Reject") {
                return `<button class="accept-btn">Accept</button> <button class="reject-btn">Reject</button>`;
            } else if (status === "Requested (Finalize)") {
                return `<div>
                            <span>Requested (Accepted)</span><br>
                            <button class="finalize-btn" onclick="finalizeRequest(this)">Finalize</button>
                        </div>`;
            } else {
                return `<span>${status}</span>`;
            }
        }

        function finalizeRequest(button) {
            const cardSection = button.parentElement;
            cardSection.innerHTML = `<span>Requested (Accepted)</span><br><span>Finalized</span>`;
        }

        // Global functions (attached to window so HTML onclick still works)
        window.filterMatches = function (type) {
            currentFilterType = type;
            renderMatches();
            document.querySelectorAll(".tab-option").forEach(btn => btn.classList.remove("active"));
            document.querySelector(`.tab-option[onclick="filterMatches('${type}')"]`)?.classList.add("active");
        };

        window.filterByField = function (field) {
            currentFieldFilter = field;
            renderMatches();
        };

        window.filterByType = function (type) {
            currentTypeFilter = type;
            renderMatches();
        };

        filterMatches('all'); // Default view
    }
});

// PITCH PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
    // Show individual/group form
    window.showForm = function(type) {
        const individualForm = document.getElementById("individual-form");
        const groupForm = document.getElementById("group-form");

        if (individualForm && groupForm) {
            individualForm.style.display = "none";
            groupForm.style.display = "none";

            if (type === "individual") {
                individualForm.style.display = "block";
                selectedForm = "individual";
            } else {
                groupForm.style.display = "block";
                selectedForm = "group";
            }
            updateButtonStyles();
        }
    };

    // Highlight selected button
    function updateButtonStyles() {
        const individualBtn = document.getElementById('individualBtn');
        const groupBtn = document.getElementById('groupBtn');
        if (!individualBtn || !groupBtn) return;

        if (selectedForm === 'individual') {
            individualBtn.style.backgroundColor = '#154063';
            individualBtn.style.color = 'white';
            groupBtn.style.backgroundColor = 'white';
            groupBtn.style.color = '#154063';
        } else {
            groupBtn.style.backgroundColor = '#154063';
            groupBtn.style.color = 'white';
            individualBtn.style.backgroundColor = 'white';
            individualBtn.style.color = '#154063';
        }
    }

    // Update character count for title & description
    const titleInput = document.getElementById("pitch-title");
    const descriptionInput = document.getElementById("pitch-description");
    const titleCount = document.getElementById("title-count");
    const descriptionCount = document.getElementById("description-count");

    if (titleInput && titleCount) {
        const titleMax = 50;
        titleInput.addEventListener("input", () => {
            if (titleInput.value.length > titleMax) {
                titleInput.value = titleInput.value.slice(0, titleMax);
            }
            titleCount.textContent = `${titleInput.value.length} / ${titleMax}`;
        });
    }

    if (descriptionInput && descriptionCount) {
        const descMax = 250;
        descriptionInput.addEventListener("input", () => {
            if (descriptionInput.value.length > descMax) {
                descriptionInput.value = descriptionInput.value.slice(0, descMax);
            }
            descriptionCount.textContent = `${descriptionInput.value.length} / ${descMax}`;
        });
    }

    const groupTitleInput = document.getElementById("group-title");
    const groupTitleCount = document.getElementById("group-title-count");
    const groupDescriptionInput = document.getElementById("group-description");
    const groupDescriptionCount = document.getElementById("group-description-count");

    if (groupTitleInput && groupTitleCount) {
        const maxGroupTitle = 50;
        groupTitleInput.addEventListener("input", () => {
            if (groupTitleInput.value.length > maxGroupTitle) {
                groupTitleInput.value = groupTitleInput.value.slice(0, maxGroupTitle);
            }
            groupTitleCount.textContent = `${groupTitleInput.value.length} / ${maxGroupTitle}`;
        });
    }

    if (groupDescriptionInput && groupDescriptionCount) {
        groupDescriptionInput.addEventListener("input", function () {
            groupDescriptionCount.textContent = `${groupDescriptionInput.value.length} / 250`;
        });
    }

    // Add member fields for group pitch
    window.updateMemberFields = function () {
        const memberCount = document.getElementById("group-members")?.value;
        const memberFieldsContainer = document.getElementById("member-fields");
        if (!memberCount || !memberFieldsContainer) return;

        memberFieldsContainer.innerHTML = "";
        for (let i = 1; i <= memberCount; i++) {
            const label = document.createElement("label");
            label.textContent = `Member ${i} Name:`;
            label.setAttribute("for", `member-${i}`);

            const input = document.createElement("input");
            input.type = "text";
            input.id = `member-${i}`;
            input.name = `member-${i}`;
            input.placeholder = `Enter name of member ${i}`;
            input.required = true;

            memberFieldsContainer.appendChild(label);
            memberFieldsContainer.appendChild(input);
        }
    };

    // Handle interest box selection
    function setupInterestSelection(containerSelector, displaySelector) {
        const interestBoxes = document.querySelectorAll(containerSelector + " .interest-box");
        const selectedFieldsContainer = document.querySelector(displaySelector);
        if (!interestBoxes.length || !selectedFieldsContainer) return;

        let selectedInterests = new Set();

        interestBoxes.forEach(box => {
            box.addEventListener("click", function () {
                const value = this.getAttribute("data-value");
                if (!selectedInterests.has(value)) {
                    selectedInterests.add(value);
                    updateSelectedFields(selectedFieldsContainer, selectedInterests);
                }
            });
        });

        function updateSelectedFields(container, selectedSet) {
            container.innerHTML = "";
            selectedSet.forEach(option => {
                const div = document.createElement("div");
                div.classList.add("selected-option");
                div.textContent = option;

                const removeBtn = document.createElement("span");
                removeBtn.innerHTML = " ❌";
                removeBtn.classList.add("remove-option");
                removeBtn.onclick = function () {
                    selectedSet.delete(option);
                    updateSelectedFields(container, selectedSet);
                };

                div.appendChild(removeBtn);
                container.appendChild(div);
            });
        }
    }

    setupInterestSelection("#interest-options", "#selected-fields");
    setupInterestSelection("#group-interest-options", "#group-selected-fields");

    const pitchForms = document.querySelectorAll(".pitch-form form");
    pitchForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            // TODO: Add backend request here if needed
            window.location.href = "pitch-success.html";
        });
    });

    // ✅ Combine year + semester selections into one string
    document.querySelector('#individual-form form')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const year = document.getElementById('individual-year')?.value;
        const semester = document.getElementById('individual-semester')?.value;
        const fullSemester = `${semester} ${year}`;

        console.log('Individual Pitch Semester:', fullSemester);
        // You can now include `fullSemester` in your form data handling
    });

    document.querySelector('#group-form form')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const year = document.getElementById('group-year')?.value;
        const semester = document.getElementById('group-semester')?.value;
        const fullSemester = `${semester} ${year}`;

        console.log('Group Pitch Semester:', fullSemester);
        // You can now include `fullSemester` in your form data handling
    });
});

// =================== REQUESTS PAGE LOGIC ===================
const members = [
    { name: "John Doe", type: "individual", fields: ["Artificial Intelligence", "Machine Learning"], description: "Looking for AI and ML collaboration." },
    { name: "Michael Johnson", type: "individual", fields: ["Data Science"], description: "Exploring data analysis using deep learning." },
    { name: "Emily Zhang", type: "individual", fields: ["Cybersecurity"], description: "Building secure authentication systems." },
    { name: "Ayaan Patel", type: "individual", fields: ["Cloud Computing"], description: "Interested in cloud infrastructure and scalability." },
    { name: "Fatima Khan", type: "individual", fields: ["Internet of Things"], description: "Working on IoT-based home automation." },
    { name: "Lucas Ferreira", type: "individual", fields: ["Web Development"], description: "Frontend-focused developer working on React apps." },
    { name: "Nora Ibrahim", type: "individual", fields: ["Machine Learning"], description: "Developing ML models for predictive analytics." },
    { name: "Leo Tran", type: "individual", fields: ["Mobile App Development"], description: "Building cross-platform mobile apps." },
    { name: "Sophia Chen", type: "individual", fields: ["Game Development"], description: "Game designer focused on Unity and Unreal Engine." },
    { name: "Omar Al-Sayed", type: "individual", fields: ["Blockchain"], description: "Exploring smart contracts and DeFi applications." },
    { name: "Zara Malik", type: "individual", fields: ["AR/VR"], description: "Developing immersive VR learning environments." },
    { name: "Ravi Sharma", type: "individual", fields: ["Embedded Systems"], description: "Working on microcontroller-based projects." },
    { name: "Lina Park", type: "individual", fields: ["Software Engineering"], description: "Focused on large-scale system design." }
];

const groups = [
    { name: ["Jane Smith", "Alex Johnson"], type: "group", fields: ["Cloud Computing", "Web Development"], description: "Developing a scalable SaaS platform." },
    { name: ["Alice Brown", "Sam Wilson"], type: "group", fields: ["Artificial Intelligence", "Computer Vision"], description: "Building an object detection model for smart surveillance." },
    { name: ["Rayan Ahmed", "Mina Saeed"], type: "group", fields: ["Blockchain", "Cybersecurity"], description: "Creating a secure blockchain voting system." },
    { name: ["Huda Khan", "James Park", "Liam Chen"], type: "group", fields: ["Internet of Things", "Embedded Systems"], description: "Smart home automation project using IoT sensors." },
    { name: ["Meera Iqbal", "Yusuf Salem"], type: "group", fields: ["Machine Learning", "Data Science"], description: "Working on ML models to detect academic plagiarism." },
    { name: ["Tara Brooks", "Noah Lee"], type: "group", fields: ["Game Development", "AR/VR"], description: "Designing a multiplayer AR game for education." }
];

let currentFieldFilter = 'all';
let selectedType = null;

function filterRequestByField(field) {
    currentFieldFilter = field;
    chooseType(selectedType);
}

function chooseType(type) {
    selectedType = type;

    document.getElementById('membersBtn')?.classList.remove('active');
    document.getElementById('groupsBtn')?.classList.remove('active');

    if (type === 'members') {
        document.getElementById('membersBtn')?.classList.add('active');
    } else {
        document.getElementById('groupsBtn')?.classList.add('active');
    }

    document.querySelector('.filters-container').style.display = 'flex';

    const requestContainer = document.getElementById("requestContainer");
    requestContainer.innerHTML = "";
    const list = type === 'members' ? members : groups;

    const filteredList = list.filter(match =>
        currentFieldFilter === 'all' || match.fields.includes(currentFieldFilter)
    );

    filteredList.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");

        const nameDisplay = Array.isArray(match.name) ? match.name.join(", ") : match.name;
        const typeLabel = `<div class="type-label" style="color: grey;">${match.type.charAt(0).toUpperCase() + match.type.slice(1)}</div>`;

        matchCard.innerHTML = `
            <div class="card-content">
                <div class="card-section name" style="color: #154063;">
                    ${nameDisplay}
                    ${typeLabel}
                </div>
                <div class="card-section description">${match.description}</div>
                <div class="card-section fields">${match.fields.join(", ")}</div>
                <div class="card-section status">
                    <button class="request-btn" onclick="handleRequest('${nameDisplay}', 'Requested')">Request</button>
                </div>
            </div>
        `;

        requestContainer.appendChild(matchCard);
    });
}

function handleRequest(name, action) {
    const storedHistory = JSON.parse(localStorage.getItem("requestHistory")) || [];
    storedHistory.push({ name, action });
    localStorage.setItem("requestHistory", JSON.stringify(storedHistory));

    const buttons = document.querySelectorAll('.request-btn');
    buttons.forEach(btn => {
        if (btn.textContent === "Request" && btn.closest('.card-content').textContent.includes(name)) {
            const parent = btn.parentElement;
            parent.innerHTML = `<span style="color: #154063; font-weight: 500;">Requested</span>`;
        }
    });
}

// ================= Request History Page Logic =================
function renderHistoryPage() {
    const container = document.getElementById("historyContainer");
    if (!container) return;

    const history = JSON.parse(localStorage.getItem("requestHistory")) || [];

    function renderHistory() {
        container.innerHTML = "";

        if (history.length === 0) {
            container.innerHTML = "<p>No history available.</p>";
            return;
        }

        history.forEach((entry, index) => {
            const card = document.createElement("div");
            card.className = "history-card";

            card.innerHTML = `
                <p><strong style="color: #154063;">${entry.name}</strong> — ${entry.action}</p>
                ${entry.action === "Passed" ? `<button class="reconsider-btn" onclick="reconsider(${index})">Reconsider</button>` : ''}
            `;

            container.appendChild(card);
        });
    }

    window.reconsider = function(index) {
        history[index].action = "Requested";
        localStorage.setItem("requestHistory", JSON.stringify(history));
        renderHistory();
    };

    renderHistory();
}

document.addEventListener("DOMContentLoaded", renderHistoryPage);

// Profile picture preview
function previewProfilePic() {
  const input = document.getElementById('profile-pic-input');
  const img = document.getElementById('profile-pic-preview');
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      img.style.display = 'block';
      document.querySelector('.add-icon').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

// Automatically bind the input when DOM loads
document.addEventListener("DOMContentLoaded", function () {
  const picInput = document.getElementById('profile-pic-input');
  if (picInput) {
    picInput.addEventListener('change', previewProfilePic);
  }
});






