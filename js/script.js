/* ============================================
   Study Scheduler - JavaScript
   Author: Abid Fahad
   Simple JS for first HTML course
   ============================================ */


/* ----- Storage helpers -----
   We save data in localStorage so it stays after page refresh.
   We store three things: accounts, the current session, and tasks. */

// Get accounts list from localStorage
function getAccounts() {
    var data = localStorage.getItem("accounts");
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}

// Save accounts list back to localStorage
function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

// Get current logged-in user (or null)
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

// Save who is logged in
function setCurrentUser(username) {
    localStorage.setItem("currentUser", username);
}

// Log out
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Get all tasks
function getAllTasks() {
    var data = localStorage.getItem("tasks");
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}

// Save all tasks
function saveAllTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get only the current user's tasks
function getMyTasks() {
    var user = getCurrentUser();
    var all = getAllTasks();
    var mine = [];
    for (var i = 0; i < all.length; i++) {
        if (all[i].owner === user) {
            mine.push(all[i]);
        }
    }
    return mine;
}


/* ----- Setup demo account on first visit ----- */
function setupDemoAccount() {
    var accounts = getAccounts();
    if (accounts.length === 0) {
        accounts.push({
            username: "demo",
            password: "study2025"
        });
        saveAccounts(accounts);
    }
}


/* ----- Page protection ----- */
function requireLogin() {
    if (getCurrentUser() === null) {
        window.location.href = "login.html";
    }
}


/* ----- Login function ----- */
function doLogin() {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    var errorBox = document.getElementById("login-error");

    if (username === "" || password === "") {
        errorBox.textContent = "Please enter both username and password.";
        return;
    }

    var accounts = getAccounts();
    var found = false;
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username === username && accounts[i].password === password) {
            found = true;
        }
    }

    if (found === false) {
        errorBox.textContent = "Wrong username or password.";
        return;
    }

    setCurrentUser(username);
    window.location.href = "scheduler.html";
}


/* ----- Signup function ----- */
function doSignup() {
    var username = document.getElementById("signup-username").value;
    var password = document.getElementById("signup-password").value;
    var confirm = document.getElementById("signup-confirm").value;
    var errorBox = document.getElementById("signup-error");

    if (username.length < 3) {
        errorBox.textContent = "Username must be at least 3 characters.";
        return;
    }

    if (password.length < 6) {
        errorBox.textContent = "Password must be at least 6 characters.";
        return;
    }

    if (password !== confirm) {
        errorBox.textContent = "Passwords do not match.";
        return;
    }

    var accounts = getAccounts();
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username === username) {
            errorBox.textContent = "That username is already taken.";
            return;
        }
    }

    accounts.push({ username: username, password: password });
    saveAccounts(accounts);
    setCurrentUser(username);
    window.location.href = "scheduler.html";
}


/* ----- Switch between login and signup panels ----- */
function showSignup() {
    document.getElementById("login-panel").style.display = "none";
    document.getElementById("signup-panel").style.display = "block";
}

function showLogin() {
    document.getElementById("signup-panel").style.display = "none";
    document.getElementById("login-panel").style.display = "block";
}


/* ----- Image gallery for home page ----- */
var galleryImages = [
    {
        url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
        caption: "A quiet study corner with books and warm light."
    },
    {
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
        caption: "Open books on a classical scholar's desk."
    },
    {
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
        caption: "A leather planner and a freshly poured espresso."
    },
    {
        url: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=1200&q=80",
        caption: "The library at dusk - where deadlines are met."
    }
];

var currentImage = 0;

function showImage(index) {
    var img = document.getElementById("gallery-img");
    var cap = document.getElementById("gallery-caption");
    img.src = galleryImages[index].url;
    img.alt = galleryImages[index].caption;
    cap.textContent = galleryImages[index].caption;
}

function nextImage() {
    currentImage = currentImage + 1;
    if (currentImage >= galleryImages.length) {
        currentImage = 0;
    }
    showImage(currentImage);
}

