let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener("DOMContentLoaded", function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resaltar el Div actual segun el tab 
    mostrarSeccion();

    //oculta o muestra una seccion segun el tab
    cambiarSeccion();


    //Paginacion siguiente y anterior

    paginaSiguiente();

    paginaAnterior();


    //comprueba la pagina actual para ocultar o mostrar la paginacion
 
    botonesPaginador();


    //Muestra el resumen de la cita o mensaje de erro en caso de no pasar la validacion
    mostrarResumen();


    // Almacena el nombre de la cita en el objeto 
    nombreCita();


    //Almacena la fecha de la cita en el objeto

    fechaCita();
}

function mostrarSeccion(){

    //Eliminar mostrar-seccion de la seccion anterior

    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if(seccionAnterior){
        seccionAnterior.classList.remove("mostrar-seccion");
    }

     //Eliminar la clase de actual en el tab anterior
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");

    const tabAnterior = document.querySelector(".tabs .actual");

    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button")

    enlaces.forEach( enlace => {
        enlace.addEventListener("click", e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso); 

            //llamar la funcion de mostrar seccion 
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

 async function mostrarServicios(){
    try {
        const resultado = await fetch("./servicios.json");
        const db = await resultado.json();
        const { servicios } = db;


        //Generar el HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

        //DOM scripting
        //Generar nombre servicio
        const nombreServicio = document.createElement("P");
        nombreServicio.textContent = nombre;
        nombreServicio.classList.add("nombre-servicio")
        
        //Generar precio del servicio

        const precioServicio  = document.createElement("P");
        precioServicio.textContent = `$ ${precio}`;
        precioServicio.classList.add("precio-servicio")


        //Generara div contenedor de servicio
        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicios");
        servicioDiv.dataset.idServicio = id;
        //Selecciona un servicio para la cita

        servicioDiv.onclick = seleccionarServicio;

        //Inyectar precio y nombre al div de servicio

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        //Inyectar HTML
        document.querySelector("#servicios").appendChild(servicioDiv);

        } );
    } catch (error) {
       
    }
}

function seleccionarServicio(e){
    
    let elemento;
    //Forzar que el elemento al cual le damos click sea  el DIV

    if (e.target.tagName === "P") {
        elemento = e.target.parentElement; 
    } else { 
        elemento = e.target;
    }

    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado")

        const id = parseInt( elemento.dataset.idServicio );

        eliminarServicio(id);
    } else{
        elemento.classList.add("seleccionado"); 

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj);
    }   
}

function eliminarServicio(id) {
    const {servicios } = cita
    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    console.log(cita)
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
    pagina++;
    console.log(pagina);

        botonesPaginador();

    });
}


function paginaAnterior(){
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
    pagina--;

    console.log(pagina);
    
    botonesPaginador();

    });
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar");
    } else if (pagina === 3){
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
    } else{
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar"); 
    }

    mostrarSeccion(); //cambia la seccion que se muestra por la de la pagina   
}



function mostrarResumen() {
    //Destructuring
    const{ nombre,fecha,hora, servicios } = cita;

    // Seleccionar el resumen 
    const resumenDiv = document.querySelector(".contenido-resumen");

    //Validacion de objeto

    if(Object.values(cita).includes("")) {
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan datos de Servicios, hora, fecha o nombre";

        noServicios.classList.add("invalidar-cita");

        //Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
    }
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //Validar que nombreTexto debe tener algo
        if (nombreTexto ==='' || nombreTexto.length < 3){
           mostrarAlerta('Nombre no valido', 'error')
        } else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
 
        }
    });
}

function mostrarAlerta(mensaje, tipo){

    //Si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo ==='error'){
        alerta.classList.add("error");
    }
    //insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    //Eliminar la alerta despues de 3 segundos

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener("input", e => {

        const dia = new Date(e.target.value).getUTCDay();

        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Domingo no valido','error');
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }
    })
}