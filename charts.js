// =======================================
// AI Placement Analytics Dashboard
// charts.js
// =======================================

let companyChartInstance = null;
let departmentChartInstance = null;
let placementChartInstance = null;


// =======================================
// Company Wise Hiring Chart
// =======================================

function loadCompanyChart() {

    console.log("🔵 Loading Company Chart...");

    fetch("http://127.0.0.1:5000/companies")

        .then(response => {

            console.log("Company API Status:", response.status);

            return response.json();

        })

        .then(data => {

            console.log("COMPANY CHART DATA:", data);

            let companyNames = [];
            let studentsCount = [];

            data.forEach(company => {

                companyNames.push(company.company);

                studentsCount.push(
                    Number(company.studentsPlaced) || 0
                );

            });

            const canvas =
                document.getElementById("companyChart");

            if (!canvas) {

                console.error(
                    "❌ companyChart canvas NOT FOUND"
                );

                return;
            }

            console.log("✅ companyChart FOUND");

            if (companyChartInstance) {
                companyChartInstance.destroy();
            }

            companyChartInstance = new Chart(canvas, {

                type: "bar",

                data: {

                    labels: companyNames,

                    datasets: [{

                        label: "Students Placed",

                        data: studentsCount

                    }]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            });

            console.log("✅ Company Chart Loaded");

        })

        .catch(error => {

            console.error(
                "❌ Company Chart Error:",
                error
            );

        });

}


// =======================================
// Department Placement Rate Chart
// =======================================

function loadDepartmentChart() {

    console.log("🟡 Loading Department Chart...");

    fetch("http://127.0.0.1:5000/api/students")

        .then(response => {

            console.log(
                "Department API Status:",
                response.status
            );

            return response.json();

        })

        .then(data => {

            console.log(
                "DEPARTMENT DATA:",
                data
            );

            let departments = {};

            data.forEach(student => {

                let dept = student.department;

                if (!departments[dept]) {

                    departments[dept] = {

                        total: 0,

                        placed: 0

                    };

                }

                departments[dept].total++;

                if (
                    String(student.status).toLowerCase()
                    === "placed"
                ) {

                    departments[dept].placed++;

                }

            });


            let labels = [];
            let rates = [];


            for (let dept in departments) {

                labels.push(dept);

                let total =
                    departments[dept].total;

                let placed =
                    departments[dept].placed;

                let rate =
                    total > 0
                        ? Math.round(
                            (placed / total) * 100
                        )
                        : 0;

                rates.push(rate);

            }


            console.log(
                "Department Labels:",
                labels
            );

            console.log(
                "Department Rates:",
                rates
            );


            const canvas =
                document.getElementById(
                    "departmentChart"
                );


            if (!canvas) {

                console.error(
                    "❌ departmentChart canvas NOT FOUND"
                );

                return;

            }


            console.log(
                "✅ departmentChart FOUND"
            );


            if (departmentChartInstance) {

                departmentChartInstance.destroy();

            }


            departmentChartInstance =
                new Chart(canvas, {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [{

                            label:
                                "Placement Rate %",

                            data: rates

                        }]

                    },

                    options: {

                        responsive: true,

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100

                            }

                        }

                    }

                });


            console.log(
                "✅ Department Chart Loaded"
            );

        })

        .catch(error => {

            console.error(
                "❌ Department Chart Error:",
                error
            );

        });

}


// =======================================
// Placement Status Chart
// =======================================

function loadPlacementChart() {

    console.log(
        "🟢 Loading Placement Status Chart..."
    );


    fetch(
        "http://127.0.0.1:5000/api/students"
    )

        .then(response => {

            console.log(
                "Placement API Status:",
                response.status
            );

            return response.json();

        })

        .then(data => {

            console.log(
                "PLACEMENT DATA:",
                data
            );


            let placed = 0;

            let notPlaced = 0;


            data.forEach(student => {

                if (
                    String(student.status).toLowerCase()
                    === "placed"
                ) {

                    placed++;

                }

                else {

                    notPlaced++;

                }

            });


            console.log(
                "Placed:",
                placed,
                "Not Placed:",
                notPlaced
            );


            const canvas =
                document.getElementById(
                    "placementChart"
                );


            if (!canvas) {

                console.error(
                    "❌ placementChart canvas NOT FOUND"
                );

                return;

            }


            console.log(
                "✅ placementChart FOUND"
            );


            if (placementChartInstance) {

                placementChartInstance.destroy();

            }


            placementChartInstance =
                new Chart(canvas, {

                    type: "pie",

                    data: {

                        labels: [

                            "Placed",

                            "Not Placed"

                        ],

                        datasets: [{

                            label: "Students",

                            data: [

                                placed,

                                notPlaced

                            ]

                        }]

                    },

                    options: {

                        responsive: true

                    }

                });


            console.log(
                "✅ Placement Chart Loaded"
            );

        })


        .catch(error => {

            console.error(
                "❌ Placement Chart Error:",
                error
            );

        });

}