function prevImage() {
    currentImage = currentImage - 1;
    if (currentImage < 0) {
        currentImage = galleryImages.length - 1;
    }
    showImage(currentImage);
}


/* ----- Clock at bottom of page ----- */
function updateClock() {
    var clockEl = document.getElementById("live-clock");
    if (clockEl === null) {
        return;
    }
    var now = new Date();
    clockEl.textContent = now.toLocaleString();
}


/* ----- Task validation ----- */
function validateTaskForm(title, code, name, date, description) {
    var errors = {};

    if (title === "") {
        errors.title = "Please enter a task title.";
    }
    if (code === "") {
        errors.code = "Please enter a course code.";
    }
    if (name === "") {
        errors.name = "Please enter the course name.";
    }
    if (date === "") {
        errors.date = "Please pick a due date.";
    } else {
        var dueDate = new Date(date);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDate < today) {
            errors.date = "Due date cannot be in the past.";
        }
    }
    if (description === "") {
        errors.description = "Please enter a description.";
    }

    return errors;
}


/* ----- Clear all error messages ----- */
function clearTaskErrors() {
    document.getElementById("err-title").textContent = "";
    document.getElementById("err-code").textContent = "";
    document.getElementById("err-name").textContent = "";
    document.getElementById("err-date").textContent = "";
    document.getElementById("err-description").textContent = "";
}


/* ----- Tracking variables ----- */
var editingId = null;
var pendingDeleteId = null;


/* ----- Submit task form (add or update) ----- */
function submitTaskForm() {
    var title = document.getElementById("t-title").value;
    var code = document.getElementById("t-code").value;
    var name = document.getElementById("t-name").value;
    var date = document.getElementById("t-date").value;
    var description = document.getElementById("t-desc").value;
    var notes = document.getElementById("t-notes").value;
    var priority = document.getElementById("t-priority").value;

    clearTaskErrors();

    var errors = validateTaskForm(title, code, name, date, description);

    if (errors.title) {
        document.getElementById("err-title").textContent = errors.title;
    }
    if (errors.code) {
        document.getElementById("err-code").textContent = errors.code;
    }
    if (errors.name) {
        document.getElementById("err-name").textContent = errors.name;
    }
    if (errors.date) {
        document.getElementById("err-date").textContent = errors.date;
    }
    if (errors.description) {
        document.getElementById("err-description").textContent = errors.description;
    }

    var errorCount = 0;
    for (var key in errors) {
        errorCount = errorCount + 1;
    }
    if (errorCount > 0) {
        return;
    }

    var allTasks = getAllTasks();

    if (editingId === null) {
        var newTask = {
            id: "task_" + Date.now(),
            owner: getCurrentUser(),
            title: title,
            code: code,
            name: name,
            date: date,
            description: description,
            notes: notes,
            priority: priority,
            completed: false
        };
        allTasks.push(newTask);
    } else {
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].id === editingId) {
                allTasks[i].title = title;
                allTasks[i].code = code;
                allTasks[i].name = name;
                allTasks[i].date = date;
                allTasks[i].description = description;
                allTasks[i].notes = notes;
                allTasks[i].priority = priority;
            }
        }
        editingId = null;
        document.getElementById("form-title").textContent = "Add a Task";
        document.getElementById("submit-btn").textContent = "Add Task";
        document.getElementById("cancel-btn").classList.add("hidden");
    }

    saveAllTasks(allTasks);
    clearTaskForm();
    showTasks();
}


function clearTaskForm() {
    document.getElementById("t-title").value = "";
    document.getElementById("t-code").value = "";
    document.getElementById("t-name").value = "";
    document.getElementById("t-date").value = "";
    document.getElementById("t-desc").value = "";
    document.getElementById("t-notes").value = "";
    document.getElementById("t-priority").value = "medium";
}


function cancelEdit() {
    editingId = null;
    clearTaskForm();
    clearTaskErrors();
    document.getElementById("form-title").textContent = "Add a Task";
    document.getElementById("submit-btn").textContent = "Add Task";
    document.getElementById("cancel-btn").classList.add("hidden");
}


