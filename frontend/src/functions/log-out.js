function logOut() {
    localStorage.removeItem("status_name")
    localStorage.removeItem("ac")
    localStorage.removeItem("re");
    window.location.replace('/login')
}

export default logOut