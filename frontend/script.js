// =======================================
// AI Placement Analytics Dashboard
// Clean script.js - Part 1
// =======================================


// Student Data
window.students = [
    {
        id: 1,
        name: "Arun",
        department: "CSE",
        cgpa: 8.9,
        skills: "Java, Python",
        status: "Placed"
    },
    {
        id: 2,
        name: "Priya",
        department: "IT",
        cgpa: 8.1,
        skills: "HTML, CSS",
        status: "Placed"
    },
    {
        id: 3,
        name: "Rahul",
        department: "ECE",
        cgpa: 7.4,
        skills: "JavaScript",
        status: "Not Placed"
    },
    {
        id: 4,
        name: "Kavin",
        department: "AIDS",
        cgpa: 9.2,
        skills: "Python, AI",
        status: "Placed"
    },
    {
        id: 5,
        name: "Divya",
        department: "EEE",
        cgpa: 6.9,
        skills: "C Programming",
        status: "Not Placed"
    }
];
let editingStudentId = null;


// ================================
// Dashboard Cards
// ================================

function loadDashboard(){

    fetch("http://127.0.0.1:5000/api/students")

    .then(response => response.json())

    .then(data => {

        // Backend student data
        console.log("STUDENT DATA:", data);
        students = data;

        let total = students.length;

        let placed = students.filter(
            student => student.status === "Placed"
        ).length;

        let notPlaced = total - placed;

        let rate = total > 0
            ? Math.round((placed / total) * 100)
            : 0;


        document.getElementById("totalStudents").innerHTML = total;

        document.getElementById("placedStudents").innerHTML = placed;

        document.getElementById("notPlaced").innerHTML = notPlaced;

        document.getElementById("placementRate").innerHTML = rate + "%";


        // Student table
        loadStudentTable();
        generateAIInsights();
        showTopStudents();
        showDepartmentStats();
        showPlacementDrives();
        showMyProfile();
        showStudentPerformance();
        
    })

    .catch(error => {

        console.log("Student Data Error:", error);

    });

}



// ================================
// Student Table
// ================================

