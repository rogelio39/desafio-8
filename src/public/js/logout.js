document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');

    logoutButton.addEventListener('click', async () => {
        console.log('Botón de cerrar sesión clickeado'); 
        try {
            const response = await fetch('/api/sessions/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                window.location.href = '/static/login';
            } else {
                // Manejar otros códigos de estado si es necesario
                console.log('Error en la respuesta del servidor:', response.status);
            }
        } catch (error) {
            console.error('Error durante la solicitud:', error);
        }
    });
});
