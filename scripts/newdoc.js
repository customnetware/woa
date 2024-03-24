const isLocal = (window.location.hostname == "localhost") ? ".html" : ""
function getPortalDocuments(docID) {
    let pageDocuments = document.getElementById("pageLinks")
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

                    pageIcon.className = "fa fa-folder-o fa-lg"
                    pageIcon.style.marginRight = "10px"
                    pageLink.innerHTML = allDocuments[d].innerHTML
                    if (allDocuments[d].id.charAt(0) == "f") {
                        pageLink.href = "javascript:getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "')"
                    } else { pageIcon.className = "fa fa-file-o fa-lg" }
                    pageDocument.appendChild(pageIcon)
                    pageDocument.appendChild(pageLink)
                    pageDocuments.appendChild(pageDocument)
                
            }}
        })
}
$(window).load(function () {
    getPortalDocuments('')


})