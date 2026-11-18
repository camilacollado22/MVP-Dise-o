
// ==========================================
// DATOS DE PRUEBA
// ==========================================

const estudiantes = [
    {
        id: 1,
        nombre: "Lucía Fernández",
        legajo: "20261001",
        carrera: "Tecnicatura en Desarrollo Web",
        estado: "Habilitado",
        materiasAprobadas: ["Programación Web I"]
    },
    {
        id: 2,
        nombre: "Mateo Rodríguez",
        legajo: "20261002",
        carrera: "Tecnicatura en Desarrollo Web",
        estado: "Habilitado",
        materiasAprobadas: []
    },
    {
        id: 3,
        nombre: "Sofía Martínez",
        legajo: "20261003",
        carrera: "Licenciatura en Administración",
        estado: "Habilitado",
        materiasAprobadas: []
    }
];

const comisiones = [
    {
        id: 1,
        materia: "Programación Web I",
        carrera: "Tecnicatura en Desarrollo Web",
        numero: "A",
        docente: "Prof. García",
        horario: "Lunes 18:00 a 22:00",
        cupos: 5,
        correlativas: []
    },
    {
        id: 2,
        materia: "Base de Datos I",
        carrera: "Tecnicatura en Desarrollo Web",
        numero: "B",
        docente: "Prof. López",
        horario: "Martes 18:00 a 22:00",
        cupos: 0,
        correlativas: []
    },
    {
        id: 3,
        materia: "Matemática I",
        carrera: "Tecnicatura en Desarrollo Web",
        numero: "A",
        docente: "Prof. Pérez",
        horario: "Miércoles 18:00 a 22:00",
        cupos: 3,
        correlativas: []
    },
    {
        id: 4,
        materia: "Introducción a la Administración",
        carrera: "Licenciatura en Administración",
        numero: "A",
        docente: "Prof. Gómez",
        horario: "Jueves 18:00 a 22:00",
        cupos: 8,
        correlativas: []
    },
    {
        id: 5,
        materia: "Programación Web II",
        carrera: "Tecnicatura en Desarrollo Web",
        numero: "A",
        docente: "Prof. Ramírez",
        horario: "Viernes 18:00 a 22:00",
        cupos: 3,
        correlativas: ["Programación Web I"]
    }
];

// Inscripción previa de ejemplo para probar el escenario 3.
const inscripciones = [
    {
        id: 1,
        estudianteId: 2,
        comisionId: 3,
        materia: "Matemática I",
        comision: "A",
        estado: "APROBADA",
        motivo: "Inscripción de ejemplo ya registrada."
    }
];

let siguienteInscripcionId = inscripciones.length + 1;
let estudianteActual = null;


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const pantallaLogin = document.getElementById("pantalla-login");
const pantallaPrincipal = document.getElementById("pantalla-principal");

const estudianteSelect = document.getElementById("estudiante-select");
const botonIngresar = document.getElementById("btn-ingresar");
const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");

const errorLogin = document.getElementById("error-login");

const nombreEstudiante = document.getElementById("nombre-estudiante");
const legajoEstudiante = document.getElementById("legajo-estudiante");
const carreraEstudiante = document.getElementById("carrera-estudiante");
const estadoEstudiante = document.getElementById("estado-estudiante");

const tablaMaterias = document.getElementById("tabla-materias");
const listaInscripciones = document.getElementById("lista-inscripciones");


// ==========================================
// AUTENTICACIÓN SIMULADA
// ==========================================

function cargarEstudiantes() {
    estudianteSelect.innerHTML = '<option value="">Seleccioná un estudiante</option>';

    estudiantes.forEach(estudiante => {
        const opcion = document.createElement("option");

        opcion.value = estudiante.id;
        opcion.textContent = estudiante.nombre;

        estudianteSelect.appendChild(opcion);
    });
}

function ingresarAlSistema() {
    const idSeleccionado = Number(estudianteSelect.value);

    estudianteActual = estudiantes.find(
        estudiante => estudiante.id === idSeleccionado
    );

    if (!estudianteActual) {
        errorLogin.textContent = "Seleccioná un estudiante para ingresar.";
        return;
    }

    if (estudianteActual.estado !== "Habilitado") {
        errorLogin.textContent = "El estudiante no se encuentra habilitado.";
        return;
    }

    errorLogin.textContent = "";

    pantallaLogin.classList.add("oculto");
    pantallaPrincipal.classList.remove("oculto");

    mostrarContextoAcademico();
    cargarOfertaAcademica();
    mostrarInscripciones();
}

function mostrarContextoAcademico() {
    nombreEstudiante.textContent = estudianteActual.nombre;
    legajoEstudiante.textContent = estudianteActual.legajo;
    carreraEstudiante.textContent = estudianteActual.carrera;
    estadoEstudiante.textContent = estudianteActual.estado;
}


// ==========================================
// CONSULTA DE OFERTA ACADÉMICA
// ==========================================

