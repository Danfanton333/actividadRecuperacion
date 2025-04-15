document.addEventListener("DOMContentLoaded", () => {
    const courseTeacherTableBody = document.querySelector("#courseTeacherTable tbody");
    const courseTeacherModal = document.getElementById("courseTeacherModal");
    const courseTeacherForm = document.getElementById("courseTeacherForm");
    const courseFkInput = document.getElementById("courseFk");
    const teacherFkInput = document.getElementById("teacherFk");
    const hoursInput = document.getElementById("hours");
    const courseTeacherIdInput = document.getElementById("courseTeacherId");

    // Cargar asignaciones de curso-profesor
    async function loadCourseTeachers() {
        try {
            const response = await axios.get("http://localhost:3000/api_v1/courseTeacherHours");
            courseTeacherTableBody.innerHTML = "";
            response.data.forEach(ct => {
                const row = `
                    <tr>
                        <td>${ct.Course_teacher_hours_id}</td>
                        <td>${ct.Course_fk}</td>
                        <td>${ct.Teacher_fk}</td>
                        <td>${ct.Hours}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${ct.Course_teacher_hours_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${ct.Course_teacher_hours_id}" data-bs-toggle="modal" data-bs-target="#courseTeacherModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${ct.Course_teacher_hours_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                courseTeacherTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowCourseTeacher));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditCourseTeacher));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteCourseTeacher));
        } catch (error) {
            alert("Error al cargar asignaciones: " + error.message);
        }
    }

    // Abrir modal para agregar una nueva asignación
    document.querySelector('[data-bs-target="#courseTeacherModal"]').addEventListener("click", () => {
        document.getElementById("courseTeacherModalLabel").textContent = "Agregar Nueva Asignación";
        courseFkInput.value = "";
        teacherFkInput.value = "";
        hoursInput.value = "";
        courseTeacherIdInput.value = "";
    });

    // Guardar asignación (agregar o editar)
    courseTeacherForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseFk = courseFkInput.value.trim();
        const teacherFk = teacherFkInput.value.trim();
        const hours = hoursInput.value.trim();
        const courseTeacherId = courseTeacherIdInput.value;
        const method = courseTeacherId ? "put" : "post";
        const url = courseTeacherId 
            ? `http://localhost:3000/api_v1/courseTeacherHours/${courseTeacherId}` 
            : "http://localhost:3000/api_v1/courseTeacherHours";

        try {
            await axios[method](url, { courseFk, teacherFk, hours });
            bootstrap.Modal.getInstance(courseTeacherModal).hide();
            loadCourseTeachers();
        } catch (error) {
            alert("Error al guardar la asignación: " + error.message);
        }
    });

    // Ver detalles de una asignación
    async function handleShowCourseTeacher(e) {
        const courseTeacherId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/courseTeacherHours/${courseTeacherId}`);
            const ct = response.data;
            alert(`Detalles de la asignación:\nID: ${ct.Course_teacher_hours_id}\nCurso ID: ${ct.Course_fk}\nProfesor ID: ${ct.Teacher_fk}\nHoras: ${ct.Hours}`);
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Editar una asignación
    async function handleEditCourseTeacher(e) {
        const courseTeacherId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await axios.get(`http://localhost:3000/api_v1/courseTeacherHours/${courseTeacherId}`);
            const ct = response.data;
            document.getElementById("courseTeacherModalLabel").textContent = "Editar Asignación";
            courseFkInput.value = ct.Course_fk;
            teacherFkInput.value = ct.Teacher_fk;
            hoursInput.value = ct.Hours;
            courseTeacherIdInput.value = ct.Course_teacher_hours_id;
        } catch (error) {
            alert("Error al cargar la asignación: " + error.message);
        }
    }

    // Eliminar una asignación
    async function handleDeleteCourseTeacher(e) {
        const courseTeacherId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta asignación?")) return;

        try {
            await axios.delete(`http://localhost:3000/api_v1/courseTeacherHours/${courseTeacherId}`);
            loadCourseTeachers();
        } catch (error) {
            alert("Error al eliminar la asignación: " + error.message);
        }
    }

    loadCourseTeachers();
});