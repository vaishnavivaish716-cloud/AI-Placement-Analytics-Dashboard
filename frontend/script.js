// ===============================
// AI Placement Analytics Dashboard
// script.js - Part 1
// ===============================

// ------------------------------
// Student Data
// ------------------------------
let students = [
    { id: 1, name: "Arun", dept: "CSE", cgpa: 8.9, placed: true },
    { id: 2, name: "Priya", dept: "IT", cgpa: 8.1, placed: true },
    { id: 3, name: "Rahul", dept: "ECE", cgpa: 7.4, placed: false },
    { id: 4, name: "Kavin", dept: "AIDS", cgpa: 9.2, placed: true },
    { id: 5, name: "Divya", dept: "EEE", cgpa: 6.9, placed: false }
];

// ------------------------------
// Dashboard Load
// ------------------------------
function loadDashboard() {

    const total = students.length;
    const placed = students.filter(s => s.placed).length;
    const notPlaced = total - placed;
    const placementRate = Math.round((placed / total) * 100);
    const eligible = students.filter(s => s.cgpa >= 7.5).length;

    document.getElementById("totalStudents").innerHTML = total;
    document.getElementById("placedStudents").innerHTML = placed;
    document.getElementById("notPlaced").innerHTML = notPlaced;
    document.getElementById("placementRate").innerHTML = placementRate + "%";
    document.getElementById("eligibleStudents").innerHTML = eligible;

    updateDateTime();
    showWelcomeMessage();
    
}

// ------------------------------
// Login
// ------------------------------
function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        alert("Login Successful");
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerHTML = "Invalid Login";
    }
}

// ------------------------------
// Logout
// ------------------------------
function logout() {
    alert("Logged Out Successfully");
    window.location.href = "login.html";
}

