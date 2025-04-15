document.addEventListener("DOMContentLoaded", () => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');

    // Verificar si el token existe
    if (!token) {
        alert('No has iniciado sesión. Serás redirigido al formulario de inicio de sesión.');
        window.location.href = '/views/login/login.html'; // Redirigir al login si no hay token
        return;
    }

    const coursesTableBody = document.querySelector("#coursesTable tbody");
    const courseModal = document.getElementById("courseModal");
    const courseForm = document.getElementById("courseForm");
    const courseNameInput = document.getElementById("courseName");
    const courseIdInput = document.getElementById("courseId");

    // Cargar cursos
    async function loadCourses() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/course", {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            if (!response.ok) throw new Error("Error al obtener cursos");
            const courses = await response.json();
            coursesTableBody.innerHTML = "";
            courses.forEach(course => {
                const row = `
                    <tr>
                        <td>${course.Course_id}</td>
                        <td>${course.Course_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${course.Course_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${course.Course_id}" data-bs-toggle="modal" data-bs-target="#courseModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${course.Course_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                coursesTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowCourse));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditCourse));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteCourse));
        } catch (error) {
            alert("Error al cargar cursos: " + error.message);
        }
    }

    // Abrir modal para agregar un nuevo curso
    document.querySelector('[data-bs-target="#courseModal"]').addEventListener("click", () => {
        document.getElementById("courseModalLabel").textContent = "Agregar Nuevo Curso";
        courseNameInput.value = "";
        courseIdInput.value = "";
    });

    // Guardar curso (agregar o editar)
    courseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseName = courseNameInput.value.trim();
        const courseId = courseIdInput.value;
        const method = courseId ? "PUT" : "POST";
        const url = courseId ? `http://localhost:3000/api_v1/course/${courseId}` : "http://localhost:3000/api_v1/course";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
                body: JSON.stringify({ courseName: courseName })
            });
            if (!response.ok) throw new Error("Error al guardar el curso");
            bootstrap.Modal.getInstance(courseModal).hide();
            loadCourses();
        } catch (error) {
            alert("Error al guardar el curso: " + error.message);
        }
    });

    // Ver detalles de un curso
    async function handleShowCourse(e) {
        const courseId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/course/${courseId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            if (!response.ok) throw new Error("Error al obtener el curso");
            const course = await response.json();
            alert(`Detalles del curso:\nID: ${course.Course_id}\nNombre: ${course.Course_name}`);
        } catch (error) {
            alert("Error al cargar el curso: " + error.message);
        }
    }

    // Editar un curso
    async function handleEditCourse(e) {
        const courseId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/course/${courseId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            if (!response.ok) throw new Error("Error al obtener el curso");
            const course = await response.json();
            document.getElementById("courseModalLabel").textContent = "Editar Curso";
            courseNameInput.value = course.Course_name;
            courseIdInput.value = course.Course_id;
        } catch (error) {
            alert("Error al cargar el curso: " + error.message);
        }
    }

    // Eliminar un curso
    async function handleDeleteCourse(e) {
        const courseId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este curso?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/course/${courseId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            if (!response.ok) throw new Error("Error al eliminar el curso");
            loadCourses();
        } catch (error) {
            alert("Error al eliminar el curso: " + error.message);
        }
    }

    loadCourses();
});