function loadStudentTable(){

    const tbody = document.getElementById("studentTableBody");

    if(!tbody){
        console.log("❌ studentTableBody NOT FOUND");
        return;
    }

    console.log("✅ studentTableBody FOUND");
    console.log("Students:", students);

    tbody.innerHTML = "";

    if(students.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No student data available
                </td>
            </tr>
        `;

        return;
    }

    students.forEach(student => {

        const row = document.createElement("tr");

        let skills = Array.isArray(student.skills)
            ? student.skills.join(", ")
            : (student.skills || "-");

        row.innerHTML = `

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.cgpa}</td>

            <td>${skills}</td>

            <td>${student.status}</td>

            <td class="action-buttons">

<button class="view-btn"
onclick="showStudentProfile(${student.id})">
    View
</button>

<button class="edit-btn"
onclick="editStudent(${student.id})">
    Edit
</button>

<button class="delete-btn"
onclick="deleteStudent(${student.id})">
    Delete
</button>

</td>

        `;

        tbody.appendChild(row);

    });

}

function filterStudents() {

    let search =
        document.getElementById("studentSearch").value.toLowerCase();

    let department =
        document.getElementById("departmentFilter").value;

    let status =
        document.getElementById("statusFilter").value;

    let filteredStudents = students.filter(student => {

        let nameMatch =
            student.name.toLowerCase().includes(search);

        let departmentMatch =
            department === "All" ||
            student.department === department;

        let statusMatch =
            status === "All" ||
            student.status === status;

        return nameMatch && departmentMatch && statusMatch;

    });

    let tbody =
        document.getElementById("studentTableBody");

    tbody.innerHTML = "";

    filteredStudents.forEach(student => {

        tbody.innerHTML += `

        <tr>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.cgpa}</td>

            <td>${student.skills || "-"}</td>
                

            <td>${student.status}</td>

            <td>
                <button onclick="showStudentProfile(${student.id})">
                    👁 View
                </button>
            </td>

            <td>
                <button onclick="editStudent(${student.id})">
                    ✏ Edit
                </button>
            </td>

            <td>
                <button onclick="deleteStudent(${student.id})">
                    🗑 Delete
                </button>
            </td>

        </tr>

        `;

    });

}



// ================================
// Search Student
// ================================

function searchStudent(){

    let searchValue =
    document.getElementById("search").value
    .toLowerCase();


    let rows =
    document.querySelectorAll(
        "#studentTableBody tr"
    );


    rows.forEach(row => {


        let text =
        row.innerText.toLowerCase();


        if(text.includes(searchValue)){

            row.style.display="";

        }
        else{

            row.style.display="none";

        }


    });

}



// ================================
// Department Filter
// ================================

function filterDepartment(){

    let dept =
    document.getElementById(
        "departmentFilter"
    ).value;


    let rows =
    document.querySelectorAll(
        "#studentTableBody tr"
    );


    rows.forEach(row=>{


        let studentDept =
        row.children[1].innerText;


        if(
            dept==="All" ||
            studentDept===dept
        ){

            row.style.display="";

        }
        else{

            row.style.display="none";

        }


    });

}



// ================================
// Dark Mode
// ================================

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );

}



// ================================
// Logout
// ================================

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
// =======================================
// Company Management
// =======================================


function getCompanies(){

    fetch("http://127.0.0.1:5000/companies")

    .then(response => response.json())

    .then(data => {

        console.log("COMPANY DATA:", data);

        const table =
            document.getElementById("companyTableBody");

        if(!table){
            console.log("❌ companyTableBody NOT FOUND");
            return;
        }

        table.innerHTML = "";

        data.forEach(company => {

            table.innerHTML += `

                <tr>

                    <td>${company.company}</td>

                    <td>${company.role || "-"}</td>

                    <td>${company.package || "-"}</td>

                    <td>${company.campusType || "-"}</td>

                    <td>
                        <button onclick="editCompany('${company.company}')">
                            Edit
                        </button>

                        <button onclick="deleteCompany('${company.company}')">
                            Delete
                        </button>
                    </td>

                </tr>

            `;

        });

    })

    .catch(error => {

        console.error("❌ Company Error:", error);

    });

}
function deleteCompany(companyName) {

    if (!confirm("Are you sure you want to delete this company?")) {
        return;
    }

    fetch(
        "http://127.0.0.1:5000/companies/" +
        encodeURIComponent(companyName),
        {
            method: "DELETE"
        }
    )
    .then(response => {

        console.log("DELETE STATUS:", response.status);

        return response.json();

    })
    .then(data => {

        console.log("DELETE RESPONSE:", data);

        alert(data.message || "Company deleted successfully");

        getCompanies();

    })
    .catch(error => {

        console.error("DELETE ERROR:", error);

        alert("Delete failed");

    });

}





// =======================================
// Add Company
// =======================================


function addCompany() {

    const company =
        document.getElementById("companyName").value.trim();

    const role =
        document.getElementById("companyRole").value.trim();

    const packageValue =
        document.getElementById("package").value.trim();

    const campusType =
        document.getElementById("campusType").value;


    if (
        company === "" ||
        role === "" ||
        packageValue === ""
    ) {

        alert("Please fill all company details");
        return;

    }


    const companyData = {

        company: company,

        role: role,

        package: packageValue,

        studentsPlaced: 0,

        campusType: campusType

    };


    fetch("http://127.0.0.1:5000/companies", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(companyData)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to add company");
        }

        return response.json();

    })

    .then(data => {

        alert("Company Added Successfully");

        document.getElementById("companyName").value = "";
        document.getElementById("companyRole").value = "";
        document.getElementById("package").value = "";

        getCompanies();

    })

    .catch(error => {

        console.error("Add Company Error:", error);

        alert("Company add failed. Check Flask backend.");

    });

}



// =======================================
// Dashboard API Data
// =======================================


function loadDashboardData(){


    fetch(
        "http://127.0.0.1:5000/api/dashboard"
    )


    .then(response=>response.json())


    .then(data=>{


        document.getElementById(
            "totalStudents"
        ).innerHTML =
        data.total_students;



        document.getElementById(
            "placedStudents"
        ).innerHTML =
        data.placed_students;



        document.getElementById(
            "notPlaced"
        ).innerHTML =
        data.total_students -
        data.placed_students;



        document.getElementById(
            "placementRate"
        ).innerHTML =
        data.placement_rate;



    })

    .catch(error=>{

        console.log(
            "Dashboard Error:",
            error
        );

    });


}





// =======================================
// AI Placement Prediction
// =======================================
function predictPlacement(){

    let cgpa =
    Number(document.getElementById("cgpa").value);

    let aptitude =
    Number(document.getElementById("aptitude").value);


    if(!cgpa || !aptitude){

        document.getElementById("predictionResult")
        .innerHTML =
        "Enter CGPA and Aptitude Marks";

        return;

    }


    fetch("http://127.0.0.1:5000/predict", {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

            cgpa: cgpa,

            aptitude: aptitude

        })

    })


    .then(response => response.json())


    .then(data => {


        document.getElementById(
            "predictionResult"
        ).innerHTML =

        "🤖 " +
        data.result;


        document.getElementById(
            "predictionBar"
        ).style.width =

        data.probability + "%";


        document.getElementById(
            "predictionBar"
        ).innerHTML =

        data.probability + "%";
        // Add prediction to history table

let historyBody =
    document.getElementById("predictionHistoryBody");

let newRow =
    historyBody.insertRow();

newRow.insertCell(0).innerHTML =
    cgpa;

newRow.insertCell(1).innerHTML =
    aptitude;

newRow.insertCell(2).innerHTML =
    data.probability + "%";

newRow.insertCell(3).innerHTML =
    data.result;


    })


    .catch(error => {

        console.log(
            "Prediction Error:",
            error
        );

    });

}



    
// =======================================
// Page Load Function
// =======================================


window.onload = function(){
    checkLogin();
    checkUserRole();


    // Load dashboard cards

    loadDashboard();
    showWelcomeMessage();
    



    // Load backend dashboard data





    // Load companies table

    getCompanies();
    loadCompanyChart();
    loadDepartmentChart();
    loadPlacementChart();
    showPlacementDrives();

    // Load My Applications
    showMyApplications();
    updateApplicationSummary();
    
    showStudentNotifications();



};




// =======================================
// Date & Time (Optional)
// =======================================


function updateDateTime(){


    let dateElement =
    document.getElementById(
        "dateTime"
    );


    if(dateElement){


        let now = new Date();


        dateElement.innerHTML =
        now.toLocaleDateString()
        +
        " | "
        +
        now.toLocaleTimeString();


    }


}


setInterval(
    updateDateTime,
    1000
);



// =======================================
// Welcome Message (Optional)
// =======================================


function showWelcomeMessage(){


    let welcome =
    document.getElementById(
        "welcomeMessage"
    );


    if(welcome){


        let hour =
        new Date().getHours();



        if(hour < 12){

            welcome.innerHTML =
            "🌅 Good Morning Admin";

        }

        else if(hour < 17){

            welcome.innerHTML =
            "☀️ Good Afternoon Admin";

        }

        else{

            welcome.innerHTML =
            "🌙 Good Evening Admin";

        }


    }


}
function addStudent(){

    let studentData = {

        name: document.getElementById("studentName").value,

        department: document.getElementById("department").value,

        cgpa: Number(
            document.getElementById("cgpaValue").value
        ),

        skills: document.getElementById("studentSkills").value,

        status: document.getElementById("studentStatus").value

    };


    if(
        studentData.name === "" ||
        studentData.department === "" ||
        !studentData.cgpa ||
        studentData.skills === ""
    ){

        alert("Please fill all student details");

        return;

    }


    fetch("http://127.0.0.1:5000/api/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(studentData)

    })

    .then(response => {

        if(!response.ok){
            throw new Error("Failed to add student");
        }

        return response.json();

    })

    .then(data => {

        alert("Student Added Successfully");

        document.getElementById("studentName").value = "";
        document.getElementById("department").value = "";
        document.getElementById("cgpaValue").value = "";
        document.getElementById("studentSkills").value = "";
        document.getElementById("studentStatus").value = "Not Placed";

        loadDashboard();

    })

    .catch(error => {

        console.error("Add Student Error:", error);

        alert("Student add failed. Check if Flask backend is running.");

    });

}
function downloadPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI Placement Analytics Dashboard Report", 20, 20);

    doc.setFontSize(12);
    doc.text("Total Students : " + document.getElementById("totalStudents").innerText, 20, 40);
    doc.text("Placed Students : " + document.getElementById("placedStudents").innerText, 20, 50);
    doc.text("Not Placed : " + document.getElementById("notPlaced").innerText, 20, 60);
    doc.text("Placement Rate : " + document.getElementById("placementRate").innerText, 20, 70);

    doc.save("Placement_Report.pdf");
}


function downloadExcel() {

    let data = [];

    students.forEach(student => {
        data.push({
            Name: student.name,
            Department: student.department,
            CGPA: student.cgpa,
            Skills: student.skills,
            Status: student.status
        });
    });

    let worksheet = XLSX.utils.json_to_sheet(data);

    let workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Placement_Report.xlsx");
}
function uploadResume() {

    document.getElementById("resumeStatus").innerHTML =
        "✅ Resume uploaded successfully";

    let score = Math.floor(Math.random() * 40) + 60;

    document.getElementById("resumeScore").innerHTML =
        "Resume Score: " + score + "%";

    document.getElementById("resumeScoreBar").style.width =
        score + "%";

    document.getElementById("resumeScoreBar").innerHTML =
        score + "%";

    if (score >= 80) {

        document.getElementById("resumeSuggestion").innerHTML =
            "Excellent resume.";

    } else {

        document.getElementById("resumeSuggestion").innerHTML =
            "Add more skills and projects.";

    }
}
// ===============================
// Dashboard Security
// ===============================

function checkLogin(){

    let loginStatus = localStorage.getItem("login");


    if(loginStatus !== "true"){

        window.location.href = "login.html";

    }

 } 
   function deleteStudent(id){

    let confirmDelete =
    confirm("Are you sure you want to delete this student?");

    if(!confirmDelete){
        return;
    }

    fetch(
        "http://127.0.0.1:5000/api/students/" + id,
        {
            method: "DELETE"
        }

    )

    .then(response => response.json())

    .then(data => {

        alert("Student Deleted Successfully");
        addActivity("🗑️ Student deleted successfully");

        loadStudentTable();

    })

    .catch(error => {

        console.log(
            "Delete Student Error:",
            error
        );

    });

}
function editStudent(id){

    let student =
    students.find(s => s.id == id);


    if(!student){

        alert("Student Not Found");

        return;

    }


    document.getElementById("studentName").value =
    student.name;


    document.getElementById("studentDepartment").value =
    student.department;


    document.getElementById("studentCGPA").value =
    student.cgpa;


    document.getElementById("studentSkills").value =
    student.skills;


    document.getElementById("studentStatus").value =
    student.status;


    editingStudentId = id;


    document.getElementById("studentBtn").innerHTML =
    "Update Student";


    document.getElementById("studentBtn").onclick =
    updateStudent;


    document.getElementById("studentName").scrollIntoView({
        behavior: "smooth"
    });


    document.getElementById("studentName").focus();

}

function updateStudent(){

    let student =
    students.find(
        s => s.id == editingStudentId
    );


    if(!student){

        alert("Student Not Found");

        return;

    }


    let updatedStudent = {

        name:
        document.getElementById("studentName").value,

        department:
        document.getElementById("studentDepartment").value,

        cgpa:
        Number(
            document.getElementById("studentCGPA").value
        ),

        skills:
        document.getElementById("studentSkills").value,

        status:
        document.getElementById("studentStatus").value

    };


    fetch(
        "http://127.0.0.1:5000/api/students/"
        + editingStudentId,

        {

            method: "PUT",

            headers: {

                "Content-Type":
                "application/json"

            },

            body:
            JSON.stringify(updatedStudent)

        }

    )


    .then(response => response.json())


    .then(data => {

        alert("Student Updated Successfully");
addActivity("✏️ " + student.name + " student updated");

        editingStudentId = null;


        document.getElementById(
            "studentBtn"
        ).innerHTML = "Add Student";


        document.getElementById(
            "studentBtn"
        ).onclick = addStudent;


        document.getElementById(
            "studentName"
        ).value = "";


        document.getElementById(
            "studentDepartment"
        ).value = "";


        document.getElementById(
            "studentCGPA"
        ).value = "";


        document.getElementById(
            "studentSkills"
        ).value = "";


        document.getElementById(
            "studentStatus"
        ).value = "Placed";


        loadDashboard();

    })


    .catch(error => {

        console.log(
            "Update Student Error:",
            error
        );

    });

}


function checkUserRole(){

    let role = localStorage.getItem("role");

    let studentSection =
        document.getElementById("studentSection");

    let companySection =
        document.getElementById("companySection");

    // ADMIN ROLE
    if(role === "admin" || role === null){

        if(studentSection){
            studentSection.style.display = "block";
        }

        if(companySection){
            companySection.style.display = "block";
        }

    }

    // STUDENT ROLE
    else if(role === "student"){

        if(studentSection){
            studentSection.style.display = "none";
        }

        if(companySection){
            companySection.style.display = "none";
        }

    }

}
function checkEligibility(){

    let cgpa = Number(
        document.getElementById("eligibilityCGPA").value
    );

    let result =
    document.getElementById("eligibilityResult");

    if(cgpa >= 7.5){

        result.innerHTML =
        "✅ Eligible for Campus Placement";

        result.style.color = "green";

    }

    else{

        result.innerHTML =
        "❌ Not Eligible. Improve your CGPA.";

        result.style.color = "red";

    }

}



    


function recommendCompany() {

    let skills =
        document.getElementById("skillInput")
        .value
        .toLowerCase();

    let result =
        document.getElementById(
            "companyRecommendation"
        );

    if (
        skills.includes("python") ||
        skills.includes("ai")
    ) {

        result.innerHTML =
        "🏢 Google<br>🏢 Microsoft<br>🏢 Amazon";

    }

    else if (
        skills.includes("java")
    ) {

        result.innerHTML =
        "🏢 TCS<br>🏢 Infosys<br>🏢 Wipro";

    }

    else if (
        skills.includes("html") ||
        skills.includes("css") ||
        skills.includes("javascript")
    ) {

        result.innerHTML =
        "🏢 Zoho<br>🏢 Freshworks<br>🏢 Cognizant";

    }

    else {

        result.innerHTML =
        "📚 Please add more skills.";

    }

}


function generateAIInsights(){

    let insights =
    document.getElementById("aiInsights");

    if(!insights) return;

    if(students.length === 0){

        insights.innerHTML =
        "<p>📊 No student data available.</p>";

        return;

    }

    let total = students.length;

    let placed =
    students.filter(
        student => student.status === "Placed"
    ).length;

    let rate =
    Math.round((placed / total) * 100);

    let departments = {};

    students.forEach(student => {

        if(!departments[student.department]){

            departments[student.department] = {
                total: 0,
                placed: 0
            };

        }

        departments[student.department].total++;

        if(student.status === "Placed"){

            departments[student.department].placed++;

        }

    });

    let bestDepartment = "";

    let bestRate = 0;

    for(let dept in departments){

        let deptRate =
        (departments[dept].placed /
        departments[dept].total) * 100;

        if(deptRate > bestRate){

            bestRate = deptRate;

            bestDepartment = dept;

        }

    }

    insights.innerHTML = `

        <p>👥 Total Students: <b>${total}</b></p>

        <p>✅ Placed Students: <b>${placed}</b></p>

        <p>📈 Overall Placement Rate: <b>${rate}%</b></p>

        <p>🏆 Best Performing Department: <b>${bestDepartment}</b></p>

    `;

}


function showTopStudents(){

    let container =
    document.getElementById("topStudents");

    if(!container) return;

    if(students.length === 0){

        container.innerHTML =
        "<p>📊 No student data available.</p>";

        return;

    }

    let topStudents =
    [...students]
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 3);

    let html = "";

    topStudents.forEach((student, index) => {

        html += `

        <div class="top-student-card">

            <h3>🏅 Rank ${index + 1}</h3>

            <p>👤 Name: <b>${student.name}</b></p>

            <p>🏢 Department: <b>${student.department}</b></p>

            <p>📚 CGPA: <b>${student.cgpa}</b></p>

            <p>✅ Status: <b>${student.status}</b></p>

        </div>

        `;

    });

    container.innerHTML = html;

}
function showDepartmentStats(){

    let tableBody =
    document.getElementById("departmentStatsBody");

    if(!tableBody) return;

    let departments = {};

    students.forEach(student => {

        let dept = student.department;

        if(!departments[dept]){

            departments[dept] = {
                total: 0,
                placed: 0
            };

        }

        departments[dept].total++;

        if(student.status === "Placed"){

            departments[dept].placed++;

        }

    });

    let html = "";

    for(let dept in departments){

        let total =
        departments[dept].total;

        let placed =
        departments[dept].placed;

        let notPlaced =
        total - placed;

        let rate =
        Math.round((placed / total) * 100);

        html += `

        <tr>

            <td>${dept}</td>

            <td>${total}</td>

            <td>${placed}</td>

            <td>${notPlaced}</td>

            <td>${rate}%</td>

        </tr>

        `;

    }

    tableBody.innerHTML = html;

}

function showStudentProfile(id){

    let student =
    students.find(s => s.id == id);

    if(!student){

        alert("Student Not Found");

        return;

    }

    let eligibility =
    student.cgpa >= 7.5
    ? "✅ Eligible for Placement"
    : "❌ Improve CGPA";

    alert(

        "👤 Student Profile\n\n" +

        "Name: " + student.name + "\n" +

        "Department: " + student.department + "\n" +

        "CGPA: " + student.cgpa + "\n" +

        "Skills: " + student.skills + "\n" +

        "Status: " + student.status + "\n\n" +

        eligibility

    );

}
function importStudentsCSV(){

    let file =
    document.getElementById("csvFile").files[0];

    let status =
    document.getElementById("csvStatus");

    if(!file){

        status.innerHTML =
        "❌ Please select a CSV file.";

        return;

    }

    let reader = new FileReader();

    reader.onload = function(event){

        let lines =
        event.target.result.trim().split("\n");

        let importedStudents = [];

        for(let i = 1; i < lines.length; i++){

            let values =
            lines[i].split(",");

            let student = {

                name: values[0].trim(),

                department: values[1].trim(),

                cgpa: Number(values[2].trim()),

                skills: values[3].trim(),

                status: values[4].trim()

            };

            importedStudents.push(student);

        }

        let uploadPromises =
        importedStudents.map(student => {

            return fetch(
                "http://127.0.0.1:5000/api/students",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(student)
                }
            );

        });

        Promise.all(uploadPromises)

        .then(() => {

            status.innerHTML =
            "✅ " +
            importedStudents.length +
            " Students Saved Successfully";

            loadDashboard();

        })

        .catch(error => {

            console.log(
                "CSV Upload Error:",
                error
            );

        });

    };

    reader.readAsText(file);

}
function showMyProfile(){

    let role = localStorage.getItem("role");

    let profileSection =
        document.getElementById("studentProfileSection");

    let profile =
        document.getElementById("myProfile");

    if(!profileSection || !profile) return;

    if(role !== "student"){

        profileSection.style.display = "none";

        return;

    }

    profileSection.style.display = "block";

    // Demo student profile
    let username =
    localStorage.getItem("studentUsername");

let student =
    students.find(s =>
        s.name.toLowerCase() === username.toLowerCase()
    );

    if(!student){

        profile.innerHTML =
        "<p>Student data not available.</p>";

        return;

    }

    profile.innerHTML = `

        <div class="profile-card">

            <h3>👤 ${student.name}</h3>

            <p>🏢 Department: <b>${student.department}</b></p>

            <p>📚 CGPA: <b>${student.cgpa}</b></p>

            <p>💻 Skills: <b>${student.skills}</b></p>

            <p>📌 Status: <b>${student.status}</b></p>

        </div>

    `;

}
function showStudentPerformance(){

    let role =
    localStorage.getItem("role");

    let section =
    document.getElementById(
        "studentPerformanceSection"
    );

    let result =
    document.getElementById(
        "studentPerformance"
    );

    if(!section || !result) return;


    if(role !== "student"){

        section.style.display = "none";

        return;

    }


    section.style.display = "block";


    let username =
    localStorage.getItem(
        "studentUsername"
    );


    let student =
    students.find(
        s =>
        s.name.toLowerCase()
        ===
        username.toLowerCase()
    );


    if(!student){

        result.innerHTML =
        "<p>Student data not available.</p>";

        return;

    }


    let eligibility =
    student.cgpa >= 7.5
    ? "✅ Eligible for Placement"
    : "❌ Improve CGPA";


    let performance;


    if(student.cgpa >= 8.5){

        performance =
        "🌟 Excellent Performance";

    }

    else if(student.cgpa >= 7.5){

        performance =
        "👍 Good Performance";

    }

    else{

        performance =
        "📚 Need Improvement";

    }


    result.innerHTML = `

        <div class="performance-card">

            <h3>${performance}</h3>

            <p>📚 CGPA:
                <b>${student.cgpa}</b>
            </p>

            <p>🎯 ${eligibility}</p>

            <p>💻 Skills:
                <b>${student.skills}</b>
            </p>

            <p>📌 Placement Status:
                <b>${student.status}</b>
            </p>

        </div>

    `;

}


    function showPlacementDrives(){

    let tableBodies =
        document.querySelectorAll("#driveTableBody");

    if(tableBodies.length === 0) return;

    let defaultDrives = [

        {
            company: "TCS",
            role: "Software Developer",
            date: "25-07-2026",
            cgpa: 7.5,
            status: "Upcoming"
        },

        {
            company: "Infosys",
            role: "System Engineer",
            date: "30-07-2026",
            cgpa: 7.0,
            status: "Upcoming"
        },

        {
            company: "Wipro",
            role: "Project Engineer",
            date: "05-08-2026",
            cgpa: 6.5,
            status: "Upcoming"
        }

    ];

    let savedDrives =
        JSON.parse(
            localStorage.getItem("placementDrives")
        ) || [];

    let html = "";

    defaultDrives.forEach(drive => {

        html += `

        <tr>

            <td>${drive.company}</td>

            <td>${drive.role}</td>

            <td>${drive.date}</td>

            <td>${drive.cgpa}</td>

            <td>${drive.status}</td>

            <td>

    <button onclick="applyForDrive('${drive.company}', '${drive.role}')">

        📝 Apply Now

    </button>