// ------------------------------
// Search Student
// ------------------------------
function searchStudent() {

    const input = document.getElementById("search").value.toLowerCase();

    const rows = document.querySelectorAll("#studentTable tbody tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}

// ------------------------------
// Dark Mode
// ------------------------------
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// ------------------------------
// Live Date & Time
// ------------------------------
function updateDateTime() {

    const now = new Date();

    document.getElementById("dateTime").innerHTML =
        now.toLocaleDateString() + " | " + now.toLocaleTimeString();

}

setInterval(updateDateTime, 1000);// ------------------------------
// Welcome Message
// ------------------------------
function showWelcomeMessage() {

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {
        message = "🌅 Good Morning, Admin!";
    } else if (hour < 17) {
        message = "☀️ Good Afternoon, Admin!";
    } else {
        message = "🌙 Good Evening, Admin!";
    }

    document.getElementById("welcomeMessage").innerHTML = message;
}


// ------------------------------
// Welcome Message
// ===============================
// script.js - Part 2
// AI Features & Charts
// ===============================

// ------------------------------
// AI Placement Prediction
// ------------------------------
function predictPlacement() {

    const cgpa = parseFloat(document.getElementById("cgpa").value);
    const aptitude = parseInt(document.getElementById("aptitude").value);
    const communication = parseInt(document.getElementById("communication").value);

    if (isNaN(cgpa) || isNaN(aptitude) || isNaN(communication)) {
        document.getElementById("prediction").innerHTML =
            "Please enter all values";
        return;
    }

    let score = (cgpa * 10 * 0.4) + (aptitude * 0.35) + (communication * 0.25);

    let result = "";

    if (score >= 85) {
        result = "🟢 High Chance of Placement";
    } else if (score >= 70) {
        result = "🟡 Medium Chance of Placement";
    } else if (score >= 50) {
        result = "🟠 Needs Improvement";
    } else {
        result = "🔴 Low Chance of Placement";
    }

    document.getElementById("prediction").innerHTML = result;
}

// ------------------------------
// Resume Ranking
// ------------------------------
function rankResume() {

    const name = document.getElementById("resumeName").value;
    const cgpa = parseFloat(document.getElementById("resumeCGPA").value);
    const skill = parseInt(document.getElementById("resumeSkill").value);

    if (isNaN(cgpa) || isNaN(skill)) {
        document.getElementById("resumeResult").innerHTML =
            "Please enter all values";
        return;
    }

    let score = Math.round((cgpa * 10 * 0.5) + (skill * 0.5));
    document.getElementById("resumeProgress").style.width = score + "%";
document.getElementById("resumeProgress").innerHTML = score + "%";



    let rank = "";

    if (score >= 85) {
        rank = "🥇 Top Candidate";
    } else if (score >= 70) {
        rank = "🥈 Eligible";
    } else {
        rank = "🥉 Needs Skill Improvement";
    }

    document.getElementById("resumeResult").innerHTML =
        `${name}<br>Resume Score: ${score}%<br>${rank}`;
}
function calculateMatch() {

    const cgpa = parseFloat(document.getElementById("matchCGPA").value);
    const skill = parseInt(document.getElementById("matchSkill").value);

    if (isNaN(cgpa) || isNaN(skill)) {
        document.getElementById("matchResult").innerHTML =
            "Please enter all values";
        return;
    }

    let match = Math.round((cgpa * 10 * 0.5) + (skill * 0.5));

    let result = "";

    if (match >= 85) {
        result = "🟢 Highly Recommended";
    } else if (match >= 70) {
        result = "🟡 Recommended";
    } else {
        result = "🔴 Needs Improvement";
    }

    document.getElementById("matchResult").innerHTML =
        `Resume Match: ${match}%<br>${result}`;
}

// ------------------------------
// Student Performance
// ------------------------------
function analyzePerformance() {

    const attendance = parseInt(document.getElementById("attendance").value);
    const skill = parseInt(document.getElementById("skillScore").value);

    let result = "";

    if (attendance >= 85 && skill >= 80) {
        result = "🌟 Excellent Performance";
    } else if (attendance >= 70 && skill >= 60) {
        result = "👍 Good Performance";
    } else {
        result = "⚠️ Needs Improvement";
    }

    document.getElementById("performanceResult").innerHTML = result;
}

// ------------------------------
// Career Suggestion
// ------------------------------
function careerSuggestion() {

    const career = document.getElementById("careerOption").value;

    const suggestions = {
        software: "Recommended: Java Full Stack / Web Development",
        data: "Recommended: Data Science & Machine Learning",
        cloud: "Recommended: AWS / Azure Cloud Engineer",
        cyber: "Recommended: Cyber Security Analyst",
        ai: "Recommended: Artificial Intelligence Engineer"
    };

    document.getElementById("careerResult").innerHTML =
        suggestions[career];
}


// ===============================
// script.js - Part 3 (Final)
// ===============================

// ------------------------------
// Company Management
// ------------------------------
function addCompany() {

    const company = document.getElementById("companyName").value;
    const packageValue = document.getElementById("package").value;

    if (company === "" || packageValue === "") {
        alert("Please enter company details");
        return;
    }

    const table = document.getElementById("companyBody");

    const row = table.insertRow();

    row.insertCell(0).innerHTML = company;
    row.insertCell(1).innerHTML = packageValue + " LPA";
    row.insertCell(2).innerHTML =
        "<button onclick='deleteCompany(this)'>Delete</button>";

    document.getElementById("companyName").value = "";
    document.getElementById("package").value = "";
}

function deleteCompany(button) {
    button.parentElement.parentElement.remove();
}

// ------------------------------
// PDF Download
// ------------------------------
function downloadPDF() {
    alert("PDF Report Download Started");
}

// ------------------------------
// Excel Download
// ------------------------------
function downloadExcel() {
    alert("Excel Report Download Started");
}

// ------------------------------
// CSV Upload
// ------------------------------
function uploadCSV() {

    const file = document.getElementById("csvFile").files[0];

    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    alert(file.name + " uploaded successfully.");
}

// ------------------------------
// Progress Bar
// ------------------------------
function animateProgress(id, value) {

    const bar = document.getElementById(id);

    if (bar) {
        bar.style.width = value + "%";
        bar.innerHTML = value + "%";
    }
}

// ------------------------------
// Local Storage
// ------------------------------
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function loadStudents() {

    const data = localStorage.getItem("students");

    if (data) {
        students = JSON.parse(data);
    }
}
// ------------------------------
// Add Student
// ------------------------------
function addStudent() {

    const name = document.getElementById("studentName").value;
    const dept = document.getElementById("department").value;
    const cgpa = document.getElementById("cgpaValue").value;

    if (name === "" || cgpa === "") {
        alert("Please fill all fields");
        return;
    }

    const table = document.getElementById("studentBody");

    const row = table.insertRow();

    row.insertCell(0).innerHTML = table.rows.length;
    row.insertCell(1).innerHTML = name;
    row.insertCell(2).innerHTML = dept;
    row.insertCell(3).innerHTML = cgpa;

    if (cgpa >= 7.5) {
        row.insertCell(4).innerHTML = "Placed";
    } else {
        row.insertCell(4).innerHTML = "Not Placed";
    }

    document.getElementById("studentName").value = "";
    document.getElementById("cgpaValue").value = "";

    loadDashboard();
}
function loadStudentsTable() {

    let tbody = document.getElementById("studentsTableBody");
    tbody.innerHTML = "";

    students.forEach(student => {

        tbody.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.dept}</td>
            <td>${student.cgpa}</td>
            <td>${student.placed ? "Placed" : "Not Placed"}</td>
        </tr>
        `;

    });

}
function showTopCandidates() {

    let rankedStudents = students.map(student => {

        let score = Math.round(student.cgpa * 10);

        return {
            name: student.name,
            score: score
        };

    });

    rankedStudents.sort((a, b) => b.score - a.score);

    let tbody = document.getElementById("topCandidatesBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    rankedStudents.slice(0, 5).forEach((student, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.score}%</td>
            </tr>
        `;

    });

}


// ------------------------------
// Window Load
// ------------------------------
window.onload = function () {

    loadStudents();

    loadDashboard();
    loadStudentsTable();

    animateProgress("placementBar", 84);
    showTopCandidates();

};
function showTopStudents() {

    let sortedStudents = [...students].sort((a, b) => b.cgpa - a.cgpa);

    let tbody = document.getElementById("topStudentsBody");
    tbody.innerHTML = "";

    sortedStudents.slice(0, 5).forEach((student, index) => {

        tbody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.dept}</td>
            <td>${student.cgpa}</td>
            <td>${Math.round(student.cgpa*10)}</td>
        </tr>
        `;

    });

}function checkEligibility() {

    const minCGPA = parseFloat(document.getElementById("companyCGPA").value);

    if (isNaN(minCGPA)) {
        document.getElementById("eligibilityResult").innerHTML =
            "Please enter a CGPA";
        return;
    }

    const eligible = students.filter(student => student.cgpa >= minCGPA);

    document.getElementById("eligibilityResult").innerHTML =
        `Eligible Students: ${eligible.length}`;
}
function filterDepartment() {

    const dept = document.getElementById("deptFilter").value;
    const rows = document.querySelectorAll("#studentBody tr");

    rows.forEach(row => {

        const studentDept = row.cells[2].innerText;

        if (dept === "All" || studentDept === dept) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}
function checkInterviewReadiness() {

    const cgpa = parseFloat(document.getElementById("interviewCGPA").value);
    const skill = parseInt(document.getElementById("interviewSkill").value);
    const communication = parseInt(document.getElementById("interviewCommunication").value);

    if (isNaN(cgpa) || isNaN(skill) || isNaN(communication)) {
        document.getElementById("interviewResult").innerHTML =
        "Please enter all values";
        return;
    }

    let score = Math.round((cgpa * 10 * 0.4) + (skill * 0.35) + (communication * 0.25));

    let result = "";

    if (score >= 85) {
        result = "🟢 Interview Ready";
    } else if (score >= 70) {
        result = "🟡 Almost Ready";
    } else {
        result = "🔴 Needs More Practice";
    }

    document.getElementById("interviewResult").innerHTML =
    `Interview Readiness Score: ${score}%<br>${result}`;
}
function analyzeSkillGap() {

    const skill = parseInt(document.getElementById("gapSkill").value);
    const communication = parseInt(document.getElementById("gapCommunication").value);

    if (isNaN(skill) || isNaN(communication)) {
        document.getElementById("gapResult").innerHTML =
            "Please enter all values";
        return;
    }

    let suggestions = [];

    if (skill < 70) {
        suggestions.push("✔ Improve Technical Skills");
    }

    if (communication < 70) {
        suggestions.push("✔ Improve Communication Skills");
    }

    if (suggestions.length === 0) {
        document.getElementById("gapResult").innerHTML =
            "🎉 Excellent! No major skill gaps found.";
    } else {
        document.getElementById("gapResult").innerHTML =
            suggestions.join("<br>");
    }
}
function recommendCompany() {

    const cgpa = parseFloat(document.getElementById("companyRecCGPA").value);
    const skill = parseInt(document.getElementById("companyRecSkill").value);

    if (isNaN(cgpa) || isNaN(skill)) {
        document.getElementById("companyRecommendation").innerHTML =
            "Please enter all values";
        return;
    }

    let company = "";

    if (cgpa >= 8.5 && skill >= 85) {
        company = "Microsoft / Google / Amazon";
    } else if (cgpa >= 8.0 && skill >= 75) {
        company = "TCS Digital / Accenture / Cognizant";
    } else if (cgpa >= 7.0 && skill >= 65) {
        company = "Infosys / Wipro / Capgemini";
    } else {
        company = "Focus on improving your skills before placements.";
    }

    document.getElementById("companyRecommendation").innerHTML =
        "Recommended Companies: " + company;
}
function filterEligibleStudents() {

    const company = document.getElementById("companyFilter").value;

    let eligible = [];

    if (company === "TCS") {
        eligible = students.filter(s => s.cgpa >= 7.0);
    }
    else if (company === "Infosys") {
        eligible = students.filter(s => s.cgpa >= 7.5);
    }
    else if (company === "Accenture") {
        eligible = students.filter(s => s.cgpa >= 8.0);
    }
    else if (company === "Wipro") {
        eligible = students.filter(s => s.cgpa >= 6.5);
    }

    document.getElementById("eligibleList").innerHTML =
        eligible.map(s => s.name).join("<br>");
}
function generateAIInsights() {

    const total = students.length;
    const placed = students.filter(s => s.placed).length;
    const avgCGPA = (
        students.reduce((sum, s) => sum + s.cgpa, 0) / total
    ).toFixed(2);

    let insight = "";

    insight += "📊 Total Students: " + total + "<br>";
    insight += "✅ Placed Students: " + placed + "<br>";
    insight += "🎓 Average CGPA: " + avgCGPA + "<br>";

    if (placed / total >= 0.8) {
        insight += "🚀 Placement performance is Excellent.";
    } else if (placed / total >= 0.6) {
        insight += "👍 Placement performance is Good.";
    } else {
        insight += "⚠️ Placement performance needs improvement.";
    }

    document.getElementById("aiInsights").innerHTML = insight;
}function showStudentProfile() {

    const selected = document.getElementById("studentProfile").value;

    const student = students.find(s => s.name === selected);

    if (!student) {
        document.getElementById("studentProfileCard").innerHTML = "";
        return;
    }

    document.getElementById("studentProfileCard").innerHTML = `
        <h3>${student.name}</h3>
        <p><b>Department:</b> ${student.dept}</p>
        <p><b>CGPA:</b> ${student.cgpa}</p>
        <p><b>Status:</b> ${student.placed ? "Placed" : "Not Placed"}</p>
    `;
}
