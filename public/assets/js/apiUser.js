document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    // Función para registrar un usuario
    async function registerUser(userData) {
        try {
            const response = await fetch('http://localhost:3000/api_v1/api_users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar');
            }

            const result = await response.json();
            alert('Usuario registrado con ID: ' + result.data.id);
            registerForm.reset(); // Limpiar el formulario después del registro exitoso
        } catch (error) {
            alert(error.message);
        }
    }

    // Manejador de envío del formulario de registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const userData = {
            user: document.getElementById('userName').value,
            password: document.getElementById('userPassword').value,
        };

        // Validar que todos los campos estén completos
        if (!userData.user || !userData.password) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Llamar a la función para registrar el usuario
        registerUser(userData);
    });
});