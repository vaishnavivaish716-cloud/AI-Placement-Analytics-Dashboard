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

                    <td>${company.studentsPlaced || 0}</td>

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


function addCompany(){


    let company =
    document.getElementById(
        "companyName"
    ).value;


    let role =
    document.getElementById(
        "companyRole"
    ).value;


    let packageValue =
    document.getElementById(
        "package"
    ).value;


    let studentsPlaced =
    document.getElementById(
        "studentsPlaced"
    ).value;



    if(
        company==="" ||
        packageValue==="" ||
        studentsPlaced===""
    ){

        alert(
            "Please fill company details"
        );

        return;

    }



    let companyData = {


        company: company,

        role: role,

        package: packageValue,

        studentsPlaced:
        Number(studentsPlaced)


    };




    fetch(
        "http://127.0.0.1:5000/companies",
        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:
            JSON.stringify(companyData)

        }

    )


    .then(response=>response.json())


    .then(data=>{


        alert(
            "Company Added Successfully"
        );
        document.getElementById("companyName").value = "";
document.getElementById("companyRole").value = "";
document.getElementById("package").value = "";
document.getElementById("studentsPlaced").value = "";


        getCompanies();


    })

    .catch(error=>{


        console.log(error);


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

        department: document.getElementById("studentDepartment").value,

        cgpa: Number(
            document.getElementById("studentCGPA").value
        ),

        skills: document.getElementById("studentSkills").value,

        status: document.getElementById("studentStatus").value

    };

    fetch("http://127.0.0.1:5000/api/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(studentData)

    })

    .then(response => response.json())

    .then(data => {

        alert("Student Added Successfully");

        getStudents();

    })

    .catch(error => {

        console.log("Add Student Error:", error);

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
function generateInterviewQuestion() {

    let topic = document.getElementById("interviewTopic").value;
    let result = document.getElementById("interviewQuestion");

    let questions = {

        Java: [
            "What is OOP?",
            "Difference between Interface and Abstract Class?",
            "Explain Exception Handling."
        ],

        Python: [
            "What is a List?",
            "Difference between List and Tuple?",
            "Explain Python Functions."
        ],

        SQL: [
            "What is JOIN?",
            "Difference between DELETE and TRUNCATE?",
            "What is Primary Key?"
        ],

        HR: [
            "Tell me about yourself.",
            "Why should we hire you?",
            "What are your strengths?"
        ]

    };

    let random =
        Math.floor(Math.random() * questions[topic].length);

    result.innerHTML = `
        <h3>🎯 ${topic} Interview Question</h3>
        <p>${questions[topic][random]}</p>
    `;
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


// ===============================
// AI Answer
// ===============================

function getAIAnswer(question) {

    question = question.toLowerCase();


    if (
        question.includes("placement") ||
        question.includes("job")
    ) {

        return "I can help you improve your placement preparation with skills, aptitude, projects and interview preparation.";

    }


    if (
        question.includes("skill") ||
        question.includes("learn")
    ) {

        return "You can learn Python, Java, SQL, HTML, CSS, JavaScript and Data Structures.";

    }


    if (question.includes("interview")) {

        return "Prepare your self-introduction, technical questions, aptitude and HR interview questions.";

    }


    if (question.includes("resume")) {

        return "Add your skills, projects, internships, certifications and achievements to your resume.";

    }


    if (question.includes("company")) {

        return "Research the company, required skills and job role before applying.";

    }


    return "Hi! I can help you with placements, skills, interviews, resumes and companies.";

}
