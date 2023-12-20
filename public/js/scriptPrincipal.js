// Declarar ganttChart globalmente para que sea accesible desde cualquier parte del código
let ganttChart;

document.addEventListener('DOMContentLoaded', async function () {
    const proyectosData = document.getElementById('proyectos-data').getAttribute('data-proyectos');
    const proyectos = JSON.parse(proyectosData);

    if (proyectos.length > 0) {
        const fechasInicio = proyectos.map(project => new Date(project.start).getTime());
        const fechasFin = proyectos.map(project => new Date(project.end).getTime());

        const minDate = new Date(Math.min(...fechasInicio));
        const maxDate = new Date(Math.max(...fechasFin));

        if (minDate && maxDate) {
            // Aquí asumimos que la preferencia de vista está almacenada en el primer proyecto
            const preferenciaVista = proyectos[0].viewPreference || 'Month';

            // Modifica cada tarea para incluir el porcentaje de avance
            proyectos.forEach(tarea => {
                tarea.progress = tarea.progress || 0; // Si cumplimiento no está definido, se asume como 0
            });

            if (ganttChart) {
                ganttChart.clear();
            }

            ganttChart = new Gantt("#gantt", proyectos, {
                header_height: 50,
                column_width: 30,
                step: 24,
                view_mode: preferenciaVista,
                bar_height: 40,
                bar_corner_radius: 5,
                arrow_curve: 5,
                padding: 18,
                date_format: 'YYYY-MM-DD',
                popup_trigger: 'mouseover',
                draggable: false,
                show_progress: true,
                bar_render: (bar, task) => {
                    console.log('Datos de la tarea:', task);
                    // Puedes personalizar el contenido HTML de la barra aquí
                    bar.innerHTML = `
                        <div style="text-align: center; font-size: 12px; font-weight: bold;">
                            <div>${task.name} - ${task.progress}%</div>
                        </div>`;
                    // Agrega cualquier otro contenido adicional que desees mostrar en la barra
                },
                on_click: task => {
                    console.log('Clic en tarea:', task);
                },
                on_date_change: (task, start, end) => {
                    if (!(start instanceof Date) || !(end instanceof Date) || start >= end) {
                        console.error('Fechas inválidas:', start, end);
                        return;
                    }

                    task._start = start;
                    task._end = end;

                    console.log('Cambiar fechas de tarea:', task, start, end);

                    ganttChart.render();
                },
                custom_popup_html: (task) => {
                    const start = new Date(task._start);
                    const end = new Date(task._end);
                    const duracionDias = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                    // Agrega el porcentaje de avance al popup
                    const progress = task.progress;

                    return `<div class="popup-container"
                        style="background-color: Aqua; width: 15rem; height: 30vh; color: black; ">
                        <h4>${task.name}</h4>
                        <p>Inicio: ${start.toISOString().split('T')[0]}</p>
                        <p>Fin: ${end.toISOString().split('T')[0]}</p>
                        <p>Duración: ${duracionDias} días</p>
                        <p>Avance: ${progress}%</p>
                    </div>`;
                },
                language: 'es'
            });

            ganttChart.setup_dates(minDate, maxDate);

            ganttChart.render();
        } else {
            console.error('Las fechas de los proyectos no son válidas.');
        }
    } else {
        console.warn('No hay proyectos disponibles para mostrar en el diagrama de Gantt.');
    }
});