document.addEventListener("DOMContentLoaded", () => {
    const studentsTableBody = document.querySelector("#studentsTable tbody");
    const studentModal = document.getElementById("studentModal");
    const studentForm = document.getElementById("studentForm");
    const studentDegreeInput = document.getElementById("studentDegree");
    const personFkInput = document.getElementById("personFk");
    const studentIdInput = document.getElementById("studentId");

    // Cargar estudiantes
    async function loadStudents() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/student");
            if (!response.ok) throw new Error("Error al obtener estudiantes");
            const students = await response.json();
            studentsTableBody.innerHTML = "";
            students.forEach(student => {
                const row = `
                    <tr>
                        <td>${student.Student_id}</td>
                        <td>${student.Student_degree}</td>
                        <td>${student.Person_fk}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${student.Student_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${student.Student_id}" data-bs-toggle="modal" data-bs-target="#studentModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${student.Student_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                studentsTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowStudent));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditStudent));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteStudent));
        } catch (error) {
            alert("Error al cargar estudiantes: " + error.message);
        }
    }

    // Abrir modal para agregar un nuevo estudiante
    document.querySelector('[data-bs-target="#studentModal"]').addEventListener("click", () => {
        document.getElementById("studentModalLabel").textContent = "Agregar Nuevo Estudiante";
        studentDegreeInput.value = "";
        personFkInput.value = "";
        studentIdInput.value = "";
    });

    // Guardar estudiante (agregar o editar)
    studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const studentDegree = studentDegreeInput.value.trim();
        const personFk = personFkInput.value.trim();
        const studentId = studentIdInput.value;
        const method = studentId ? "PUT" : "POST";
        const url = studentId ? `http://localhost:3000/api_v1/student/${studentId}` : "http://localhost:3000/api_v1/student";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentDegree, personFk })
            });
            if (!response.ok) throw new Error("Error al guardar el estudiante");
            bootstrap.Modal.getInstance(studentModal).hide();
            loadStudents();
        } catch (error) {
            alert("Error al guardar el estudiante: " + error.message);
        }
    });

    // Ver detalles de un estudiante
    async function handleShowStudent(e) {
        const studentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/student/${studentId}`);
            if (!response.ok) throw new Error("Error al obtener el estudiante");
            const student = await response.json();
            alert(`Detalles del estudiante:\nID: ${student.Student_id}\nGrado: ${student.Student_degree}\nPersona FK: ${student.Person_fk}`);
        } catch (error) {
            alert("Error al cargar el estudiante: " + error.message);
        }
    }

    // Editar un estudiante
    async function handleEditStudent(e) {
        const studentId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/student/${studentId}`);
            if (!response.ok) throw new Error("Error al obtener el estudiante");
            const student = await response.json();
            document.getElementById("studentModalLabel").textContent = "Editar Estudiante";
            studentDegreeInput.value = student.Student_degree;
            personFkInput.value = student.Person_fk;
            studentIdInput.value = student.Student_id;
        } catch (error) {
            alert("Error al cargar el estudiante: " + error.message);
        }
    }

    // Eliminar un estudiante
    async function handleDeleteStudent(e) {
        const studentId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este estudiante?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/student/${studentId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el estudiante");
            loadStudents();
        } catch (error) {
            alert("Error al eliminar el estudiante: " + error.message);
        }
    }

    loadStudents();
});