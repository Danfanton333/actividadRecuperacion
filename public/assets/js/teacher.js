document.addEventListener("DOMContentLoaded", () => {
    const teachersTableBody = document.querySelector("#teachersTable tbody");
    const teacherModal = document.getElementById("teacherModal");
    const teacherForm = document.getElementById("teacherForm");
    const teacherSpecialtyInput = document.getElementById("teacherSpecialty");
    const personFkInput = document.getElementById("personFk");
    const teacherIdInput = document.getElementById("teacherId");

    // Cargar profesores
    async function loadTeachers() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/teacher");
            if (!response.ok) throw new Error("Error al obtener profesores");
            const teachers = await response.json();
            teachersTableBody.innerHTML = "";
            teachers.forEach(teacher => {
                const row = `
                    <tr>
                        <td>${teacher.Teacher_id}</td>
                        <td>${teacher.Teacher_specialty}</td>
                        <td>${teacher.Person_fk}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${teacher.Teacher_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${teacher.Teacher_id}" data-bs-toggle="modal" data-bs-target="#teacherModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${teacher.Teacher_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                teachersTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowTeacher));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditTeacher));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteTeacher));
        } catch (error) {
            alert("Error al cargar profesores: " + error.message);
        }
    }

    // Abrir modal para agregar un nuevo profesor
    document.querySelector('[data-bs-target="#teacherModal"]').addEventListener("click", () => {
        document.getElementById("teacherModalLabel").textContent = "Agregar Nuevo Profesor";
        teacherSpecialtyInput.value = "";
        personFkInput.value = "";
        teacherIdInput.value = "";
    });

    // Guardar profesor (agregar o editar)
    teacherForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const teacherSpecialty = teacherSpecialtyInput.value.trim();
        const personFk = personFkInput.value.trim();
        const teacherId = teacherIdInput.value;
        const method = teacherId ? "PUT" : "POST";
        const url = teacherId ? `http://localhost:3000/api_v1/teacher/${teacherId}` : "http://localhost:3000/api_v1/teacher";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teacherSpecialty, personFk })
            });
            if (!response.ok) throw new Error("Error al guardar el profesor");
            bootstrap.Modal.getInstance(teacherModal).hide();
            loadTeachers();
        } catch (error) {
            alert("Error al guardar el profesor: " + error.message);
        }
    });

    // Ver detalles de un profesor
    async function handleShowTeacher(e) {
        const teacherId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/teacher/${teacherId}`);
            if (!response.ok) throw new Error("Error al obtener el profesor");
            const teacher = await response.json();
            alert(`Detalles del profesor:\nID: ${teacher.Teacher_id}\nEspecialidad: ${teacher.Teacher_specialty}\nPersona FK: ${teacher.Person_fk}`);
        } catch (error) {
            alert("Error al cargar el profesor: " + error.message);
        }
    }

    // Editar un profesor
    async function handleEditTeacher(e) {
        const teacherId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/teacher/${teacherId}`);
            if (!response.ok) throw new Error("Error al obtener el profesor");
            const teacher = await response.json();
            document.getElementById("teacherModalLabel").textContent = "Editar Profesor";
            teacherSpecialtyInput.value = teacher.Teacher_specialty;
            personFkInput.value = teacher.Person_fk;
            teacherIdInput.value = teacher.Teacher_id;
        } catch (error) {
            alert("Error al cargar el profesor: " + error.message);
        }
    }

    // Eliminar un profesor
    async function handleDeleteTeacher(e) {
        const teacherId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este profesor?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/teacher/${teacherId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el profesor");
            loadTeachers();
        } catch (error) {
            alert("Error al eliminar el profesor: " + error.message);
        }
    }

    loadTeachers();
});