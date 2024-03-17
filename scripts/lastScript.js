var appWOA = (function () {
    function pageLocation(URLString) {
        return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
    }
    return {
        getRecentEmails: function () {
            $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
                .done(function (responseText) {
                    let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                    let portalClasses = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_gallery_content"]
                    let portalClassNames = ["Recent Announcements", "Recent Emails", "For Sale or Free", "Photo Gallery"]


                    for (let x = 0; x < portalClasses.length; x++) {
                        let portalLinks = portalContent.getElementById(portalClasses[x]).getElementsByTagName("a")
                        let pageLinks = document.createElement("div")
                        pageLinks.id = "customContainer"
                        pageLinks.className = "container"
                        for (let p = -1; p < portalLinks.length; p++) {
                            if (portalLinks.length > 0) {
                                let pageLink = document.createElement("a")
                                let pageText = document.createElement("p")
                                let pageStamp = document.createElement("span")

                                if (portalClasses[x] !== "panel_gallery_content") {
                                    pageLink.href = (p >= 0) ? portalLinks[p].href : "/"
                                    pageLink.innerHTML = (p >= 0) ? portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[0] : "<b>" + portalClassNames[x] + "</b>"
                                    if (portalClasses[x] == "panel_messages_content") {
                                        pageStamp.innerText = (p >= 0) ? portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[1] : ""
                                    } else { pageStamp.innerText = " " }
                                } else {
                                    if (p % 2 == 0 || p == -1) {
                                        pageLink.href = (p >= 0) ? "/" : "/"
                                        pageLink.innerHTML = (p >= 0) ? "test" : "<b>" + portalClassNames[x] + "</b>"
                                        pageStamp.innerText = (p >= 0) ? " " : " "
                                    }
                                }
                                if (pageStamp.innerText.length>0) { 
                                pageText.appendChild(pageLink)
                                pageText.appendChild(pageStamp)
                                pageLinks.appendChild(pageText)}

                                if (p === portalLinks.length - 1) { document.getElementsByClassName("clsBodyText")[0].appendChild(pageLinks) }
                            }
                        }
                    }
                })
        },
    }
})()
appWOA.getRecentEmails()
