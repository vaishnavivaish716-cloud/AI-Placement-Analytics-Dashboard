function login() {

    let userType = document.getElementById("userType").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (
        userType === "admin" &&
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem("login", "true");
        localStorage.setItem("role", "admin");
        localStorage.setItem("username",username);

        window.location.href = "dashboard.html";

    }

    else if (
        userType === "student" &&
        username === "student" &&
        password === "student123"
    ) {

        localStorage.setItem("login", "true");
        localStorage.setItem("role", "student");
        //Demo student: Arun
        localStorage.setItem("studentUsername", "Ice");

        window.location.href = "dashboard.html";

    }

    else {

        document.getElementById("error").innerHTML =
        "Invalid Username or Password";

    }

}
function togglePassword() {

    const password = document.getElementById("password");
    const eye = document.querySelector(".eye-btn");

    if (password.type === "password") {
        password.type = "text";
        eye.textContent = "🙈";
    } else {
        password.type = "password";
        eye.textContent = "👁️";
    }
}
function updateRobotGreeting() {

    const userType = document.getElementById("userType").value;
    const message = document.getElementById("robotMessage");

    if (userType === "admin") {

        message.innerHTML =
            "👨‍💼 Welcome Placement Officer!";

    } else {

        message.innerHTML =
            "🎓 Welcome Student! Ready for placements?";
    }
}
function typeRobotMessage(text) {

    const message = document.getElementById("robotMessage");

    message.innerHTML = "";

    let i = 0;

    const typing = setInterval(function () {

        message.innerHTML += text.charAt(i);

        i++;

        if (i >= text.length) {
            clearInterval(typing);
        }

    }, 35);
}
document.addEventListener("DOMContentLoaded", function () {

    const password = document.getElementById("password");

    password.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            login();
        }

    });

});