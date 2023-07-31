$(document).ready(function () {
    const sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
    const selGrps = ["8364", "11315"]
    $.get("/homepage/28118/resident-home-page", function () { })
        .done(function (responseText) {
            var profileDoc = new DOMParser().parseFromString(responseText, "text/html")

            const pagePanel = {
                news: profileDoc.getElementById("panel_news_content").getElementsByClassName("news"),
                message: profileDoc.getElementById("panel_messages_content").getElementsByClassName("message"),
                post: profileDoc.getElementById("panel_discuss_content").getElementsByClassName("post"),
                classified: profileDoc.getElementById("panel_classifieds_content").getElementsByClassName("classified"),
                document: profileDoc.getElementById("panel_resource_content").getElementsByClassName("document"),
                event: profileDoc.getElementById("panel_cal_content").getElementsByClassName("event")
            }
            for (const contentKey in pagePanel) {
                const contentText = pagePanel[contentKey]
                for (let p = 0; p < contentText.length; p++) {
                    let displayContent = document.getElementById(contentKey)
                    let displayLink = contentText[p].getElementsByTagName("a")[0]

                    let tRow = document.createElement("tr")
                    let tCell = document.createElement("td")
                    let tLink = document.createElement("a")

                    if (displayContent.id == "document" || displayContent.id == "event") {
                        tLink.href = displayLink.href
                        tLink.innerHTML = displayLink.innerHTML
                        tCell.appendChild(tLink)
                        tRow.appendChild(tCell)
                    } else {
                        if (displayContent.id !== "post" || (displayContent.id == "post" && selGrps.indexOf(displayLink.href.split("~")[1]) > -1)) {
                            let topSpan = document.createElement("span")
                            let btmSpan = document.createElement("span")
                            topSpan.setAttribute("style", "font-weight: bold; display: block;")
                            topSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-title").replace(sentBy, "")))
                            btmSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-text")))

                            tLink.href = displayLink.href
                            tLink.className = "fa fa-external-link formatLink"

                            tCell.appendChild(topSpan)
                            tCell.appendChild(btmSpan)
                            tCell.appendChild(tLink)

                            tRow.appendChild(tCell)
                            displayContent.appendChild(tRow)
                        }
                    }
                    displayContent.appendChild(tRow)
                }
            }
            document.getElementById("overlay").style.display = "none"
            document.getElementById("resDisplayName").innerText = "My Woodbridge"
            document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerHTML = "My Woodbridge"
            let residentName = document.getElementsByClassName("clsHeader")[0]
            let residentNameFrm = profileDoc.getElementsByClassName("clsHeader")[0].innerText
            if (residentNameFrm !== null && residentName !== null) {
                if (residentName.getElementsByTagName("a").length > 0) {
                    residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
                } else {
                    residentName.innerText = residentNameFrm
                }
            }

            showProfile()

        })
        .fail(function () {
            document.getElementById("overlay").style.display = "none"
            if (window.location.hostname == "localhost") {
                document.getElementById("errText").innerHTML = err.message
            } else { location.replace("https://ourwoodbridge.net/homepage/28118/resident-home-page") }
        })
})

function showProfile() {
    try {
        var profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
        $.get("/Member/28118~" + profileID, function () {
        }).done(function (responseText) {
            var profileDoc = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
        })
    }
    catch (err) {
        document.getElementById("errText").innerHTML = err.message
        document.getElementById("overlay").style.display = "none"
    }
}