</td>

        </tr>

        `;

    });

    savedDrives.forEach((drive, index) => {

        html += `

        <tr>

            <td>${drive.company}</td>

            <td>${drive.role}</td>

            <td>${drive.date}</td>

            <td>${drive.cgpa}</td>

            <td>${drive.status}</td>

            <td>

    <button onclick="applyForDrive('${drive.company}', '${drive.role}')">

        📝 Apply Now

    </button>

</td>

        </tr>

        `;

    });

    tableBodies.forEach(tableBody => {

        tableBody.innerHTML = html;

    });

}

function addPlacementDrive(){

    let company =
    document.getElementById("driveCompany").value;

    let role =
    document.getElementById("driveRole").value;

    let date =
    document.getElementById("driveDate").value;

    let cgpa =
    Number(
        document.getElementById("driveCGPA").value
    );


    if(
        company === "" ||
        role === "" ||
        date === "" ||
        !cgpa
    ){

        alert("Please fill all placement drive details");

        return;

    }


    let drive = {

        company: company,

        role: role,

        date: date,

        cgpa: cgpa,

        status: "Upcoming"

    };


    let savedDrives =
    JSON.parse(
        localStorage.getItem("placementDrives")
    ) || [];


    savedDrives.push(drive);


    localStorage.setItem(
        "placementDrives",
        JSON.stringify(savedDrives)
    );


    alert("Placement Drive Added Successfully");


    document.getElementById("driveCompany").value = "";

    document.getElementById("driveRole").value = "";

    document.getElementById("driveDate").value = "";

    document.getElementById("driveCGPA").value = "";


    showPlacementDrives();
}

function deletePlacementDrive(index){

    let confirmDelete =
        confirm("Are you sure you want to delete this placement drive?");

    if(!confirmDelete){
        return;
    }

    let savedDrives =
        JSON.parse(
            localStorage.getItem("placementDrives")
        ) || [];

    savedDrives.splice(index, 1);

    localStorage.setItem(
        "placementDrives",
        JSON.stringify(savedDrives)
    );

    alert("Placement Drive Deleted Successfully");

    showPlacementDrives();

}
// =======================================
// Apply for Placement Drive
// =======================================

function applyForDrive(company, role){
    alert("Button clicked");

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];

    let alreadyApplied =
        applications.some(
            app => app.company === company &&
                   app.role === role
        );

    if(alreadyApplied){

        alert("You have already applied for this drive");

        return;

    }

    applications.push({

        company: company,

        role: role,

        status: "Applied"

    });

    localStorage.setItem(
    "myApplications",
    JSON.stringify(applications)
);

showMyApplications();
updateApplicationSummary();

alert(
    "✅ Application Submitted Successfully");

}
function showMyApplications(){

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];

    let tableBody =
        document.getElementById("applicationTableBody");

    if(!tableBody) return;

    tableBody.innerHTML = "";

    applications.forEach((app, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${app.company}</td>

            <td>${app.role}</td>

            <td>

                <select onchange="updateApplicationStatus(${index}, this.value)">

                    <option value="Applied"
                    ${app.status === "Applied" ? "selected" : ""}>
                    Applied
                    </option>

                    <option value="Shortlisted"
                    ${app.status === "Shortlisted" ? "selected" : ""}>
                    Shortlisted
                    </option>

                    <option value="Interview"
                    ${app.status === "Interview" ? "selected" : ""}>
                    Interview
                    </option>

                    <option value="Selected"
                    ${app.status === "Selected" ? "selected" : ""}>
                    Selected
                    </option>

                    <option value="Rejected"
                    ${app.status === "Rejected" ? "selected" : ""}>
                    Rejected
                    </option>

                </select>
                <button onclick="viewApplicationDetails(${index})">
    👁 View Details
</button>

            </td>

        </tr>

        `;

    });


}
function filterApplications(){

    let search =
        document.getElementById("applicationSearch")
        .value
        .toLowerCase();

    let status =
        document.getElementById(
            "applicationStatusFilter"
        ).value;

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];

    let filteredApplications =
        applications.filter(app => {

            let searchMatch =
                app.company.toLowerCase().includes(search) ||
                app.role.toLowerCase().includes(search);

            let statusMatch =
                status === "All" ||
                app.status === status;

            return searchMatch && statusMatch;

        });

    let tableBody =
        document.getElementById(
            "applicationTableBody"
        );

    tableBody.innerHTML = "";

    filteredApplications.forEach(app => {

        let index =
            applications.indexOf(app);

        tableBody.innerHTML += `

        <tr>

            <td>${app.company}</td>

            <td>${app.role}</td>

            <td>

                <select
                onchange="updateApplicationStatus(${index}, this.value)">

                    <option value="Applied"
                    ${app.status === "Applied" ? "selected" : ""}>
                    Applied
                    </option>

                    <option value="Shortlisted"
                    ${app.status === "Shortlisted" ? "selected" : ""}>
                    Shortlisted
                    </option>

                    <option value="Interview"
                    ${app.status === "Interview" ? "selected" : ""}>
                    Interview
                    </option>

                    <option value="Selected"
                    ${app.status === "Selected" ? "selected" : ""}>
                    Selected
                    </option>

                    <option value="Rejected"
                    ${app.status === "Rejected" ? "selected" : ""}>
                    Rejected
                    </option>

                </select>

            </td>

        </tr>

        `;

    });

}
function updateApplicationSummary(){

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];
        console.log(applications);

    let applied = 0;
    let shortlisted = 0;
    let interview = 0;
    let selected = 0;
    let rejected = 0;

    applications.forEach(app => {

        if(app.status === "Applied"){
            applied++;
        }

        else if(app.status === "Shortlisted"){
            shortlisted++;
        }

        else if(app.status === "Interview"){
            interview++;
        }

        else if(app.status === "Selected"){
            selected++;
        }

        else if(app.status === "Rejected"){
            rejected++;
        }

    });

    document.getElementById("appliedCount").innerHTML = applied;
    document.getElementById("shortlistedCount").innerHTML = shortlisted;
    document.getElementById("interviewCount").innerHTML = interview;
    document.getElementById("selectedCount").innerHTML = selected;
    document.getElementById("rejectedCount").innerHTML = rejected;

}
function updateApplicationStatus(index, newStatus){

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];

    applications[index].status = newStatus;

    localStorage.setItem(
        "myApplications",
        JSON.stringify(applications)
    );
    showMyApplications();
    updateApplicationSummary();

    alert("Application Status Updated Successfully");

}
function viewApplicationDetails(index){

    let applications =
        JSON.parse(
            localStorage.getItem("myApplications")
        ) || [];

    let app = applications[index];

    alert(
        "🏢 Company: " + app.company +
        "\n💼 Role: " + app.role +
        "\n📊 Status: " + app.status
    );
}
// =======================================
// Student Notifications
// =======================================

