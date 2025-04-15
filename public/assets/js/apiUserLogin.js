document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Función para iniciar sesión
    async function loginUser(credentials) {
        try {
            const response = await fetch('http://localhost:3000/api_v1/api_users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al iniciar sesión');
            }

            const result = await response.json();
            alert('Inicio de sesión exitoso');
            console.log('Token JWT:', result.token); // Mostrar el token en la consola

            // Almacenar el token en localStorage (opcional)
            localStorage.setItem('token', result.token);

            // Redirigir al usuario a la página deseada
            window.location.href = '../person/person.html'; // Cambia esta ruta según tu estructura

            // Limpiar el formulario después del inicio de sesión exitoso
            loginForm.reset();
        } catch (error) {
            // Mostrar mensaje de error en el DOM
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    }

    // Manejador de envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const credentials = {
            user: document.getElementById('userName').value, // Nombre de usuario
            password: document.getElementById('userPassword').value, // Contraseña
        };

        // Validar que todos los campos estén completos
        if (!credentials.user || !credentials.password) {
            errorMessage.textContent = 'Todos los campos son obligatorios.';
            errorMessage.style.display = 'block';
            return;
        }

        // Ocultar el mensaje de error si estaba visible
        errorMessage.style.display = 'none';

        // Llamar a la función para iniciar sesión
        loginUser(credentials);
    });
});