var loginStatus = document.getElementById("HeaderPublishAuthLogout");
var m_loginStatus = document.getElementById("head-mobile").getElementsByClassName("mobile-menu-word-link");
var returnBtn = document.getElementById("btnReturn");
var editBtn = document.getElementById("btnEditNews");

var status01 = window.setInterval(function () {
    if (loginStatus !== null) {
        window.clearInterval(status01);
        loginStatus.href = "https://ourwoodbridge.net/page/28118~1094081/logging-out"
    };
}, 100)
var status02 = window.setInterval(function () {
    if (m_loginStatus !== null && m_loginStatus.length == 2) {
        window.clearInterval(status02);
        m_loginStatus[1].href = "https://ourwoodbridge.net/page/28118~1094081/logging-out"
    };
}, 100)
var status03 = window.setInterval(function () {
    if (returnBtn !== null) {
        window.clearInterval(status03);
        returnBtn.style.display = "none";
    };
}, 100)
var status04 = window.setInterval(function () {
    if (editBtn !== null) {
        window.clearInterval(status04);
        editBtn.style.display = "none";
    };
}, 100)
