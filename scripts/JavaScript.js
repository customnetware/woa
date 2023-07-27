const selGrps = "GeneralTest_Group"
const contentID = "post"
let contentCheck = function () {
    if (contentID == "post") {
        return woaFrame.contentWindow.document.getElementById(contentID[0]).getElementsByClassName("discussion")[0].getElementsByTagName("a")[0].innerHTML
    } else { return null }
}