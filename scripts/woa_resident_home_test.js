$(document).ready(function () {
    const residentName = document.getElementsByClassName("clsHeader")[0]
    const sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
    const residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    const selGrps = ["8364", "11315"]

    $.get(residentPage, function () { })
        .done(function (responseText) {
            let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
            let windowDoc = document.getElementById("fromWOA").getElementsByClassName("card-body")
            let residentNameFrm = profileDoc.getElementsByClassName("clsHeader")[0].innerText

            for (let p = 0; p < windowDoc.length; p++) {
                let clientDoc = windowDoc[p].getElementsByTagName("div")[0]
                let currentDoc = profileDoc.getElementById(clientDoc.className).getElementsByClassName(clientDoc.id)
                for (let i = 0; i < currentDoc.length; i++) {
                    let selectedDoc = currentDoc[i].getElementsByTagName("a")[0]
                    let topSpan = document.createElement("span")
                    let btmSpan = document.createElement("span")
                    let spanLink = document.createElement("a")
                    if (currentDoc[i].className == "document" || currentDoc[i].className == "event") {
                        spanLink.href = selectedDoc.href
                        spanLink.innerHTML = selectedDoc.innerHTML
                        topSpan.className = (i % 2 == 0) ? "btmEven" : "btmOdd"
                        topSpan.appendChild(spanLink)
                    } else if (currentDoc[i].className !== "post" || (currentDoc[i].className == "post" && selGrps.indexOf(selectedDoc.href.split("~")[1]) > -1)) {
                        topSpan.className = (i % 2 == 0) ? "topEven" : "topOdd"
                        btmSpan.className = (i % 2 == 0) ? "btmEven" : "btmOdd"
                        topSpan.appendChild(document.createTextNode(selectedDoc.getAttribute("data-tooltip-title").replace(sentBy, "")))
                        btmSpan.appendChild(document.createTextNode(selectedDoc.getAttribute("data-tooltip-text")))
                        spanLink.href = selectedDoc.href
                        spanLink.className = "fa fa-external-link formatLink"
                        btmSpan.appendChild(spanLink)
                    }
                    clientDoc.appendChild(topSpan)
                    clientDoc.appendChild(btmSpan)
                }
            }
            document.getElementById("overlay").style.display = "none"
            if (residentNameFrm !== null && residentName !== null) {
                if (residentName.getElementsByTagName("a").length > 0) {
                    residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
                } else {
                    residentName.innerText = residentNameFrm
                }
            }
        }); showProfile()

})
function showProfile() {
    try {

        document.getElementById("resDisplayName").innerText = "My Woodbridge"
        document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerHTML = "My Woodbridge"
        var profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
        var profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID

        $.get(profilePage, function () {
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
function saveUser(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) !== saveValue) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}