function cargarOfertaAcademica() {
    tablaMaterias.innerHTML = "";

    // Mostramos todas las materias para que también se pueda
    // probar la validación de materia fuera de la carrera.
    comisiones.forEach(comision => {
        const perteneceCarrera =
            comision.carrera === estudianteActual.carrera;

        const cuposOcupados = inscripciones.filter(inscripcion =>
            inscripcion.comisionId === comision.id &&
            inscripcion.estado === "APROBADA"
        ).length;

        const cuposDisponibles = Math.max(
            0,
            comision.cupos - cuposOcupados
        );

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                ${comision.materia}
                ${perteneceCarrera
                    ? '<span class="etiqueta-carrera">Tu carrera</span>'
                    : '<span class="etiqueta-otra-carrera">Otra carrera</span>'}
            </td>
            <td>${comision.numero}</td>
            <td>${comision.docente}</td>
            <td>${comision.horario}</td>
            <td>
                <span class="${cuposDisponibles > 0 ? "cupo-disponible" : "cupo-agotado"}">
                    ${cuposDisponibles}
                </span>
            </td>
            <td>
                <button
                    class="btn-inscribirse"
                    data-comision-id="${comision.id}"
                    type="button">
                    Inscribirme
                </button>
            </td>
        `;

        tablaMaterias.appendChild(fila);
    });

    document.querySelectorAll(".btn-inscribirse").forEach(boton => {
        boton.addEventListener("click", () => {
            const idComision = Number(boton.dataset.comisionId);
            intentarInscripcion(idComision);
        });
    });
}


// ==========================================
// CASO DE USO: INSCRIBIRSE A MATERIA
// ==========================================

async function intentarInscripcion(idComision) {
    const comision = comisiones.find(
        elemento => elemento.id === idComision
    );

    // Validación preliminar: la comisión debe existir.
    if (!comision) {
        mostrarResultado(
            "Solicitud no iniciada",
            "La comisión seleccionada no existe."
        );
        return;
    }

    // Validación preliminar: la materia debe pertenecer
    // a la carrera del estudiante.
    if (comision.carrera !== estudianteActual.carrera) {
        mostrarResultado(
            "Solicitud no iniciada",
            "La materia no pertenece a tu carrera. No se creó una inscripción."
        );
        return;
    }

    // Se crea la solicitud en estado PENDIENTE.
    const nuevaInscripcion = {
        id: siguienteInscripcionId++,
        estudianteId: estudianteActual.id,
        comisionId: comision.id,
        materia: comision.materia,
        comision: comision.numero,
        estado: "PENDIENTE",
        historial: ["PENDIENTE"],
        motivo: "Verificando los requisitos de inscripción…"
    };

    inscripciones.push(nuevaInscripcion);

    mostrarInscripciones();
    mostrarResultado("PENDIENTE", nuevaInscripcion.motivo);
    document.getElementById("resultado-inscripcion").scrollIntoView({ block: "center" });
    const botones = document.querySelectorAll(".btn-inscribirse, #btn-cerrar-sesion");
    botones.forEach(boton => boton.disabled = true);

    try {
        // Pausa de la simulación para que el estado inicial sea visible durante la demo.
        await new Promise(resolver => setTimeout(resolver, 1800));
        resolverInscripcion(nuevaInscripcion, comision);
    } finally {
        botones.forEach(boton => boton.disabled = false);
    }
}

function resolverInscripcion(nuevaInscripcion, comision) {
    // Validación 1: inscripción previa.
    const yaEstabaInscripto = inscripciones.some(inscripcion =>
        inscripcion !== nuevaInscripcion &&
        inscripcion.estudianteId === estudianteActual.id &&
        inscripcion.comisionId === comision.id &&
        inscripcion.estado !== "RECHAZADA" &&
        inscripcion.estado !== "CANCELADA"
    );

    if (yaEstabaInscripto) {
        rechazarInscripcion(
            nuevaInscripcion,
            "El estudiante ya tiene una inscripción registrada en esta comisión."
        );
        return;
    }

    // Validación 2: correlatividades.
    const correlativasPendientes = comision.correlativas.filter(
        materiaRequerida =>
            !estudianteActual.materiasAprobadas.includes(materiaRequerida)
    );

    if (correlativasPendientes.length > 0) {
        rechazarInscripcion(
            nuevaInscripcion,
            "No cumplís con las correlatividades. Debés aprobar: " +
            correlativasPendientes.join(", ") + "."
        );
        return;
    }

    // Validación 3: cupos disponibles.
    const inscriptosAprobados = inscripciones.filter(inscripcion =>
        inscripcion.comisionId === comision.id &&
        inscripcion.estado === "APROBADA"
    ).length;

    const cuposDisponibles = comision.cupos - inscriptosAprobados;

    if (cuposDisponibles <= 0) {
        rechazarInscripcion(
            nuevaInscripcion,
            "La comisión no tiene cupos disponibles."
        );
        return;
    }

    // Si todas las validaciones se cumplen, se aprueba.
    nuevaInscripcion.estado = "APROBADA";
    nuevaInscripcion.historial.push("APROBADA");
    nuevaInscripcion.motivo = "Se cumplieron todas las validaciones.";

    mostrarResultado(
        "APROBADA",
        "¡La inscripción a " + comision.materia + " fue aprobada!"
    );

    actualizarPantalla();
}

function rechazarInscripcion(inscripcion, motivo) {
    inscripcion.estado = "RECHAZADA";
    inscripcion.historial.push("RECHAZADA");
    inscripcion.motivo = motivo;

    mostrarResultado("RECHAZADA", motivo);
    actualizarPantalla();
}



function mostrarResultado(estado, mensaje) {
    let resultado = document.getElementById("resultado-inscripcion");

    if (!resultado) {
        resultado = document.createElement("div");
        resultado.id = "resultado-inscripcion";

        listaInscripciones.parentElement.insertBefore(
            resultado,
            listaInscripciones
        );
    }

    resultado.className = `resultado-inscripcion resultado-${estado.toLowerCase().replaceAll(" ", "-")}`;

    resultado.innerHTML = `
        <div class="resultado-icono">
            ${estado === "APROBADA" ? "✓" : estado === "RECHAZADA" ? "✕" : estado === "CANCELADA" ? "X" : "…"}
        </div>
        <div>
            <span class="resultado-etiqueta">${estado === "CANCELADA" ? "Actualización de inscripción" : "Resultado del último intento"}</span>
            <strong>${estado}</strong>
            <p>${mensaje}</p>
        </div>
    `;
}



function mostrarInscripciones() {
    listaInscripciones.innerHTML = "";

    const inscripcionesEstudiante = inscripciones.filter(
        inscripcion =>
            inscripcion.estudianteId === estudianteActual.id
    );

    inscripcionesEstudiante.sort((a, b) => {
        if (a.estado === "APROBADA" && b.estado !== "APROBADA") {
            return -1;
        }

        if (a.estado !== "APROBADA" && b.estado === "APROBADA") {
            return 1;
        }

        return 0;
    });

    if (inscripcionesEstudiante.length === 0) {
        listaInscripciones.innerHTML = `
            <div class="sin-inscripciones">
                <p>Todavía no tenés inscripciones registradas.</p>
            </div>
        `;
        return;
    }

    inscripcionesEstudiante.forEach(inscripcion => {
        const elemento = document.createElement("article");
        elemento.className = "inscripcion-item";

        const historial = inscripcion.historial || [inscripcion.estado];

        elemento.innerHTML = `
            <div class="inscripcion-info">
                <div class="inscripcion-encabezado">
                    <h3>${inscripcion.materia}</h3>
                    <div class="recorrido-estados" aria-label="Recorrido de la solicitud">
                        ${historial.map((estado, indice) => `
                            ${indice > 0 ? '<span aria-hidden="true">→</span>' : ""}
                            <span class="estado-inscripcion estado-${estado.toLowerCase()}">${estado}</span>
                        `).join("")}
                    </div>
                </div>

                <p class="inscripcion-comision">
                    Comisión ${inscripcion.comision}
                </p>

                <p class="inscripcion-motivo">
                    ${inscripcion.motivo}
                </p>
                ${inscripcion.estado === "APROBADA"
                    ? `<div class="inscripcion-acciones">
                        <button
                            class="btn-cancelar-inscripcion"
                            data-inscripcion-id="${inscripcion.id}"
                            type="button">
                            Cancelar inscripción
                        </button>
                    </div>`
                    : ""}
            </div>
        `;

        listaInscripciones.appendChild(elemento);
    });

    document.querySelectorAll(".btn-cancelar-inscripcion").forEach(boton => {
        boton.addEventListener("click", () => {
            cancelarInscripcion(Number(boton.dataset.inscripcionId));
        });
    });
}

function cancelarInscripcion(idInscripcion) {
    const inscripcion = inscripciones.find(
        elemento => elemento.id === idInscripcion
    );

    if (
        !inscripcion ||
        !estudianteActual ||
        inscripcion.estudianteId !== estudianteActual.id ||
        inscripcion.estado !== "APROBADA"
    ) {
        return;
    }

    if (!inscripcion.historial) {
        inscripcion.historial = [inscripcion.estado];
    }

    inscripcion.estado = "CANCELADA";
    inscripcion.historial.push("CANCELADA");
    inscripcion.motivo = "Inscripción cancelada por el estudiante.";

    mostrarResultado(
        "CANCELADA",
        `Cancelaste tu inscripción a ${inscripcion.materia}.`
    );
    actualizarPantalla();
}


function actualizarPantalla() {
    mostrarInscripciones();
    cargarOfertaAcademica();
}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesion() {
    estudianteActual = null;

    pantallaPrincipal.classList.add("oculto");
    pantallaLogin.classList.remove("oculto");

    estudianteSelect.value = "";
    errorLogin.textContent = "";

    const resultado = document.getElementById("resultado-inscripcion");

    if (resultado) {
        resultado.replaceChildren();
        resultado.className = "";
    }
}


// ==========================================
// EVENTOS
// ==========================================

botonIngresar.addEventListener("click", ingresarAlSistema);
botonCerrarSesion.addEventListener("click", cerrarSesion);

cargarEstudiantes();