function showStudentNotifications(){

    let section =
        document.getElementById("studentNotificationSection");

    let notifications =
        document.getElementById("studentNotifications");

    if(!section || !notifications) return;

    let role = localStorage.getItem("role");

    if(role !== "student"){

        section.style.display = "none";

        return;

    }

    section.style.display = "block";

    notifications.innerHTML = `

        <div class="notification-card">

            <p>📢 New Placement Drives Available</p>

            <p>🎯 Check your placement eligibility</p>

            <p>🤖 Try AI Placement Prediction</p>

            <p>📄 Upload your resume for AI score</p>

        </div>

    `;

}

function showNotification(message) {

    alert("🔔 Notification\n\n" + message);

}

function editCompany(companyName) {

    let newRole = prompt("Enter new role:");

    if (newRole === null || newRole.trim() === "") {
        return;
    }

    fetch(
        "http://127.0.0.1:5000/companies/" +
        encodeURIComponent(companyName),
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                role: newRole
            })
        }
    )

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        getCompanies();

    })

    .catch(error => {

        console.error("Edit Company Error:", error);

        alert("Edit failed");

    });

}

    function analyzeSkillGapAI() {
        analyzeSkillGap();
    }
    

    


function analyzeResume() {

    let analysis = document.getElementById("resumeAnalysis");

    let score = Math.floor(Math.random() * 21) + 80;

    let result = "";

    if(score >= 90){

        result = `
        <p>✅ Resume Score: <b>${score}/100</b></p>
        <p>🌟 Excellent Resume</p>
        <p>✔ Strong Skills</p>
        <p>✔ Good Projects</p>
        <p>✔ Placement Ready</p>
        `;

    } else if(score >= 80){

        result = `
        <p>✅ Resume Score: <b>${score}/100</b></p>
        <p>👍 Good Resume</p>
        <p>📚 Add Certifications</p>
        <p>💻 Improve Projects</p>
        `;

    } else {

        result = `
        <p>❌ Resume Score: <b>${score}/100</b></p>
        <p>📚 Improve Technical Skills</p>
        <p>💻 Add More Projects</p>
        <p>🏆 Add Internships</p>
        `;

    }

    analysis.innerHTML = result;
}
function calculatePlacementScore() {

    let cgpa = 8.0;
    let score = 50;

    if (cgpa >= 9) {
        score += 30;
    } else if (cgpa >= 8) {
        score += 20;
    } else if (cgpa >= 7) {
        score += 10;
    }

    score += 20; // Skills & Resume bonus

    let result = "";

    if (score >= 90) {
        result = "🟢 Excellent - Eligible for Top Companies";
    } else if (score >= 75) {
        result = "🟡 Good - Placement Ready";
    } else {
        result = "🔴 Improve Skills and CGPA";
    }

    document.getElementById("placementScoreResult").innerHTML = `
        <h3>🎯 Placement Score: ${score}/100</h3>
        <p>${result}</p>
    `;
}
const interviewQuestions = {

    Java: {

        Easy: [
            {
                q: "What is Java?",
                a: "Java is a high-level, object-oriented programming language."
            },
            {
                q: "What is a class in Java?",
                a: "A class is a blueprint used to create objects."
            },
            {
                q: "What is an object?",
                a: "An object is an instance of a class."
            },
            {
                q: "What is inheritance?",
                a: "Inheritance allows one class to acquire properties and methods of another class."
            },
            {
                q: "What is a constructor?",
                a: "A constructor is a special method used to initialize an object."
            }
        ],

        Medium: [
            {
                q: "What is method overloading?",
                a: "Method overloading means having multiple methods with the same name but different parameters."
            },
            {
                q: "What is method overriding?",
                a: "Method overriding occurs when a subclass provides its own implementation of a parent class method."
            },
            {
                q: "What is encapsulation?",
                a: "Encapsulation means wrapping data and methods together and controlling access to the data."
            },
            {
                q: "What is polymorphism?",
                a: "Polymorphism allows the same interface or method name to behave differently in different situations."
            },
            {
                q: "What is an interface in Java?",
                a: "An interface defines a contract that implementing classes must follow."
            }
        ],

        Hard: [
            {
                q: "What is the difference between == and equals() in Java?",
                a: "== compares references for objects, while equals() is used to compare object content when properly overridden."
            },
            {
                q: "What is the Java Virtual Machine?",
                a: "JVM executes Java bytecode and provides platform independence."
            },
            {
                q: "What is garbage collection?",
                a: "Garbage collection automatically removes objects that are no longer reachable."
            },
            {
                q: "What is exception handling?",
                a: "Exception handling manages runtime errors using mechanisms such as try, catch, finally, throw and throws."
            },
            {
                q: "What is multithreading?",
                a: "Multithreading allows multiple threads to execute concurrently within a program."
            }
        ]
    },

    Python: {

        Easy: [
            {
                q: "What is Python?",
                a: "Python is a high-level, interpreted, general-purpose programming language."
            },
            {
                q: "What is a list in Python?",
                a: "A list is an ordered and mutable collection of elements."
            },
            {
                q: "What is a tuple?",
                a: "A tuple is an ordered collection that cannot be modified after creation."
            },
            {
                q: "What is a dictionary?",
                a: "A dictionary stores data as key-value pairs."
            },
            {
                q: "What is a variable?",
                a: "A variable is a name that refers to a value or object."
            }
        ],

        Medium: [
            {
                q: "What is a list comprehension?",
                a: "List comprehension provides a concise way to create lists using an expression and iteration."
            },
            {
                q: "What is a lambda function?",
                a: "A lambda is a small anonymous function defined using the lambda keyword."
            },
            {
                q: "What is exception handling in Python?",
                a: "Python uses try, except, else and finally to handle exceptions."
            },
            {
                q: "What is a module?",
                a: "A module is a Python file containing reusable code such as functions and classes."
            },
            {
                q: "What is inheritance in Python?",
                a: "Inheritance allows a class to reuse and extend functionality from another class."
            }
        ],

        Hard: [
            {
                q: "What is a decorator in Python?",
                a: "A decorator modifies or extends the behavior of a function or class without changing its source code."
            },
            {
                q: "What is a generator?",
                a: "A generator produces values lazily using yield."
            },
            {
                q: "What is the difference between deep copy and shallow copy?",
                a: "A shallow copy copies the outer object while sharing nested references; a deep copy recursively copies nested objects."
            },
            {
                q: "What is the Global Interpreter Lock?",
                a: "The GIL allows only one thread at a time to execute Python bytecode in a CPython process."
            },
            {
                q: "What are *args and **kwargs?",
                a: "*args accepts variable positional arguments and **kwargs accepts variable keyword arguments."
            }
        ]
    },

    SQL: {

        Easy: [
            {
                q: "What is SQL?",
                a: "SQL is a language used to manage and query relational databases."
            },
            {
                q: "What is a primary key?",
                a: "A primary key uniquely identifies each row in a table."
            },
            {
                q: "What is a table?",
                a: "A table stores data in rows and columns."
            },
            {
                q: "What is SELECT?",
                a: "SELECT is used to retrieve data from database tables."
            },
            {
                q: "What is a database?",
                a: "A database is an organized collection of data."
            }
        ],

        Medium: [
            {
                q: "What is a foreign key?",
                a: "A foreign key is a column that references a key in another table."
            },
            {
                q: "What is a JOIN?",
                a: "A JOIN combines related rows from two or more tables."
            },
            {
                q: "What is GROUP BY?",
                a: "GROUP BY groups rows with the same values for aggregate calculations."
            },
            {
                q: "What is HAVING?",
                a: "HAVING filters grouped results after GROUP BY."
            },
            {
                q: "What is normalization?",
                a: "Normalization organizes database data to reduce redundancy and improve consistency."
            }
        ],

        Hard: [
            {
                q: "What is an index in SQL?",
                a: "An index is a database structure that can improve query lookup performance."
            },
            {
                q: "What is a subquery?",
                a: "A subquery is a query nested inside another SQL query."
            },
            {
                q: "What is a view?",
                a: "A view is a virtual table based on the result of a query."
            },
            {
                q: "What is a transaction?",
                a: "A transaction is a sequence of database operations treated as one logical unit of work."
            },
            {
                q: "What is ACID?",
                a: "ACID stands for Atomicity, Consistency, Isolation and Durability."
            }
        ]
    },

    HR: {

        Easy: [
            {
                q: "Tell me about yourself.",
                a: "Give a short introduction covering your education, skills, projects and career interests."
            },
            {
                q: "What are your strengths?",
                a: "Mention genuine strengths such as problem solving, communication, teamwork or adaptability with examples."
            },
            {
                q: "Why should we hire you?",
                a: "Explain how your skills, attitude and willingness to learn can contribute to the company."
            },
            {
                q: "What is your career goal?",
                a: "Describe a realistic career direction and how you plan to grow your skills."
            },
            {
                q: "Are you a team player?",
                a: "Explain how you collaborate, communicate and contribute to team goals."
            }
        ],

        Medium: [
            {
                q: "Tell me about a difficult situation you faced.",
                a: "Use the STAR method: Situation, Task, Action and Result."
            },
            {
                q: "How do you handle failure?",
                a: "Explain what you learned from the experience and how you improved afterward."
            },
            {
                q: "Why do you want to join our company?",
                a: "Connect your interests and skills with the company's work, culture and opportunities."
            },
            {
                q: "How do you handle pressure?",
                a: "Explain how you prioritize tasks, stay organized and remain calm."
            },
            {
                q: "What is your weakness?",
                a: "Choose a genuine but manageable weakness and explain how you are working to improve it."
            }
        ],

        Hard: [
            {
                q: "Where do you see yourself in five years?",
                a: "Describe how you want to grow professionally while contributing to the organization."
            },
            {
                q: "Why should we choose you over another candidate?",
                a: "Focus on your unique combination of skills, projects, learning attitude and ability to contribute."
            },
            {
                q: "How would you handle conflict with a teammate?",
                a: "Explain how you would listen, communicate respectfully, understand the issue and work toward a solution."
            },
            {
                q: "What would you do if you disagreed with your manager?",
                a: "Discuss the issue respectfully, provide evidence and support the final decision professionally."
            },
            {
                q: "Why should we trust you with an important responsibility?",
                a: "Show reliability through examples of responsibility, deadlines, teamwork and consistent performance."
            }
        ]
    }
};


