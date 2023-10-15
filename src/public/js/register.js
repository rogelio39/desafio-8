const form = document.getElementById('idForm');
const userContainer = document.getElementById('userContainer');
const errorContainer = document.getElementById('errorContainer');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const first_name = formData.get('first_name');
    const last_name = formData.get('last_name');
    const age = formData.get('age');
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name, last_name, age, email, password})
        });
        if (response.status === 200) {
            // Redirigir al usuario después del inicio de sesión
            window.location.href = '/static/login';
        } else {
            errorContainer.innerHTML= "<p>Error en alguno de los datos ingresados</p>"
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
