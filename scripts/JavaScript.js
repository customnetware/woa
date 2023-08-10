function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}
var test = getUser("profileID")
alert(test)