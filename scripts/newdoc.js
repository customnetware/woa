function getPortalDocuments(docID) {
    let pageDocuments = document.getElementById("pageLinks")
    if (docID === "") { docID = "contentInner" }
    $.get("/resourcecenter/28118/resource-center.html", function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            while (pageDocuments.firstChild) { pageDocuments.removeChild(pageDocuments.firstChild) }
            let allDocuments = documents.getElementsByClassName("clsTreeNde")
            if (docID !== "contentInner") {
                let testDiv = document.createElement("div")
                let testA = document.createElement("a")
                testA.href = "javascript:getPortalDocuments('" + documents.getElementById(docID).parentElement.parentElement.parentElement.id + "')"
                testA.innerHTML = documents.getElementById(docID.replace("contents", "f")).innerText


                let testSpan = document.createElement("span")
                let stackSpan = document.createElement("span")

                stackSpan.className = "fa fa-folder-open-o fa-lg"
                stackSpan.style.marginRight = "10px"



                testSpan.innerText = " " + documents.getElementById(docID.replace("contents", "f")).innerText
                testDiv.appendChild(stackSpan)
                testDiv.appendChild(testA)

                pageDocuments.appendChild(testDiv)
            }


            for (let d = 0; d < allDocuments.length; d++) {
                let parentFolderID = allDocuments[d].parentElement.parentElement.parentElement.parentElement.id
                if (parentFolderID !== "contents465149" && parentFolderID == docID) {
                    let pageDocument = document.createElement("div")
                    let pageSpan = document.createElement("span")
                    let pageAnchor = document.createElement("a")

                    pageSpan.className = "fa fa-folder-o fa-lg"
                    pageSpan.style.marginRight = "10px"
                    pageAnchor.innerHTML = allDocuments[d].innerHTML
                    if (allDocuments[d].id.charAt(0) == "f") {
                        pageAnchor.href = "javascript:getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "')"
                    } else { pageSpan.className = "fa fa-file-o fa-lg" }


                    pageDocument.appendChild(pageSpan)
                    pageDocument.appendChild(pageAnchor)
                    pageDocuments.appendChild(pageDocument)


                }
            }
        })
}
$(window).load(function () {
    getPortalDocuments('')


})