let currentInterviewQuestion = null;
let interviewQuestionNumber = 0;


function generateInterviewQuestion() {

    const topic =
        document.getElementById("interviewTopic").value;

    const difficulty =
        document.getElementById("interviewDifficulty").value;

    const questions =
        interviewQuestions[topic][difficulty];

    const randomIndex =
        Math.floor(Math.random() * questions.length);

    currentInterviewQuestion =
        questions[randomIndex];

    interviewQuestionNumber++;

    document.getElementById("interviewProgress").innerHTML =
        "Question " + interviewQuestionNumber;

    document.getElementById("interviewQuestion").innerHTML =
        "<h3>🤖 " + currentInterviewQuestion.q + "</h3>";

    document.getElementById("interviewAnswer").innerHTML = "";

    document.getElementById("showAnswerBtn").style.display =
        "inline-block";
}


function nextInterviewQuestion() {

    const topic = document.getElementById("interviewTopic").value;
    const difficulty = document.getElementById("interviewDifficulty").value;

    const questions = interviewQuestions[topic][difficulty];

    if (!questions || questions.length === 0) {
        return;
    }

    let randomIndex = Math.floor(Math.random() * questions.length);

    currentInterviewQuestion = questions[randomIndex];

    interviewQuestionNumber++;

    document.getElementById("interviewProgress").innerHTML =
        "Question " + interviewQuestionNumber;

    document.getElementById("interviewQuestion").innerHTML =
        "<h3>🤖 " + currentInterviewQuestion.q + "</h3>";

    document.getElementById("interviewAnswer").innerHTML = "";

    document.getElementById("showAnswerBtn").style.display =
        "inline-block";
}

