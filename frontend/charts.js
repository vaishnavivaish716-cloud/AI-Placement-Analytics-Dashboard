/* ==========================================================
   AI Placement Analytics Dashboard - charts.js
   Handles: Department Placement Rate (Bar), Company-wise
   Hiring (Pie), and overall Placement Rate progress bar.
   Uses Chart.js (load via CDN in dashboard.html before this file)
   ========================================================== */

// ---- Config: change this if your backend runs elsewhere ----
const API_BASE_URL = "http://127.0.0.1:5000/api"; // update to your Flask/Node backend

// ---- Fallback dummy data (used if backend is not connected yet) ----
const DUMMY_STUDENTS = [
  { id: 1, name: "Arun", department: "CSE", cgpa: 8.9, status: "Placed" },
  { id: 2, name: "Priya", department: "IT", cgpa: 8.1, status: "Placed" },
  { id: 3, name: "Rahul", department: "ECE", cgpa: 7.4, status: "Not Placed" },
  { id: 4, name: "Kavin", department: "AIDS", cgpa: 9.2, status: "Placed" },
  { id: 5, name: "Divya", department: "EEE", cgpa: 6.9, status: "Not Placed" }
];

const DUMMY_COMPANIES = [
  { company: "TCS", studentsPlaced: 120, package: 4.2 },
  { company: "Infosys", studentsPlaced: 95, package: 5.0 },
  { company: "Accenture", studentsPlaced: 60, package: 6.5 },
  { company: "Wipro", studentsPlaced: 45, package: 4.0 }
];

// Keep chart instances so we can destroy & redraw (important for dark mode / refresh)
let deptChartInstance = null;
let companyPieChartInstance = null;

/* ---------------- Data fetch helpers ---------------- */

async function fetchStudents() {
  try {
    const res = await fetch(`${API_BASE_URL}/students`);
    if (!res.ok) throw new Error("Backend not reachable");
    return await res.json();
  } catch (err) {
    console.warn("Using dummy student data:", err.message);
    return DUMMY_STUDENTS;
  }
}

async function fetchCompanies() {
  try {
    const res = await fetch(`${API_BASE_URL}/companies`);
    if (!res.ok) throw new Error("Backend not reachable");
    return await res.json();
  } catch (err) {
    console.warn("Using dummy company data:", err.message);
    return DUMMY_COMPANIES;
  }
}

/* ---------------- Data processing helpers ---------------- */

function computeDepartmentPlacementRate(students) {
  const deptMap = {}; // { CSE: {placed:0,total:0}, ... }

  students.forEach((s) => {
    if (!deptMap[s.department]) {
      deptMap[s.department] = { placed: 0, total: 0 };
    }
    deptMap[s.department].total += 1;
    if (s.status === "Placed") {
      deptMap[s.department].placed += 1;
    }
  });

  const labels = Object.keys(deptMap);
  const rates = labels.map((dept) => {
    const { placed, total } = deptMap[dept];
    return total > 0 ? Math.round((placed / total) * 100) : 0;
  });

  return { labels, rates };
}

function computeOverallPlacementStats(students) {
  const total = students.length;
  const placed = students.filter((s) => s.status === "Placed").length;
  const notPlaced = total - placed;
  const rate = total > 0 ? Math.round((placed / total) * 100) : 0;
  return { total, placed, notPlaced, rate };
}

/* ---------------- Chart renderers ---------------- */

function renderDepartmentBarChart(labels, rates) {
  const canvas = document.getElementById("placementChart");
  if (!canvas) return; // element not on this page

  const ctx = canvas.getContext("2d");

  if (deptChartInstance) {
    deptChartInstance.destroy();
  }

  deptChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Placement %",
          data: rates,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderRadius: 6,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}% placed`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (val) => val + "%" }
        }
      }
    }
  });
}

function renderCompanyPieChart(companies) {
  const canvas = document.getElementById("companyChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const labels = companies.map((c) => c.company);
  const data = companies.map((c) => c.studentsPlaced);

  const colors = [
    "#36A2EB", "#FF6384", "#FF9F40", "#FFCE56",
    "#4BC0C0", "#9966FF", "#C9CBCF"
  ];

  if (companyPieChartInstance) {
    companyPieChartInstance.destroy();
  }

  companyPieChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Students Placed",
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed} students`
          }
        }
      }
    }
  });
}

function renderPlacementRateBar(rate) {
  const bar = document.getElementById("placementBar");
  if (!bar) return;

  bar.style.width = rate + "%";
  bar.style.height = "100%";
  bar.style.background = "#4CAF50";
  bar.style.borderRadius = "8px";
  bar.style.transition = "width 0.6s ease-in-out";
  bar.textContent = rate + "%";
}

function renderSummaryCards(stats) {
  const totalEl = document.getElementById("totalStudents");
  const placedEl = document.getElementById("placedStudents");
  const notPlacedEl = document.getElementById("notPlaced");
  const rateEl = document.getElementById("placementRate");

  if (totalEl) totalEl.textContent = stats.total;
  if (placedEl) placedEl.textContent = stats.placed;
  if (notPlacedEl) notPlacedEl.textContent = stats.notPlaced;
  if (rateEl) rateEl.textContent = stats.rate + "%";
}

function renderTopRecruiterAndPackages(companies) {
  if (!companies.length) return;

  const topRecruiter = companies.reduce((a, b) =>
    a.studentsPlaced > b.studentsPlaced ? a : b
  );
  const highestPackage = Math.max(...companies.map((c) => c.package));
  const avgPackage = (
    companies.reduce((sum, c) => sum + c.package, 0) / companies.length
  ).toFixed(1);

  const topEl = document.getElementById("topCompany");
  const highEl = document.getElementById("highestPackage");
  const avgEl = document.getElementById("averagePackage");

  if (topEl) topEl.textContent = topRecruiter.company;
  if (highEl) highEl.textContent = highestPackage + " LPA";
  if (avgEl) avgEl.textContent = avgPackage + " LPA";
}

/* ---------------- Main init ---------------- */

async function initDashboardCharts() {
  const [students, companies] = await Promise.all([
    fetchStudents(),
    fetchCompanies()
  ]);

  // Summary cards + overall placement rate
  const stats = computeOverallPlacementStats(students);
  renderSummaryCards(stats);
  renderPlacementRateBar(stats.rate);

  // Department bar chart
  const { labels, rates } = computeDepartmentPlacementRate(students);
  renderDepartmentBarChart(labels, rates);

  // Company pie chart + recruiter/package cards
  renderCompanyPieChart(companies);
  renderTopRecruiterAndPackages(companies);
}

// Run once DOM is ready
document.addEventListener("DOMContentLoaded", initDashboardCharts);

// Expose for manual refresh (e.g. after "Add Company" button click)
window.refreshDashboardCharts = initDashboardCharts;