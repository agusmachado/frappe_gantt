document.addEventListener('DOMContentLoaded', function () {
    const formularioCumplimiento = document.getElementById('formularioCumplimiento');

    if (formularioCumplimiento) {
        const progressInput = document.getElementById('progress');

        formularioCumplimiento.addEventListener('submit', async function (event) {
        event.preventDefault();

        const proyectoId = document.getElementById('selectProyectoCumplimiento').value;
        const progress = progressInput.value;

        // Validar que proyectoId y progress no estén vacíos
        if (!proyectoId || !progress) {
            console.error('ProyectoId y progreso son obligatorios.');
            return;
        }

        try {
            // Realizar la solicitud al servidor
            const response = await fetch('/actualizar-cumplimiento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                proyectoId,
                progress,
            }),
            });

            const data = await response.json();

            if (!data.success) {
            console.error('Error al actualizar el cumplimiento en el servidor:', data.error);
            // Manejar el error mostrando un mensaje al usuario si es necesario
            } else {
            // Actualizar la tarea en el gráfico de Gantt
            const tareaActualizada = ganttChart.get_task(proyectoId);
            tareaActualizada.progress = data.proyecto.progress;

            // Volver a renderizar el gráfico de Gantt para reflejar los cambios
            ganttChart.render();

            // Limpiar el valor del input
            progressInput.value = '';
            console.log('Valor del input limpiado:', progressInput.value);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud al servidor:', error);
            // Manejar el error mostrando un mensaje al usuario si es necesario
        }
        });
    }
    });