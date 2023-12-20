document.addEventListener('DOMContentLoaded', function () {
    const formCambiarVista = document.getElementById('formCambiarVista');

    if (formCambiarVista) {
        formCambiarVista.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nuevaVista = event.submitter.value;
            const proyectoIdElement = document.getElementById('proyectoId');
            const proyectoId = proyectoIdElement.value;

            // Validar que nuevaVista y proyectoId estén presentes y sean válidos aquí antes de hacer la solicitud fetch
            if (!nuevaVista || !proyectoId) {
                console.error('Nueva vista y proyectoId son obligatorios.');
                return;
            }

            try {
                const response = await fetch('/proyectos/cambiar-vista', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        proyectoId,
                        nuevaVista,
                    }),
                });

                const data = await response.json();

                if (!data.success) {
                    console.error('Error al cambiar la vista en el servidor:', data.error);
                    // Maneja el error si es necesario
                } else {
                    // Recarga la página o vuelve a renderizar el gráfico según tus necesidades
                    location.reload(); // o tu función para volver a renderizar el gráfico
                }
            } catch (error) {
                console.error('Error al realizar la solicitud al servidor:', error);
                // Maneja el error si es necesario
            }
        });
    }
});