const isLocal = (window.location.hostname == "localhost") ? ".html" : ""

let appContainer = document.createElement("div"); appContainer.id = "customContainer", appContainer.className = "container"
let pageDocuments = document.createElement("div"); pageDocuments.id = "document"
appContainer.appendChild(pageDocuments)
document.getElementsByClassName("clsBodyText")[0].appendChild(appContainer)
function showDocuments(selectedFolder, previousFolder, PreviousFolderName) {
    let pageFileList = document.getElementById("document")
    $.get("/resourcecenter/28118/resource-center" + isLocal, function () { })
        .done(function (responseText) {
            while (pageFileList.firstChild) { pageFileList.removeChild(pageFileList.firstChild) }
            let documents = new DOMParser().parseFromString(responseText, "text/html")

            if (previousFolder == "") {
                let newsLetterName = documents.getElementById("contents" + selectedFolder).querySelectorAll("[id^=d]")
                let fileFolderID = newsLetterName[newsLetterName.length - 1].parentElement.parentElement.parentElement.parentElement
                let subFolder = fileFolderID.id.replace("contents", "").replace("contentInner", "000000")
                let parentFolder = fileFolderID.parentElement.parentElement.parentElement.id.replace("contents", "").replace("contentInner", "000000")
                let subFolderName = fileFolderID.parentElement.getElementsByTagName("span")[0].innerText
                selectedFolder=subFolder
                previousFolder = parentFolder
                PreviousFolderName = subFolderName
            }


            let parentElement = (selectedFolder == "000000") ? documents.querySelector(".clsTree") : documents.getElementById("contents" + selectedFolder).querySelectorAll(":scope > div")[1]
            let documentList = parentElement.querySelectorAll(":scope > div")
            if (selectedFolder !== "000000") {
                let docRow = document.createElement("span")
                let docLink = document.createElement("a")
                let docIcon1 = document.createElement("i")

                docIcon1.className = "fa fa-folder-open-o formatIcon"
                docLink.href = "javascript:showDocuments('" + previousFolder + "')"

                docLink.innerHTML = PreviousFolderName
                docRow.appendChild(docIcon1)
                docRow.appendChild(docLink)
                pageFileList.appendChild(docRow)
            }
            for (let d = 0; d < documentList.length; d++) {
                let docRow = document.createElement("span")
                let docLink = document.createElement("a")
                let docIcon = document.createElement("i")
                let remoteDoc = documentList[d].getElementsByTagName("span")[0]
                let isFolder = remoteDoc.id.startsWith("f")
                let localDocID = remoteDoc.id.replace("f", "").replace("d", "")
                if (isFolder == true) {
                    docIcon.className = "fa fa-folder-o formatIcon"
                    docLink.href = "javascript:showDocuments('" + localDocID + "','" + selectedFolder + "','" + remoteDoc.innerText + "');"
                } else {
                    docIcon.className = "fa fa-file-pdf-o formatIcon"
                    docLink.href = documents.getElementById("contentsDoc" + localDocID).getElementsByTagName("a")[2].href
                }
                docLink.innerHTML = remoteDoc.innerText
                docRow.appendChild(docIcon)
                docRow.appendChild(docLink)
                pageFileList.appendChild(docRow)
            }
            let screenToSave = []
            let currentScreen = pageFileList.getElementsByTagName("span")
            for (let h = 0; h < currentScreen.length; h++) { screenToSave.push(currentScreen[h].innerHTML) }
            let saveFileList = JSON.stringify(screenToSave)
            localStorage.setItem(selectedFolder, saveFileList)
        })
}