function editTask(taskId) {
    var allTasks = getAllTasks();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            var t = allTasks[i];
            document.getElementById("t-title").value = t.title;
            document.getElementById("t-code").value = t.code;
            document.getElementById("t-name").value = t.name;
            document.getElementById("t-date").value = t.date;
            document.getElementById("t-desc").value = t.description;
            document.getElementById("t-notes").value = t.notes;
            document.getElementById("t-priority").value = t.priority;
            editingId = taskId;
            document.getElementById("form-title").textContent = "Edit Task";
            document.getElementById("submit-btn").textContent = "Save Changes";
            document.getElementById("cancel-btn").classList.remove("hidden");
            window.scrollTo(0, 0);
            return;
        }
    }
}


function askDeleteTask(taskId) {
    pendingDeleteId = taskId;
    document.getElementById("delete-modal").classList.remove("hidden");
}

function cancelDelete() {
    pendingDeleteId = null;
    document.getElementById("delete-modal").classList.add("hidden");
}

function confirmDelete() {
    if (pendingDeleteId === null) {
        return;
    }
    var allTasks = getAllTasks();
    var newList = [];
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id !== pendingDeleteId) {
            newList.push(allTasks[i]);
        }
    }
    saveAllTasks(newList);
    pendingDeleteId = null;
    document.getElementById("delete-modal").classList.add("hidden");
    showTasks();
}


function toggleDone(taskId) {
    var allTasks = getAllTasks();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            if (allTasks[i].completed === true) {
                allTasks[i].completed = false;
            } else {
                allTasks[i].completed = true;
            }
        }
    }
    saveAllTasks(allTasks);
    showTasks();
}


function isOverdue(task) {
    if (task.completed === true) {
        return false;
    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dueDate = new Date(task.date);
    if (dueDate < today) {
        return true;
    }
    return false;
}


function formatDate(dateString) {
    var d = new Date(dateString);
    var day = d.getDate();
    var month = d.toLocaleString("default", { month: "short" });
    var year = d.getFullYear();
    return day + " " + month + " " + year;
}


function filterTasks(tasks) {
    var subject = document.getElementById("filter-subject").value;
    var status = document.getElementById("filter-status").value;
    var range = document.getElementById("filter-range").value;

    var result = [];

    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];
        var keep = true;

        if (subject !== "" && t.code !== subject) {
            keep = false;
        }

        if (status === "completed" && t.completed !== true) {
            keep = false;
        }
        if (status === "outstanding" && t.completed === true) {
            keep = false;
        }
        if (status === "overdue" && isOverdue(t) === false) {
            keep = false;
        }

        if (range !== "") {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var taskDate = new Date(t.date);
            taskDate.setHours(0, 0, 0, 0);

            if (range === "today") {
                if (taskDate.getTime() !== today.getTime()) {
                    keep = false;
                }
            }
            if (range === "week") {
                var weekLater = new Date(today);
                weekLater.setDate(today.getDate() + 7);
                if (taskDate < today || taskDate > weekLater) {
                    keep = false;
                }
            }
            if (range === "month") {
                var monthLater = new Date(today);
                monthLater.setDate(today.getDate() + 30);
                if (taskDate < today || taskDate > monthLater) {
                    keep = false;
                }
            }
            if (range === "last-week") {
                var weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                if (taskDate < weekAgo || taskDate > today) {
                    keep = false;
                }
            }
        }

        if (keep === true) {
            result.push(t);
        }
    }

    return result;
}


function fillSubjectFilter() {
    var select = document.getElementById("filter-subject");
    if (select === null) {
        return;
    }
    var tasks = getMyTasks();
    var subjects = [];

    for (var i = 0; i < tasks.length; i++) {
        var code = tasks[i].code;
        var alreadyIn = false;
        for (var j = 0; j < subjects.length; j++) {
            if (subjects[j] === code) {
                alreadyIn = true;
            }
        }
        if (alreadyIn === false) {
            subjects.push(code);
        }
    }

    var currentValue = select.value;
    select.innerHTML = '<option value="">All subjects</option>';
    for (var k = 0; k < subjects.length; k++) {
        var opt = document.createElement("option");
        opt.value = subjects[k];
        opt.textContent = subjects[k];
        select.appendChild(opt);
    }
    select.value = currentValue;
}


