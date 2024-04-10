const woaContainer = document.createElement("div")
const isLocal = (window.location.hostname == "localhost") ? ".html" : ""
const urlParams = new URLSearchParams(window.location.search)
woaContainer.id = "customContainer", woaContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(woaContainer)

const woaDocs = {
    addHTML: (start, end) => {

        let divIDs = ["recentFiles", "recentEmails", "recentPosts", "officeContacts", "documents"]
        let divTitles = ["Recent Documents", "Recent Association Emails", "Recent Comments", "Clubhouse Office Contacts", "My Documents"]


        let woaHeaderRow = document.createElement("div")
        let woaHeaderGreeting = document.createElement("div")

        let woaHeaderTxt = document.createElement("span")
        let woaHeaderImg = document.createElement("img")

        woaHeaderRow.id = "woaHeaderRow"
        woaHeaderGreeting.className = "notifyHeader"
        woaHeaderGreeting.paddingBottom = "50px"

        woaHeaderRow.appendChild(woaHeaderGreeting)
        if (end < 3) { woaHeaderRow.appendChild(woaHeaderImg) }
        woaHeaderRow.appendChild(woaHeaderTxt)
        woaContainer.appendChild(woaHeaderRow)


        for (let p = start; p <= end; p++) {
            let notificationDiv = document.createElement("div")
            //let notificationHdr = document.createElement("span")

            notificationDiv.id = divIDs[p]
            //notificationHdr.className = "notifyHeader"
            //notificationHdr.innerText = divTitles[p]
            //notificationDiv.appendChild(notificationHdr)
            woaContainer.appendChild(notificationDiv)
        }



    },
    getDocumentHdr: () => {
        let textFile = $.get("/news/28118~799897" + isLocal, function () { })
        $.when(textFile).done(function (responseTXT) {
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            document.getElementById("woaHeaderRow").getElementsByTagName("div")[0].innerText = "My Documents"
            document.getElementById("woaHeaderRow").getElementsByTagName("span")[0].innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        })

    },
    getPortalDocuments: (docID, getLatest) => {



        let docArray = []
        let pageDocuments = document.getElementById("documents")
        let waitSpan = document.createElement("i")
        waitSpan.className = "fa fa-refresh fa-fw fa-spin fa-4x waitClass"


        while (pageDocuments.firstChild) { pageDocuments.removeChild(pageDocuments.firstChild) }
        pageDocuments.appendChild(waitSpan)

        if (docID === "") { docID = "contentInner" }
        $.get("/resourcecenter/28118/resource-center" + isLocal, function () { })
            .done(function (responseText) {
                waitSpan.remove()
                let documents = new DOMParser().parseFromString(responseText, "text/html")

                if (getLatest == true) {
                    let selectedDocs = documents.getElementById(docID).getElementsByTagName("span")
                    for (let d = 0; d < selectedDocs.length; d++) {
                        if (selectedDocs[d].id.charAt(0) == "d") {
                            docArray.push(selectedDocs[d].id)
                        }
                    }
                    docArray.sort()
                    docID = documents.getElementById(docArray[docArray.length - 1]).parentElement.parentElement.parentElement.parentElement.id
                }
                let allDocuments = documents.getElementById(docID).getElementsByClassName("clsTreeNde")
                if (docID !== "contentInner") {
                    let folderIcon = document.createElement("i")
                    let folderLink = document.createElement("a")
                    let lastFolder = document.createElement("span")
                    folderLink.href = "javascript:woaDocs.getPortalDocuments('" + documents.getElementById(docID).parentElement.parentElement.parentElement.id + "',false)"
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
                        pageIcon.id = allDocuments[d].id
                        pageLink.innerHTML = allDocuments[d].innerHTML
                        if (allDocuments[d].id.charAt(0) == "f") {
                            pageIcon.className = "fa fa-folder-o fa-lg"
                            pageLink.href = "javascript:woaDocs.getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "',false)"
                        } else {
                            pageIcon.className = "fa fa-file-o fa-lg"
                            pageLink.href = documents.getElementById(allDocuments[d].id.replace("d", "contentsDoc")).getElementsByTagName("a")[2].href
                        }
                        pageDocument.appendChild(pageIcon)
                        pageDocument.appendChild(pageLink)
                        pageDocuments.appendChild(pageDocument)
                        if (d == allDocuments.length - 1) {
                            woaDocs.screenSort()
                        }
                    }
                }
            })
    },
    screenSort: () => {

        let startNumber = (document.getElementById("documents").getElementsByTagName("i")[0].className == "fa fa-folder-o fa-lg") ? 0 : 1
        let screens = document.getElementById("documents").getElementsByTagName("span")
        let sortScreens = []
        for (let s = startNumber; s < screens.length; s++) {
            sortScreens.push(screens[s].innerHTML)
        }
        sortScreens.sort(function (a, b) { return a - b })

        if (document.getElementById("documents").getElementsByTagName("a")[0].innerText !== "Flyers (Events or Activities)") { sortScreens.reverse() }

        for (let s = 0; s < sortScreens.length; s++) {
            screens[s + startNumber].innerHTML = sortScreens[s]
        }
    },
}

woaDocs.addHTML(4, 4)
woaDocs.getDocumentHdr()
if (urlParams.get("ff") !== null) {
    woaDocs.getPortalDocuments(urlParams.get("ff"), true)
} else { woaDocs.getPortalDocuments("", false) }
