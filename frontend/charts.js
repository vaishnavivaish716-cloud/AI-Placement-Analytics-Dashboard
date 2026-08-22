// =======================================
// AI Placement Analytics Dashboard
// charts.js
// =======================================


// =======================================
// COMPANY WISE HIRING CHART
// =======================================

function loadCompanyChart() {

    fetch("http://127.0.0.1:5000/companies")

        .then(response => response.json())

        .then(data => {

            const companyNames = [];
            const studentsCount = [];

            data.forEach(company => {

                companyNames.push(
                    company.company
                );

                studentsCount.push(
                    company.studentsPlaced
                );

            });

            const canvas =
                document.getElementById("companyChart");

            if (!canvas) return;

            // Destroy old chart
            if (window.companyChartInstance) {
                window.companyChartInstance.destroy();
            }

            window.companyChartInstance =
                new Chart(canvas, {

                    type: "bar",

                    data: {

                        labels: companyNames,

                        datasets: [{

                            label: "Students Placed",

                            data: studentsCount,

                            backgroundColor: [
                                "#36A2EB",
                                "#4BC0C0",
                                "#9966FF",
                                "#FF6384",
                                "#FF9F40",
                                "#22C55E"
                            ],

                            borderRadius: 10,

                            borderSkipped: false,

                            barThickness: 45

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: true,
                                position: "top"
                            },

                            tooltip: {

                                backgroundColor: "#1e293b",

                                titleColor: "#ffffff",

                                bodyColor: "#ffffff",

                                padding: 12,

                                cornerRadius: 8

                            }

                        },

                        scales: {

                            x: {

                                grid: {
                                    display: false
                                },

                                ticks: {
                                    color: "#475569",
                                    font: {
                                        weight: "600"
                                    }
                                }

                            },

                            y: {

                                beginAtZero: true,

                                grid: {
                                    color: "rgba(148,163,184,0.15)"
                                },

                                ticks: {
                                    color: "#475569"
                                }

                            }

                        },

                        animation: {

                            duration: 1200,

                            easing: "easeOutQuart"

                        }

                    }

                });

        })

        .catch(error => {

            console.log(
                "Company Chart Error:",
                error
            );

        });

}


// =======================================
// DEPARTMENT PLACEMENT RATE CHART
// =======================================

function loadDepartmentChart() {

    fetch(
        "http://127.0.0.1:5000/api/students"
    )

        .then(response => response.json())

        .then(data => {

            const departments = {};

            data.forEach(student => {

                const dept =
                    student.department;

                if (!departments[dept]) {

                    departments[dept] = {

                        total: 0,

                        placed: 0

                    };

                }

                departments[dept].total++;

                if (
                    student.status &&
                    student.status.toLowerCase() === "placed"
                ) {

                    departments[dept].placed++;

                }

            });


            const labels = [];
            const rates = [];

            for (const dept in departments) {

                labels.push(dept);

                const rate =
                    (
                        departments[dept].placed /
                        departments[dept].total
                    ) * 100;

                rates.push(
                    Math.round(rate)
                );

            }


            const canvas =
                document.getElementById(
                    "departmentChart"
                );

            if (!canvas) return;


            // Destroy old chart
            if (window.departmentChartInstance) {

                window.departmentChartInstance.destroy();

            }


            window.departmentChartInstance =
                new Chart(canvas, {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [{

                            label: "Placement Rate %",

                            data: rates,

                            backgroundColor: [
                                "#8B5CF6",
                                "#06B6D4",
                                "#22C55E",
                                "#F59E0B",
                                "#EC4899",
                                "#6366F1"
                            ],

                            borderRadius: 10,

                            borderSkipped: false,

                            barThickness: 45

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: true,
                                position: "top"
                            },

                            tooltip: {

                                backgroundColor: "#1e293b",

                                titleColor: "#ffffff",

                                bodyColor: "#ffffff",

                                padding: 12,

                                cornerRadius: 8,

                                callbacks: {

                                    label: function(context) {

                                        return (
                                            " Placement Rate: " +
                                            context.raw +
                                            "%"
                                        );

                                    }

                                }

                            }

                        },

                        scales: {

                            x: {

                                grid: {
                                    display: false
                                },

                                ticks: {

                                    color: "#475569",

                                    font: {
                                        weight: "600"
                                    }

                                }

                            },

                            y: {

                                beginAtZero: true,

                                max: 100,

                                grid: {

                                    color:
                                        "rgba(148,163,184,0.15)"

                                },

                                ticks: {

                                    color: "#475569",

                                    callback: function(value) {

                                        return value + "%";

                                    }

                                }

                            }

                        },

                        animation: {

                            duration: 1200,

                            easing: "easeOutQuart"

                        }

                    }

                });

        })

        .catch(error => {

            console.log(
                "Department Chart Error:",
                error
            );

        });

}


// =======================================
// PLACEMENT STATUS CHART
// =======================================

function loadPlacementChart() {

    fetch(
        "http://127.0.0.1:5000/api/students"
    )

        .then(response => response.json())

        .then(data => {

            let placed = 0;

            let notPlaced = 0;


            data.forEach(student => {

                if (
                    student.status &&
                    student.status.toLowerCase() === "placed"
                ) {

                    placed++;

                } else {

                    notPlaced++;

                }

            });


            const canvas =
                document.getElementById(
                    "placementChart"
                );

            if (!canvas) return;


            // Destroy old chart
            if (window.placementChartInstance) {

                window.placementChartInstance.destroy();

            }


            window.placementChartInstance =
                new Chart(canvas, {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Placed",
                            "Not Placed"
                        ],

                        datasets: [{

                            data: [
                                placed,
                                notPlaced
                            ],

                            backgroundColor: [
                                "#2563EB",
                                "#F43F5E"
                            ],

                            borderColor: "#ffffff",

                            borderWidth: 4,

                            hoverOffset: 12

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "65%",

                        plugins: {

                            legend: {

                                display: true,

                                position: "top",

                                labels: {

                                    padding: 18,

                                    usePointStyle: true,

                                    pointStyle: "circle",

                                    font: {

                                        size: 13,

                                        weight: "600"

                                    }

                                }

                            },

                            tooltip: {

                                backgroundColor: "#1e293b",

                                titleColor: "#ffffff",

                                bodyColor: "#ffffff",

                                padding: 12,

                                cornerRadius: 8,

                                callbacks: {

                                    label: function(context) {

                                        const total =
                                            placed +
                                            notPlaced;

                                        const percentage =
                                            total > 0
                                                ? Math.round(
                                                    (
                                                        context.raw /
                                                        total
                                                    ) * 100
                                                )
                                                : 0;

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            context.raw +
                                            " (" +
                                            percentage +
                                            "%)"
                                        );

                                    }

                                }

                            }

                        },

                        animation: {

                            animateRotate: true,

                            animateScale: true,

                            duration: 1200

                        }

                    }

                });

        })

        .catch(error => {

            console.log(
                "Placement Chart Error:",
                error
            );

        });

}