function showInterviewAnswer() {

    if (!currentInterviewQuestion) {
        return;
    }

    document.getElementById("interviewAnswer").innerHTML =
        "<div class='interview-answer'>" +
        "<strong>💡 Answer:</strong><br>" +
        currentInterviewQuestion.a +
        "</div>";
}
function startMockInterview() {

    let questions = [

        "Tell me about yourself.",

        "Why should we hire you?",

        "What are your strengths?",

        "Explain your final year project.",

        "Where do you see yourself in 5 years?",

        "What is OOP?",

        "Difference between SQL and NoSQL?"

    ];

    let random =
        Math.floor(Math.random() * questions.length);

    document.getElementById("mockInterviewResult").innerHTML = `

        <h3>🎯 Interview Question</h3>

        <p>${questions[random]}</p>

    `;
}
function generateRoadmap(){

    let roadmap = `

    <h3>🎯 Career Roadmap</h3>

    <ol>

        <li>📘 Learn Programming (Python / Java)</li>

        <li>🗄️ Learn SQL & Database</li>

        <li>🌐 Learn HTML, CSS & JavaScript</li>

        <li>⚛️ Learn React.js Basics</li>

        <li>🐍 Learn Flask / Node.js</li>

        <li>📊 Build 3 Real Projects</li>

        <li>📄 Improve Resume & LinkedIn</li>

        <li>🧠 Practice Aptitude Daily</li>

        <li>🎤 Attend Mock Interviews</li>

        <li>🏢 Apply for Companies</li>

    </ol>

    `;

    document.getElementById("roadmapResult").innerHTML = roadmap;

}
function generateAnalytics() {

    let total = students.length;

    let placed =
        students.filter(
            student => student.status === "Placed"
        ).length;

    let rate =
        Math.round((placed / total) * 100);

    document.getElementById("analyticsResult").innerHTML = `

        <p>👥 Total Students: ${total}</p>

        <p>✅ Placed Students: ${placed}</p>

        <p>📈 Placement Rate: ${rate}%</p>

    `;
}
function showSkillProgress(){

    document.getElementById("skillProgressResult").innerHTML = `

        <h3>💻 Python</h3>
        <progress value="85" max="100"></progress> 85%

        <h3>🗄 SQL</h3>
        <progress value="70" max="100"></progress> 70%

        <h3>🌐 HTML/CSS</h3>
        <progress value="90" max="100"></progress> 90%

        <h3>⚡ JavaScript</h3>
        <progress value="75" max="100"></progress> 75%

        <h3>🤖 AI / Data Analytics</h3>
        <progress value="65" max="100"></progress> 65%

    `;

}

