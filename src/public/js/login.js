const form = document.getElementById('idForm');
const userContainer = document.getElementById('userContainer');
const errorContainer = document.getElementById('errorContainer');
const buttonRegister = document.getElementById('buttonRegister');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (response.status === 200) {
            // Redirigir al usuario después del inicio de sesión
            window.location.href = '/static/products';
        } else {
            errorContainer.innerHTML = "<p>Error en alguno de los datos ingresados</p>"
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});


buttonRegister.addEventListener('click', () => {
    // Redirigir al usuario después del inicio de sesión
    window.location.href = '/static/register';
})