function screenSort(sortDirection) {
    let screens = pageFileList.getElementsByTagName("span")
    let sortScreens = []
    for (let s = 1; s < screens.length; s++) {
        sortScreens.push(screens[s].innerHTML)
    }
    sortScreens.sort()
    if (sortDirection == "U") { sortScreens.reverse() }
    for (let s = 0; s < sortScreens.length; s++) {
        screens[s + 1].innerHTML = sortScreens[s]
    }
}
function getProfile() {
    let filePage = (window.location.hostname == "localhost") ? "28118~1105440.html" : "/page/28118~1105440"
    let homePage = (window.location.hostname == "localhost") ? "/woa_dashboard.html" : "/page/28118~1101528/resident-home-beta"
    let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
    let classArray = ["fa fa fa-home fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "fa fa-comment fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
    let hrefArray = [homePage, filePage, "/form/28118~327323/social-media-help", "", "/form/28118~116540/ask-a-manager"]
    let textArray = ["", "My Documents", "", "", ""]

    for (let a = 0; a <= 4; a++) {
        let headerLinks = document.getElementById("profileHeader").getElementsByTagName("a")
        headerLinks[a].innerHTML = textArray[a]
        headerLinks[a].href = hrefArray[a]
        headerLinks[a].className = classArray[a]
    }

    let profileImage = document.createElement("img")
    let imageFile = $.get("/Member/28118~" + profileID[0] + isLocal, function () { })
    let textFile = $.get("/news/28118~792554" + isLocal, function () { })
    $.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
        let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
        let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
        let userText = document.createElement("span")
        profileImage.src = imageFile.getElementsByTagName("img")[0].src
        userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        document.getElementById("profileBody").appendChild(profileImage)
        document.getElementById("profileBody").appendChild(userText)
    })
}
function addCard(hdrId, bdyId, crdIcon, crdText, useCollapse, fnName) {

    let rowDiv = document.createElement("div")
    let colDiv = document.createElement("div")
    let crdDiv = document.createElement("div")
    let hdrDiv = document.createElement("div")
    let bdyDiv = document.createElement("div")

    if (hdrId === "profileHeader") {
        for (let a = 1; a <= 5; a++) {
            let headerLinks = document.createElement("a")
            hdrDiv.appendChild(headerLinks)
        }
    } else {
        let cardIcon = document.createElement("span")
        let cardText = document.createElement("span")
        cardIcon.className = crdIcon
        cardText.innerText = crdText
        hdrDiv.appendChild(cardIcon)
        hdrDiv.appendChild(cardText)
    }
    crdDiv.appendChild(hdrDiv)
    crdDiv.appendChild(bdyDiv)
    colDiv.appendChild(crdDiv)
    rowDiv.appendChild(colDiv)
    rowDiv.className = "row"
    colDiv.className = "col-md-12"
    crdDiv.className = "card mb-1"
    hdrDiv.className = "card-header"
    bdyDiv.className = "card-body"
    hdrDiv.id = hdrId, bdyDiv.id = bdyId
    if (useCollapse == true) {
        hdrDiv.classList.add("collapsed")
        hdrDiv.setAttribute("data-toggle", "collapse")
        hdrDiv.setAttribute("data-target", "#" + bdyDiv.id)
        hdrDiv.setAttribute("aria-expanded", "false")
        bdyDiv.classList.add("collapse")
        bdyDiv.setAttribute("data-parent", "#customContainer")
    }

    document.getElementById("customContainer").insertBefore(rowDiv, document.getElementById("document"))

    if (fnName !== "") { fnName() }

}
function getPortalDocuments(docID) {

    if (docID === "") { docID = "contentInner" }
    $.get("/resourcecenter/28118/resource-center" + isLocal, function () { })
        .done(function (responseText) {
            while (pageDocuments.firstChild) { pageDocuments.removeChild(pageDocuments.firstChild) }
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            let allDocuments = documents.getElementById(docID).getElementsByClassName("clsTreeNde")
            if (docID !== "contentInner") {
                let folderIcon = document.createElement("i")
                let folderLink = document.createElement("a")
                let lastFolder = document.createElement("span")
                folderLink.href = "javascript:getPortalDocuments('" + documents.getElementById(docID).parentElement.parentElement.parentElement.id + "')"
                folderLink.innerHTML = documents.getElementById(docID.replace("contents", "f")).innerText
                folderIcon.className = "fa fa-folder-open-o fa-lg"
                folderIcon.style.marginRight = "10px"
                lastFolder.appendChild(folderIcon)
                lastFolder.appendChild(folderLink)
                pageDocuments.appendChild(lastFolder)
            }
            for (let d = 0; d < allDocuments.length; d++) {
                let parentFolderID = allDocuments[d].parentElement.parentElement.parentElement.parentElement.id
                if (parentFolderID !== "contents465149" && parentFolderID == docID) {
                    let pageIcon = document.createElement("i")
                    let pageLink = document.createElement("a")
                    let pageDocument = document.createElement("span")
                    pageIcon.style.marginRight = "10px"
                    pageLink.innerHTML = allDocuments[d].innerHTML
                    if (allDocuments[d].id.charAt(0) == "f") {
                        pageIcon.className = "fa fa-folder-o fa-lg"
                        pageLink.href = "javascript:getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "')"
                    } else {
                        pageIcon.className = "fa fa-file-o fa-lg"
                        pageLink.href = documents.getElementById(allDocuments[d].id.replace("d","contentsDoc")).getElementsByTagName("a")[2].href
                    }
                    pageDocument.appendChild(pageIcon)
                    pageDocument.appendChild(pageLink)
                    pageDocuments.appendChild(pageDocument)
                }
            }
        })
}
$(window).load(function () {
    addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "My Documents", false, getProfile)
    //const queryString = window.location.search
    //const urlParams = new URLSearchParams(queryString)
    //if (urlParams.get("ff") !== null) { showDocuments(urlParams.get("ff"),"","") } else { showDocuments('000000', '000000') }
    getPortalDocuments("")


})
