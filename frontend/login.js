function login() {

    let userType = document.getElementById("userType").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    // ADMIN LOGIN
    if (
        userType === "admin" &&
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem("login", "true");
        localStorage.setItem("role", "admin");
        localStorage.setItem("username", username);

        // Admin → Admin Dashboard
        window.location.href = "admin.html";

    }


    // STUDENT LOGIN
    else if (
        userType === "student" &&
        username === "student" &&
        password === "student123"
    ) {

        localStorage.setItem("login", "true");
        localStorage.setItem("role", "student");

        localStorage.setItem(
            "studentUsername",
            "Ice"
        );

        // Student → Student Dashboard
        window.location.href = "student.html";

    }


    // INVALID LOGIN
    else {

        document.getElementById("error").innerHTML =
            "Invalid Username or Password";

    }

}


// SHOW / HIDE PASSWORD

function togglePassword() {

    const password =
        document.getElementById("password");

    const eye =
        document.querySelector(".eye-btn");


    if (password.type === "password") {

        password.type = "text";

        eye.textContent = "🙈";

    } else {

        password.type = "password";

        eye.textContent = "👁️";

    }

}


// ROBOT GREETING

function updateRobotGreeting() {

    const userType =
        document.getElementById("userType").value;

    const message =
        document.getElementById("robotMessage");


    if (userType === "admin") {

        message.innerHTML =
            "👨‍💼 Welcome Placement Officer!";

    } else {

        message.innerHTML =
            "🎓 Welcome Student! Ready for placements?";

    }

}


// ROBOT TYPING MESSAGE

function typeRobotMessage(text) {

    const message =
        document.getElementById("robotMessage");

    message.innerHTML = "";

    let i = 0;


    const typing =
        setInterval(function () {

            message.innerHTML +=
                text.charAt(i);

            i++;


            if (i >= text.length) {

                clearInterval(typing);

            }

        }, 35);

}


// ENTER KEY LOGIN

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const password =
            document.getElementById("password");


        password.addEventListener(
            "keypress",
            function (event) {

                if (event.key === "Enter") {

                    login();

                }

            }
        );

    }
);