function showTasks() {
    var listEl = document.getElementById("task-list");
    if (listEl === null) {
        return;
    }

    fillSubjectFilter();

    var tasks = getMyTasks();
    var filtered = filterTasks(tasks);

    filtered.sort(function(a, b) {
        if (a.completed !== b.completed) {
            if (a.completed === true) {
                return 1;
            }
            return -1;
        }
        if (a.date < b.date) {
            return -1;
        }
        if (a.date > b.date) {
            return 1;
        }
        return 0;
    });

    var summaryEl = document.getElementById("task-summary");
    if (summaryEl !== null) {
        var doneCount = 0;
        var overdueCount = 0;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].completed === true) {
                doneCount = doneCount + 1;
            }
            if (isOverdue(tasks[i]) === true) {
                overdueCount = overdueCount + 1;
            }
        }
        summaryEl.textContent = tasks.length + " task(s) - " + doneCount + " completed - " + overdueCount + " overdue";
    }

    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="empty-state">No tasks to show. Add one using the form!</div>';
        return;
    }

    var html = "";
    for (var x = 0; x < filtered.length; x++) {
        var task = filtered[x];

        var classes = "task priority-" + task.priority;
        if (isOverdue(task) === true) {
            classes = classes + " overdue";
        }
        if (task.completed === true) {
            classes = classes + " completed";
        }

        var doneText = "Mark Done";
        if (task.completed === true) {
            doneText = "Undo";
        }

        var notesHtml = "";
        if (task.notes !== "" && task.notes !== undefined) {
            notesHtml = '<div class="notes-text">Notes: ' + escapeText(task.notes) + '</div>';
        }

        html = html + '<div class="' + classes + '">';
        html = html + '<h3>' + escapeText(task.title) + '</h3>';
        html = html + '<div class="course-info">' + escapeText(task.code) + ' - ' + escapeText(task.name) + '</div>';
        html = html + '<div class="due-info">Due: ' + formatDate(task.date) + ' (Priority: ' + task.priority + ')</div>';
        html = html + '<div class="desc-text">' + escapeText(task.description) + '</div>';
        html = html + notesHtml;
        html = html + '<div class="task-actions">';
        html = html + '<button class="btn btn-small btn-outline" onclick="toggleDone(\'' + task.id + '\')">' + doneText + '</button> ';
        html = html + '<button class="btn btn-small btn-outline" onclick="editTask(\'' + task.id + '\')">Edit</button> ';
        html = html + '<button class="btn btn-small btn-danger" onclick="askDeleteTask(\'' + task.id + '\')">Delete</button>';
        html = html + '</div>';
        html = html + '</div>';
    }

    listEl.innerHTML = html;
}


function escapeText(text) {
    if (text === null || text === undefined) {
        return "";
    }
    var str = String(text);
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/"/g, "&quot;");
    return str;
}


function showUserBar() {
    var bar = document.getElementById("user-bar");
    if (bar === null) {
        return;
    }
    var user = getCurrentUser();
    if (user !== null) {
        bar.innerHTML = '<span>Signed in as <strong>' + escapeText(user) + '</strong></span>' +
                        '<button class="btn btn-small btn-outline" onclick="logout()">Log Out</button>';
    }
}


/* ----- Run when each page loads ----- */
window.onload = function() {
    setupDemoAccount();

    updateClock();
    setInterval(updateClock, 1000);

    var page = document.body.getAttribute("data-page");

    if (page === "home") {
        showImage(0);
    }

    if (page === "login") {
        if (getCurrentUser() !== null) {
            window.location.href = "scheduler.html";
        }
    }

    if (page === "scheduler") {
        requireLogin();
        showUserBar();
        showTasks();
    }

    if (page === "summary") {
        requireLogin();
        showUserBar();
        showTasks();
    }
};
