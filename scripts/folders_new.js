const fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
function showDocuments(selectedFolder) {

    let screenToSave = ""
    let nextScreen = selectedFolder
    if (selectedFolder == "000000") {
        let startFolder = [selectedFolder]
        screenToSave = JSON.stringify(startFolder)
        nextScreen = selectedFolder
    } else {
        let savedScreens = localStorage.getItem("screenList")
        let allScreens = JSON.parse(savedScreens)
        if (allScreens.includes(selectedFolder) == false) { allScreens.push(selectedFolder) }
        screenToSave = JSON.stringify(allScreens)
        nextScreen = allScreens[allScreens.indexOf(selectedFolder) - 1]
    }
    localStorage.setItem("screenList", screenToSave)
    document.getElementById("bArrow").href = "javascript:showDocuments('" + nextScreen + "')"

    let currentScreen = localStorage.getItem(selectedFolder)
    if (currentScreen !== null) {
        let fileListing = JSON.parse(currentScreen)
        document.getElementById("document").innerHTML = ""
        for (let p = 0; p < fileListing.length; p++) {
            let currentFile = document.createElement("span")
            currentFile.innerHTML = fileListing[p]
            document.getElementById("document").appendChild(currentFile)
        }
    } else {
        $.get(fileLocation, function () { })
            .done(function (responseText) {

                let documents = new DOMParser().parseFromString(responseText, "text/html")
                let parentElement = (selectedFolder == "000000") ? documents.querySelector(".clsTree") : documents.getElementById("contents" + selectedFolder).querySelectorAll(":scope > div")[1]
                let documentList = parentElement.querySelectorAll(":scope > div")
                document.getElementById("document").innerHTML = ""
                for (let d = 0; d < documentList.length; d++) {
                    let docRow = document.createElement("span")
                    let docLink = document.createElement("a")
                    let docIcon = document.createElement("i")
                    let remoteDoc = documentList[d].getElementsByTagName("span")[0]
                    let isFolder = remoteDoc.id.startsWith("f")
                    let localDocID = remoteDoc.id.replace("f", "").replace("d", "")
                    if (isFolder == true) {
                        docIcon.className = "fa fa-folder-o formatIcon"
                        docLink.href = "javascript:showDocuments('" + localDocID + "');"
                    } else {
                        docIcon.className = "fa fa-file-pdf-o formatIcon"
                        docLink.href = documents.getElementById("contentsDoc" + localDocID).getElementsByTagName("a")[2].href
                    }
                    docLink.innerHTML = remoteDoc.innerText
                    docRow.appendChild(docIcon)
                    docRow.appendChild(docLink)
                    document.getElementById("document").appendChild(docRow)
                }
                let screenToSave = []
                let currentScreen = document.getElementById("document").getElementsByTagName("span")
                for (let h = 0; h < currentScreen.length; h++) { screenToSave.push(currentScreen[h].innerHTML) }
                let saveFileList = JSON.stringify(screenToSave)
                localStorage.setItem(selectedFolder, saveFileList)
            })
    }
}

$(window).load(function () {
    showDocuments('000000')
})