function showAdvancedAnalytics() {

    let totalStudents = students.length;

    let placedStudents =
        students.filter(
            student => student.status === "Placed"
        ).length;

    let placementRate =
        Math.round(
            (placedStudents / totalStudents) * 100
        );

    document.getElementById(
        "advancedAnalyticsResult"
    ).innerHTML = `

        <h3>📊 Analytics Report</h3>

        <p>Total Students: ${totalStudents}</p>

        <p>Placed Students: ${placedStudents}</p>

        <p>Placement Rate: ${placementRate}%</p>

    `;

}
function sendEmailNotification() {

    let email =
        document.getElementById("emailInput").value;

    let status =
        document.getElementById("emailStatus");

    if (email === "") {

        status.innerHTML =
            "❌ Please enter an email address.";

        return;
    }

    status.innerHTML =
        "✅ Email notification sent successfully.";
}
function analyzeSkillGap() {

    let result =
        document.getElementById("skillGapResult");

    result.innerHTML = `

        <h3>📊 Skill Analysis</h3>

        <p>✅ Python</p>

        <p>✅ SQL</p>

        <p>⚠️ Data Structures</p>

        <p>⚠️ Aptitude Skills</p>

        <p>⚠️ Communication Skills</p>

    `;

}
function showInterviewPerformance() {

    document.getElementById(
        "interviewPerformanceResult"
    ).innerHTML = `

        <h3>🎯 Interview Performance</h3>

        <p>Technical Skills: 85%</p>

        <p>Communication Skills: 80%</p>

        <p>Aptitude Skills: 75%</p>

        <p>Confidence Level: 90%</p>

        <h4>⭐ Overall Rating: Excellent</h4>

    `;

}
// ===============================
// New AI Chat Assistant
// ===============================

function toggleAIChat() {

    const chatWindow =
        document.getElementById("aiChatWindow");

    if (chatWindow.style.display === "block") {

        chatWindow.style.display = "none";

    } else {

        chatWindow.style.display = "block";

    }

}


// ===============================
// Ask AI
// ===============================

function askAI() {

    const input =
        document.getElementById("userQuestion");

    const chatBox =
        document.getElementById("chatBox");

    if (!input || !chatBox) {
        return;
    }

    const question =
        input.value.trim();

    if (question === "") {
        return;
    }


    // ===============================
    // User Message
    // ===============================

    chatBox.innerHTML += `

        <div class="user-message">

            👤 ${question}

        </div>

    `;


    input.value = "";


    // ===============================
    // AI Thinking Message
    // ===============================

    const thinkingMessage =
        document.createElement("div");

    thinkingMessage.className =
        "assistant-message";

    thinkingMessage.innerHTML =
        "🤖 Thinking...";


    // White reply box
    thinkingMessage.style.backgroundColor = "white";
    thinkingMessage.style.color = "#222";
    thinkingMessage.style.padding = "15px 18px";
    thinkingMessage.style.borderRadius = "15px";
    thinkingMessage.style.margin = "12px 10px";
    thinkingMessage.style.maxWidth = "85%";
    thinkingMessage.style.width = "fit-content";
    thinkingMessage.style.lineHeight = "1.5";
    thinkingMessage.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.15)";


    chatBox.appendChild(thinkingMessage);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    // ===============================
    // Send Question to Flask Backend
    // ===============================

    fetch(
        "http://127.0.0.1:5000/api/ai-chat",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        }
    )


    .then(response => {

        if (!response.ok) {

            throw new Error(
                "AI API Error: " + response.status
            );

        }

        return response.json();

    })


    .then(data => {

        console.log("AI RESPONSE:", data);


        // Get AI answer
        let answer =
            data.answer ||
            data.response ||
            data.message;


        if (!answer) {

            answer =
                getAIAnswer(question);

        }


        // ===============================
        // AI Reply
        // ===============================

        thinkingMessage.innerHTML =
            "🤖 " + answer;


        // White background
        thinkingMessage.style.backgroundColor =
            "white";

        // Black text
        thinkingMessage.style.color =
            "#222";

        thinkingMessage.style.padding =
            "15px 18px";

        thinkingMessage.style.borderRadius =
            "15px";

        thinkingMessage.style.margin =
            "12px 10px";

        thinkingMessage.style.maxWidth =
            "85%";

        thinkingMessage.style.width =
            "fit-content";

        thinkingMessage.style.lineHeight =
            "1.5";

        thinkingMessage.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.15)";


        chatBox.scrollTop =
            chatBox.scrollHeight;

    })


    .catch(error => {

        console.error(
            "AI Chat Error:",
            error
        );


        // If backend fails
        thinkingMessage.innerHTML =
            "🤖 " + getAIAnswer(question);


        // White reply box
        thinkingMessage.style.backgroundColor =
            "white";

        thinkingMessage.style.color =
            "#222";

        thinkingMessage.style.padding =
            "15px 18px";

        thinkingMessage.style.borderRadius =
            "15px";

        thinkingMessage.style.margin =
            "12px 10px";

        thinkingMessage.style.maxWidth =
            "85%";

        thinkingMessage.style.width =
            "fit-content";

        thinkingMessage.style.lineHeight =
            "1.5";

        thinkingMessage.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.15)";


        chatBox.scrollTop =
            chatBox.scrollHeight;

    });

}


