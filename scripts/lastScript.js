let waitMessage = document.createElement("div")
let waitSpan = document.createElement("span")
waitSpan.className = "fa fa-spinner fa-pulse fa-5x fa-fw"
waitSpan.style.width = "75%"
waitSpan.style.margin="auto"
waitMessage.style.verticalAlign = "middle"
waitMessage.style.textAlign = "center"
waitMessage.className = "container"

document.getElementsByClassName("clsBodyText")[0].appendChild(waitSpan)
document.getElementsByClassName("clsBodyText")[0].appendChild(waitMessage)

var appWOA = (function () {
    function pageLocation(URLString) {
        return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
    }
    return {
        getProfilePage: function () {
            let pageLinks = document.createElement("div")
            pageLinks.id = "customContainer"
            pageLinks.className = "container"
            $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
                .done(function (responseText) {
                    let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                    let portalClasses = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_gallery_content"]
                    let portalClassNames = ["Recent Announcements", "Recent Emails", "For Sale or Free", "Photo Gallery"]
                    for (let x = 0; x < portalClasses.length; x++) {
                        let portalLinks = portalContent.getElementById(portalClasses[x]).getElementsByTagName("a")
                        if (portalClasses[x] !== "panel_gallery_content") {
                            for (let p = -1; p < portalLinks.length; p++) {
                                if (portalLinks.length > 0) {
                                    let pageLink = document.createElement("a")
                                    let pageText = document.createElement("p")
                                    let pageStamp = document.createElement("span")

                                    pageLink.href = (p >= 0) ? portalLinks[p].href : "/"
                                    pageLink.innerHTML = (p >= 0) ? portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[0] : "<b>" + portalClassNames[x] + "</b>"
                                    if (portalClasses[x] == "panel_messages_content") {
                                        pageStamp.innerText = (p >= 0) ? portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[1] : ""
                                    }
                                    pageText.appendChild(pageLink)
                                    pageText.appendChild(pageStamp)
                                    pageLinks.appendChild(pageText)

                                    if (p === portalLinks.length - 1) {
                                        document.getElementsByClassName("clsBodyText")[0].removeChild(document.getElementsByClassName("clsBodyText")[0].firstChild)
                                        document.getElementsByClassName("clsBodyText")[0].appendChild(pageLinks)
                                    }
                                }
                            }
                        } else {
                            let pageLink = document.createElement("a")
                            let pageText = document.createElement("p")

                            pageLink.href = "/"
                            pageLink.innerHTML = "<b>" + portalClassNames[x] + "</b>"
                            pageText.appendChild(pageLink)
                            pageLinks.appendChild(pageText)

                            for (let p = 0; p < portalLinks.length; p += 2) {
                                let img = document.createElement("img")
                                img.style.marginRight = "20px"
                                img.style.marginTop = "20px"
                                img.style.marginTop = "20px"
                                img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
                                pageLinks.appendChild(img)
                            }
                            document.getElementsByClassName("clsBodyText")[0].appendChild(pageLinks)

                        }
                    }
                })
        },
    }
})()
appWOA.getProfilePage()
