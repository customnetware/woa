const fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
function showDocuments(selectedFolder, previousFolder, PreviousFolderName) {
    let currentScreen = localStorage.getItem(selectedFolder)
    if (currentScreen !== null) {
        let fileListing = JSON.parse(currentScreen)
    
        while (document.getElementById("document").firstChild) { document.getElementById("document").removeChild(document.getElementById("document").firstChild) }
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


                if (selectedFolder !== "000000") {
                    while (document.getElementById("document").firstChild) { document.getElementById("document").removeChild(document.getElementById("document").firstChild) }
                    let docRow = document.createElement("span")
                    let docLink = document.createElement("a")
                    let docIcon1 = document.createElement("i")

                    docIcon1.className = "fa fa-folder-open-o formatIcon"
                    docLink.href = "javascript:showDocuments('" + previousFolder + "')"

                    docLink.innerHTML = PreviousFolderName
                    docRow.appendChild(docIcon1)
                    docRow.appendChild(docLink)
                    document.getElementById("document").appendChild(docRow)
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
                        while (document.getElementById("document").firstChild) { document.getElementById("document").removeChild(document.getElementById("document").firstChild) }
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
function screenSort(sortDirection) {
    let screens = document.getElementById("document").getElementsByTagName("span")
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
$(window).load(function () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    if (urlParams.get("ff") == "1") {
        showDocuments('951754', '000000', 'Woodbridge Newsletters')
    } else { showDocuments('000000', '000000') }

    /* showDocuments('951754', '000000', 'Woodbridge Newsletters')*/

})
