function logout() {
    localStorage.removeItem("authToken");
    alert("Sesión cerrada");
    loadPersons(); // Recargar la página o redirigir al login
}