function getAIAnswer(question) {

    question = question.toLowerCase().trim();
    question = question.replace(/\s+/g, " ");

    // ===============================
    // PLACEMENT
    // ===============================

    if (
        question.includes("placement") ||
        question.includes("job") ||
        question.includes("vela") ||
        question.includes("velai") ||
        question.includes("placement epdi") ||
        question.includes("placement eppadi") ||
        question.includes("placement improve") ||
        question.includes("placement kidaikuma")
    ) {
        return `
        🎯 Placement improve panna:

        • Aptitude daily practice pannunga
        • Technical skills improve pannunga
        • 2–3 good projects build pannunga
        • Resume strong-ah prepare pannunga
        • Mock interview practice pannunga
        • Company-wise preparation pannunga

        Consistent-ah prepare pannina placement chance improve aagum 👍
        `;
    }


    // ===============================
    // SKILLS
    // ===============================

    if (
        question.includes("skill") ||
        question.includes("skills") ||
        question.includes("learn") ||
        question.includes("enna padikanum") ||
        question.includes("enna kathukanum") ||
        question.includes("edha learn") ||
        question.includes("ethavathu learn")
    ) {
        return `
        💻 Placement-ku useful skills:

        • Python
        • Java
        • SQL
        • HTML & CSS
        • JavaScript
        • Data Structures
        • Git & GitHub

        First one programming language strong-ah kathukonga.
        Athukku apram SQL + problem solving focus pannunga.
        `;
    }


    // ===============================
    // INTERVIEW
    // ===============================

    if (
        question.includes("interview") ||
        question.includes("interview ku") ||
        question.includes("interview epdi") ||
        question.includes("interview eppadi") ||
        question.includes("interview prepare") ||
        question.includes("interview preparation") ||
        question.includes("prepare aaganum")
    ) {
        return `
        🎤 Interview preparation-ku:

        1. Self introduction practice pannunga
        2. Technical basics revise pannunga
        3. Project explanation ready-ah vechukonga
        4. Common HR questions practice pannunga
        5. Mock interviews try pannunga

        Confidence + clear communication romba important 👍
        `;
    }


    // ===============================
    // RESUME
    // ===============================

    if (
        question.includes("resume") ||
        question.includes("cv") ||
        question.includes("resume epdi") ||
        question.includes("resume eppadi") ||
        question.includes("resume improve") ||
        question.includes("resume improve panna")
    ) {
        return `
        📄 Resume improve panna:

        • Skills
        • Projects
        • Internship
        • Certifications
        • Achievements
        • Technical skills

        Relevant information mattum clean-ah highlight pannunga.
        `;
    }


    // ===============================
    // COMPANY
    // ===============================

    if (
        question.includes("company") ||
        question.includes("companies") ||
        question.includes("company details") ||
        question.includes("company pathi") ||
        question.includes("entha company") ||
        question.includes("endha company")
    ) {
        return `
        🏢 Company choose pannumbodhu:

        • Job role
        • Required skills
        • Eligibility
        • Package
        • Selection process

        Indha details check pannitu prepare pannunga.
        `;
    }


    // ===============================
    // APTITUDE
    // ===============================

    if (
        question.includes("aptitude") ||
        question.includes("maths") ||
        question.includes("reasoning") ||
        question.includes("logical") ||
        question.includes("aptitude epdi") ||
        question.includes("aptitude eppadi")
    ) {
        return `
        🧠 Aptitude preparation-ku:

        • Percentages
        • Profit & Loss
        • Time & Work
        • Time, Speed & Distance
        • Ratio & Proportion
        • Probability
        • Logical Reasoning

        Daily 10–20 questions practice pannina nalla improvement varum.
        `;
    }


    // ===============================
    // GREETING
    // ===============================

    if (
        question.includes("vanakkam") ||
        question.includes("hello") ||
        question.includes("hi") ||
        question.includes("hai")
    ) {
        return `
        👋 Vanakkam! 😊

        Naan unga AI Placement Assistant.

        Placement, interview, resume, skills,
        aptitude, companies pathi enna venumnaalum kekkalam.
        `;
    }


    // ===============================
    // HOW ARE YOU
    // ===============================

    if (
        question.includes("epdi iruka") ||
        question.includes("eppadi iruka") ||
        question.includes("epdi irukinga") ||
        question.includes("eppadi irukinga")
    ) {
        return "😊 Naan super-ah iruken macha! Placement preparation-ku ready-ah help panren.";
    }


    // ===============================
    // THANK YOU
    // ===============================

    if (
        question.includes("thanks") ||
        question.includes("thank you") ||
        question.includes("nandri")
    ) {
        return "😊 You're welcome macha! Placement preparation-ku best wishes! 🎯";
    }


    // ===============================
    // DEFAULT
    // ===============================

    return `
    🤖 Purinjukitten!

    Placement, interview, resume, skills,
    aptitude illa company related doubt-na
    kekkalam.

    Tamil / Tanglish-la keta kooda
    try panni understand pannuren 👍
    `;
}
// =================================
// AI PLACEMENT SUMMARY
// =================================

function generateAISummary() {

    const result = document.getElementById("aiSummaryContent");

    if (!result) return;

    result.innerHTML = `
        <div class="ai-summary-loading">
            🤖 AI is analyzing placement data...
        </div>
    `;

    setTimeout(() => {

        const total =
            parseInt(document.getElementById("totalStudents")?.innerText) || 0;

        const placed =
            parseInt(document.getElementById("placedStudents")?.innerText) || 0;

        const rateText =
            document.getElementById("placementRate")?.innerText || "0%";

        const rate =
            parseFloat(rateText.replace("%", "")) || 0;

        let performance;
        let performanceIcon;

        if (rate >= 80) {
            performance = "Excellent placement performance";
            performanceIcon = "🟢";
        } else if (rate >= 60) {
            performance = "Good placement performance";
            performanceIcon = "🟡";
        } else {
            performance = "Placement performance needs improvement";
            performanceIcon = "🔴";
        }

        const notPlaced = Math.max(total - placed, 0);

        result.innerHTML = `

            <div class="ai-insight-cards">

                <div class="ai-insight-card">
                    <span class="ai-insight-icon">📊</span>
                    <h3>Placement Performance</h3>
                    <strong>${rate}%</strong>
                    <p>
                        ${performanceIcon} ${performance}
                    </p>
                </div>

                <div class="ai-insight-card">
                    <span class="ai-insight-icon">🎯</span>
                    <h3>Student Readiness</h3>
                    <strong>${notPlaced}</strong>
                    <p>
                        Students currently need placement opportunities
                        and preparation support.
                    </p>
                </div>

                <div class="ai-insight-card">
                    <span class="ai-insight-icon">🚀</span>
                    <h3>AI Recommendation</h3>
                    <strong>Improve</strong>
                    <p>
                        Focus on aptitude, technical skills,
                        interview preparation and company-specific training.
                    </p>
                </div>

            </div>
        `;

    }, 800);
}



// =======================================
// ON-CAMPUS PLACEMENT
// =======================================

function showOnCampus() {

    let section = document.getElementById("onCampusSection");

    if (!section) {
        alert("On-Campus section not found.");
        return;
    }

    section.style.display = "block";

    const tbody = document.getElementById("onCampusBody");

    if (!tbody) {
        alert("On-Campus data area not found.");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="4">Loading On-Campus companies...</td>
        </tr>
    `;

    fetch("http://127.0.0.1:5000/companies")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load companies");
            }

            return response.json();

        })
        .then(companies => {

            const onCampusCompanies =
                companies.filter(company =>
                    company.campusType === "On-Campus"
                );

            tbody.innerHTML = "";

            if (onCampusCompanies.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No On-Campus companies available
                        </td>
                    </tr>
                `;

                return;
            }

            onCampusCompanies.forEach(company => {

                tbody.innerHTML += `
                    <tr>
                        <td>${company.company || "-"}</td>
                        <td>${company.role || "-"}</td>
                        <td>${company.package || "-"} LPA</td>
                        <td>On-Campus</td>
                    </tr>
                `;

            });

            section.scrollIntoView({
                behavior: "smooth"
            });

        })
        .catch(error => {

            console.error("On-Campus Error:", error);

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Unable to load On-Campus companies
                    </td>
                </tr>
            `;

        });
}


// =======================================
// OFF-CAMPUS PLACEMENT
// =======================================

function showOffCampus() {

    let section = document.getElementById("offCampusSection");

    if (!section) {
        alert("Off-Campus section not found.");
        return;
    }

    section.style.display = "block";

    const tbody = document.getElementById("offCampusBody");

    if (!tbody) {
        alert("Off-Campus data area not found.");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="4">Loading Off-Campus companies...</td>
        </tr>
    `;

    fetch("http://127.0.0.1:5000/companies")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load companies");
            }

            return response.json();

        })
        .then(companies => {

            const offCampusCompanies =
                companies.filter(company =>
                    company.campusType === "Off-Campus"
                );

            tbody.innerHTML = "";

            if (offCampusCompanies.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No Off-Campus companies available
                        </td>
                    </tr>
                `;

                return;
            }

            offCampusCompanies.forEach(company => {

                tbody.innerHTML += `
                    <tr>
                        <td>${company.company || "-"}</td>
                        <td>${company.role || "-"}</td>
                        <td>${company.package || "-"} LPA</td>
                        <td>Off-Campus</td>
                    </tr>
                `;

            });

            section.scrollIntoView({
                behavior: "smooth"
            });

        })
        .catch(error => {

            console.error("Off-Campus Error:", error);

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Unable to load Off-Campus companies
                    </td>
                </tr>
            `;

        });
}