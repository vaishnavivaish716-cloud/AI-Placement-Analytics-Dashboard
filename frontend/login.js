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