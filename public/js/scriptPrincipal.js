/// Declarar ganttChart globalmente para que sea accesible desde cualquier parte del código
let ganttChart; // ganttChart está inicializada, pero su valor es undefined

// 01 - Espera a que se cargue el DOM antes de ejecutar el código

/* 
document: En JavaScript, document se refiere al documento HTML que está siendo mostrado en el navegador. Es como una representación del contenido de la página.

addEventListener: Es una función que le dice al navegador que escuche (o esté atento) a cierto tipo de eventos y ejecute una función específica cuando ocurra ese evento.

'DOMContentLoaded': Este es el tipo de evento que estamos esperando. "DOMContentLoaded" se refiere al momento en que todo el contenido HTML de la página ha sido cargado y está listo para ser manipulado con JavaScript.

async function () { ... }: Esta es la función que se ejecutará cuando el evento 'DOMContentLoaded' ocurra. La palabra clave async se utiliza para indicar que la función puede contener operaciones asíncronas (como promesas). 

En resumen, la línea de código completa significa: "Espera a que todo el contenido HTML de la página esté listo y cargado, y cuando eso suceda, ejecuta la siguiente función".
*/
document.addEventListener('DOMContentLoaded', async function () {
    // 02 - Obtén los datos de proyectos del atributo 'data-proyectos' en el HTML
    const proyectosData = document.getElementById('proyectos-data').getAttribute('data-proyectos');
    const proyectos = JSON.parse(proyectosData);

    // 03 - Verifica si hay proyectos disponibles
    if (proyectos.length > 0) {
        // 04 - Extrae las fechas de inicio y fin de cada proyecto
        const fechasInicio = proyectos.map(project => new Date(project.start).getTime());
        const fechasFin = proyectos.map(project => new Date(project.end).getTime());

        // 05 - Encuentra la fecha mínima y máxima entre todas las fechas de inicio y fin
        const minDate = new Date(Math.min(...fechasInicio));
        const maxDate = new Date(Math.max(...fechasFin));

        // 06 - Verifica que las fechas mínima y máxima sean válidas
        if (minDate && maxDate) {
            // 07 - Asume que la preferencia de vista está almacenada en el primer proyecto
            const preferenciaVista = proyectos[0].viewPreference || 'Month';

            // 08 - Modifica cada tarea para incluir el porcentaje de avance
            proyectos.forEach(tarea => {
                tarea.progress = tarea.progress || 0; // Si cumplimiento no está definido, se asume como 0
            });

            // 09 - Limpia el objeto ganttChart si ya existe
            if (ganttChart) {
                ganttChart.clear();
            }

            // 10 - Crea un nuevo objeto ganttChart
            ganttChart = new Gantt("#gantt", proyectos, {
                // Configuración del diagrama de Gantt
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
                // Configuración personalizada de la renderización de las barras
                bar_render: (bar, task) => {
                    console.log('Datos de la tarea:', task);
                    // Puedes personalizar el contenido HTML de la barra aquí
                    bar.innerHTML = `
                        <div style="text-align: center; font-size: 12px; font-weight: bold;">
                            <div>${task.name} - ${task.progress}%</div>
                        </div>`;
                    // Agrega cualquier otro contenido adicional que desees mostrar en la barra
                },
                // Manejadores de eventos
                on_click: task => {
                    console.log('Clic en tarea:', task);
                },
                on_date_change: (task, start, end) => {
                    // Verifica que las fechas sean válidas antes de aplicar cambios
                    if (!(start instanceof Date) || !(end instanceof Date) || start >= end) {
                        console.error('Fechas inválidas:', start, end);
                        return;
                    }

                    task._start = start;
                    task._end = end;

                    console.log('Cambiar fechas de tarea:', task, start, end);

                    // Vuelve a renderizar el diagrama de Gantt con las fechas actualizadas
                    ganttChart.render();
                },
                // Configuración personalizada del contenido del popup
                custom_popup_html: (task) => {
                    const start = new Date(task._start);
                    const end = new Date(task._end);
                    const duracionDias = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                    // Agrega el porcentaje de avance al popup
                    const progress = task.progress;

                    return `<div class="popup-container"
                        style="background-color: Aqua; width: 15rem; height: 20vh; color: black; ">
                        <h4>${task.name}</h4>
                        <p>Inicio: ${start.toISOString().split('T')[0]}</p>
                        <p>Fin: ${end.toISOString().split('T')[0]}</p>
                        <p>Duración: ${duracionDias} días</p>
                        <p>Avance: ${progress}%</p>
                    </div>`;
                },
                language: 'es'
            });

            // 11 - Configura las fechas mínima y máxima del diagrama de Gantt
            ganttChart.setup_dates(minDate, maxDate);

            // 12 - Renderiza el diagrama de Gantt
            ganttChart.render();
        } else {
            console.error('Las fechas de los proyectos no son válidas.');
        }
    } else {
        console.warn('No hay proyectos disponibles para mostrar en el diagrama de Gantt.');
    }
});
