var appWOA = (function () {
    function pageLocation(URLString) {
        return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
    }
    return {
        getRecentEmails: function () {
            $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
                .done(function (responseText) {
                    let profileContent = new DOMParser().parseFromString(responseText, "text/html")
                    let emailLinks = profileContent.getElementById("panel_messages_content").getElementsByTagName("a")
                    let pageLinks = document.createElement("div")
                    pageLinks.id = "customContainer"
                    pageLinks.className = "container"
                    for (let p = -1; p < emailLinks.length; p++) {

                        let emailLink = document.createElement("a")
                        let currentEmail = document.createElement("p")
                        let emailSent = document.createElement("span")

                        emailLink.href = (p >= 0) ? emailLinks[p].href : "/"
                        emailLink.innerHTML = (p >= 0) ? emailLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[0] : "<b>Recent Emails</b>"
                        emailSent.innerText = (p >= 0) ? emailLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[1] : ""

                        currentEmail.appendChild(emailLink)
                        currentEmail.appendChild(emailSent)
                        pageLinks.appendChild(currentEmail)


                        if (p === emailLinks.length - 1) { document.getElementsByClassName("clsBodyText")[0].appendChild(pageLinks) }
                    }
                })
        },
    }
})()
appWOA.getRecentEmails()
