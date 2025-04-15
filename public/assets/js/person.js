document.addEventListener("DOMContentLoaded", () => {
    const personTableBody = document.querySelector("#personTable tbody");
    const personModal = document.getElementById("personModal");
    const personForm = document.getElementById("personForm");
    const personNameInput = document.getElementById("personName");
    const personDocumentInput = document.getElementById("personDocument");
    const personAgeInput = document.getElementById("personAge");
    const personIdInput = document.getElementById("personId");

    async function loadPersons() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/person");
            if (!response.ok) throw new Error("Error al obtener personas");
            const persons = await response.json();
            personTableBody.innerHTML = "";
            persons.forEach(person => {
                const row = `
                    <tr>
                        <td>${person.Person_id}</td>
                        <td>${person.Person_name}</td>
                        <td>${person.Person_document}</td>
                        <td>${person.Person_age}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${person.Person_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${person.Person_id}" data-bs-toggle="modal" data-bs-target="#personModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${person.Person_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                personTableBody.insertAdjacentHTML("beforeend", row);
            });

            // Delegación de eventos
            personTableBody.addEventListener("click", async (e) => {
                const target = e.target.closest("button");
                if (!target) return;

                const personId = target.getAttribute("data-id");

                if (target.classList.contains("btn-show")) {
                    await handleShowPerson({ target });
                } else if (target.classList.contains("btn-edit")) {
                    await handleEditPerson({ target });
                } else if (target.classList.contains("btn-delete")) {
                    await handleDeletePerson({ target });
                }
            });
        } catch (error) {
            alert("Error al cargar personas: " + error.message);
        }
    }

    document.querySelector('[data-bs-target="#personModal"]').addEventListener("click", () => {
        document.getElementById("personModalLabel").textContent = "Agregar Nueva Persona";
        personNameInput.value = "";
        personDocumentInput.value = "";
        personAgeInput.value = "";
        personIdInput.value = "";
    });

    personForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const personName = personNameInput.value.trim();
        const personDocument = personDocumentInput.value.trim();
        const personAge = parseInt(personAgeInput.value);
        const personId = personIdInput.value;
        const method = personId ? "PUT" : "POST";
        const url = personId ? `http://localhost:3000/api_v1/person/${personId}` : "http://localhost:3000/api_v1/person";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ personName, personDocument, personAge })
            });
            if (!response.ok) throw new Error("Error al guardar la persona");
            bootstrap.Modal.getInstance(personModal).hide();
            loadPersons(); // Recargar la tabla después de guardar
        } catch (error) {
            alert("Error al guardar la persona: " + error.message);
        }
    });

    async function handleShowPerson(e) {
        const personId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/person/${personId}`);
            if (!response.ok) throw new Error("Error al obtener la persona");
            const person = await response.json();
            alert(`Detalles de la persona:\nID: ${person.Person_id}\nNombre: ${person.Person_name}\nDocumento: ${person.Person_document}\nEdad: ${person.Person_age}`);
        } catch (error) {
            alert("Error al cargar la persona: " + error.message);
        }
    }

    async function handleEditPerson(e) {
        const personId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/person/${personId}`);
            if (!response.ok) throw new Error("Error al obtener la persona");
            const person = await response.json();
            document.getElementById("personModalLabel").textContent = "Editar Persona";
            personNameInput.value = person.Person_name;
            personDocumentInput.value = person.Person_document;
            personAgeInput.value = person.Person_age;
            personIdInput.value = person.Person_id;
        } catch (error) {
            alert("Error al cargar la persona: " + error.message);
        }
    }

    async function handleDeletePerson(e) {
        const personId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta persona?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/person/${personId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar la persona");
            loadPersons(); // Recargar la tabla después de eliminar
        } catch (error) {
            alert("Error al eliminar la persona: " + error.message);
        }
    }

    loadPersons(); // Cargar personas al cargar la página
});