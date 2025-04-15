document.addEventListener("DOMContentLoaded", () => {
    const courseStudentTableBody = document.querySelector("#courseStudentTable tbody");
    const courseStudentModal = document.getElementById("courseStudentModal");
    const courseStudentForm = document.getElementById("courseStudentForm");
    const courseFkInput = document.getElementById("courseFk");
    const studentFkInput = document.getElementById("studentFk");
    const courseNameInput = document.getElementById("courseName");
    const courseStudentIdInput = document.getElementById("courseStudentId");

    // Cargar asignaciones de curso-estudiante
    async function loadCourseStudents() {
        try {
            const response = await axios.get("http://localhost:3000/api_v1/courseStudentName");
            courseStudentTableBody.innerHTML = "";
            response.data.forEach(cs => {
                const row = `
                    <tr>
                        <td>${cs.Course_student_name_id}</td>
                        <td>${cs.Course_fk}</td>
                        <td>${cs.Student_fk}</td>
                        <td>${cs.Name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${cs.Course_student_name_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${cs.Course_student_name_id}" data-bs-toggle="modal" data-bs-target="#courseStudentModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${cs.Course_student_name_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                courseStudentTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowCourseStudent));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditCourseStudent));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteCourseStudent));
        } catch (error) {
            alert("Error al cargar asignaciones: " + error.message);
        }
    }

    // Abrir modal para agregar una nueva asignación
    document.querySelector('[data-bs-target="#courseStudentModal"]').addEventListener("click", () => {
        document.getElementById("courseStudentModalLabel").textContent = "Agregar Nueva Asignación";
        courseFkInput.value = "";
        studentFkInput.value = "";
        courseNameInput.value = "";
        courseStudentIdInput.value = "";
    });

    // Guardar asignación (agregar o editar)
    courseStudentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseFk = courseFkInput.value.trim();
        const studentFk = studentFkInput.value.trim();
        const courseName = courseNameInput.value.trim();
        const courseStudentId = courseStudentIdInput.value;
        const method = courseStudentId ? "put" : "post";
        const url = courseStudentId 
            ? `http://localhost:3000/api_v1/courseStudentName/${courseStudentId}` 
            : "http://localhost:3000/api_v1/courseStudentName";

        try {
            await axios[method](url, { courseFk, studentFk, courseName });
            bootstrap.Modal.getInstance(courseStudentModal).hide();
            loadCourseStudents();
        } catch (error) {
            alert("Error al guardar la asignación: " + error.message);
        }
    });

    // Ver detalles de una asignación
    async function handleShowCourseStudent(e) {
        const courseStudentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/courseStudentName/${courseStudentId}`);
            const cs = response.data;
            alert(`Detalles de la asignación:\nID: ${cs.Course_student_name_id}\nCurso ID: ${cs.Course_fk}\nEstudiante ID: ${cs.Student_fk}\nNombre: ${cs.Name}`);
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Editar una asignación
    async function handleEditCourseStudent(e) {
        const courseStudentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/courseStudentName/${courseStudentId}`);
            const cs = response.data;
            document.getElementById("courseStudentModalLabel").textContent = "Editar Asignación";
            courseFkInput.value = cs.Course_fk;
            studentFkInput.value = cs.Student_fk;
            courseNameInput.value = cs.Name;
            courseStudentIdInput.value = cs.Course_student_name_id;
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Eliminar una asignación
    async function handleDeleteCourseStudent(e) {
        const courseStudentId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta asignación?")) return;

        try {
            await axios.delete(`http://localhost:3000/api_v1/courseStudentName/${courseStudentId}`);
            loadCourseStudents();
        } catch (error) {
            alert("Error al eliminar la asignación: " + error.message);
        }
    }

    loadCourseStudents();
});