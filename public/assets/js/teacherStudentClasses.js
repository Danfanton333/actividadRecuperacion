document.addEventListener("DOMContentLoaded", () => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');

    // Verificar si el token existe
    if (!token) {
        alert('No has iniciado sesión. Serás redirigido al formulario de inicio de sesión.');
        window.location.href = '/views/login/login.html'; // Redirigir al login si no hay token
        return;
    }

    const teacherStudentTableBody = document.querySelector("#teacherStudentTable tbody");
    const teacherStudentModal = document.getElementById("teacherStudentModal");
    const teacherStudentForm = document.getElementById("teacherStudentForm");
    const teacherFkInput = document.getElementById("teacherFk");
    const studentFkInput = document.getElementById("studentFk");
    const classesInput = document.getElementById("classes");
    const teacherStudentIdInput = document.getElementById("teacherStudentId");

    // Cargar asignaciones de profesor-estudiante
    async function loadTeacherStudents() {
        try {
            const response = await axios.get("http://localhost:3000/api_v1/teacherStudentClasses", {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            teacherStudentTableBody.innerHTML = "";
            response.data.forEach(ts => {
                const row = `
                    <tr>
                        <td>${ts.Teacher_student_classes_id}</td>
                        <td>${ts.Teacher_fk}</td>
                        <td>${ts.Student_fk}</td>
                        <td>${ts.Classes}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${ts.Teacher_student_classes_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${ts.Teacher_student_classes_id}" data-bs-toggle="modal" data-bs-target="#teacherStudentModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${ts.Teacher_student_classes_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                teacherStudentTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowTeacherStudent));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditTeacherStudent));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteTeacherStudent));
        } catch (error) {
            alert("Error al cargar asignaciones: " + error.message);
        }
    }

    // Abrir modal para agregar una nueva asignación
    document.querySelector('[data-bs-target="#teacherStudentModal"]').addEventListener("click", () => {
        document.getElementById("teacherStudentModalLabel").textContent = "Agregar Nueva Asignación";
        teacherFkInput.value = "";
        studentFkInput.value = "";
        classesInput.value = "";
        teacherStudentIdInput.value = "";
    });

    // Guardar asignación (agregar o editar)
    teacherStudentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const teacherFk = teacherFkInput.value.trim();
        const studentFk = studentFkInput.value.trim();
        const classes = classesInput.value.trim();
        const teacherStudentId = teacherStudentIdInput.value;
        const method = teacherStudentId ? "put" : "post";
        const url = teacherStudentId 
            ? `http://localhost:3000/api_v1/teacherStudentClasses/${teacherStudentId}` 
            : "http://localhost:3000/api_v1/teacherStudentClasses";

        try {
            await axios[method](url, { teacherFk, studentFk, classes }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            bootstrap.Modal.getInstance(teacherStudentModal).hide();
            loadTeacherStudents();
        } catch (error) {
            alert("Error al guardar la asignación: " + error.message);
        }
    });

    // Ver detalles de una asignación
    async function handleShowTeacherStudent(e) {
        const teacherStudentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/teacherStudentClasses/${teacherStudentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            const ts = response.data;
            alert(`Detalles de la asignación:\nID: ${ts.Teacher_student_classes_id}\nProfesor ID: ${ts.Teacher_fk}\nEstudiante ID: ${ts.Student_fk}\nClases: ${ts.Classes}`);
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Editar una asignación
    async function handleEditTeacherStudent(e) {
        const teacherStudentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/teacherStudentClasses/${teacherStudentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            const ts = response.data;
            document.getElementById("teacherStudentModalLabel").textContent = "Editar Asignación";
            teacherFkInput.value = ts.Teacher_fk;
            studentFkInput.value = ts.Student_fk;
            classesInput.value = ts.Classes;
            teacherStudentIdInput.value = ts.Teacher_student_classes_id;
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Eliminar una asignación
    async function handleDeleteTeacherStudent(e) {
        const teacherStudentId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta asignación?")) return;

        try {
            await axios.delete(`http://localhost:3000/api_v1/teacherStudentClasses/${teacherStudentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
                },
            });
            loadTeacherStudents();
        } catch (error) {
            alert("Error al eliminar la asignación: " + error.message);
        }
    }

    loadTeacherStudents();
});