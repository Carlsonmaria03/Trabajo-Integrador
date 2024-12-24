// Inicializamos el carrito como un arreglo vacío
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, descripcion) {
    const productoExistente = carrito.find(producto => producto.nombre === nombre);
    if (productoExistente) {
        alert('Este producto ya está en el carrito.');
        return;
    }
    const producto = { nombre, descripcion };
    carrito.push(producto);
    guardarCarrito();
    mostrarCarrito();
}

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    const fragment = document.createDocumentFragment();

    carrito.forEach((producto) => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-carrito');
        productoDiv.innerHTML = `<strong>${producto.nombre}</strong>: ${producto.descripcion}`;
        fragment.appendChild(productoDiv);
    });

    carritoContainer.innerHTML = ''; // Limpia el contenedor
    carritoContainer.appendChild(fragment); // Agrega todos los productos de una vez
}

// Funciones para manejar el localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const datos = localStorage.getItem('carrito');
    if (datos) {
        carrito = JSON.parse(datos);
        mostrarCarrito();
    }
}

// Validación del formulario
function verificarFormulario() {
    const inputs = document.querySelectorAll('#contacto input, #contacto textarea');
    let todosCompletos = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            todosCompletos = false;
            input.style.border = '1px solid red'; // Resaltar campo vacío
        } else {
            input.style.border = ''; // Quitar resaltado si está completo
        }
    });

    return todosCompletos;
}

// Guardar datos del formulario en el localStorage
function guardarDatosFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    const datosFormulario = { nombre, apellido, email, mensaje };
    localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));
}

// Clave de API y URL base para el clima
const apiKey = 'fda36bb2555c5a76fec158fc1e74fb9c';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

// Función para mostrar datos del clima
function mostrarClima(data) {
    document.querySelector('#ubicacion span').textContent = data.name;
    document.querySelector('#temperatura span').textContent = data.main.temp;
    document.querySelector('#descripcion span').textContent = data.weather[0].description;
}

// Función para obtener datos del clima por ciudad
async function obtenerClimaPorCiudad(ciudad) {
    try {
        const response = await fetch(`${apiURL}?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`);
        if (!response.ok) throw new Error('Error al obtener el clima.');
        const data = await response.json();
        mostrarClima(data);
    } catch (error) {
        console.error('Error:', error.message);
        alert('No se pudo obtener el clima para la ciudad predeterminada.');
    }
}

// Función para obtener datos del clima por geolocalización
async function obtenerClimaPorUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`${apiURL}?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${apiKey}`);
                    if (!response.ok) throw new Error('Error al obtener el clima.');
                    const data = await response.json();
                    mostrarClima(data);
                } catch (error) {
                    console.error('Error:', error.message);
                    alert('No se pudo obtener el clima basado en tu ubicación.');
                }
            },
            () => {
                alert('No se pudo obtener la ubicación. Usando ciudad predeterminada.');
                obtenerClimaPorCiudad('Buenos Aires');
            }
        );
    } else {
        alert('La geolocalización no está disponible. Usando ciudad predeterminada.');
        obtenerClimaPorCiudad('Buenos Aires');
    }
}

// Configuración de eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    obtenerClimaPorUbicacion();

    // Evento para finalizar la compra
    document.getElementById('finalizar-compra').addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío.');
        } else {
            alert('Gracias por tu compra. Tu pedido ha sido procesado.');
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
        }
    });

    // Validación y envío del formulario
    document.querySelector('#contacto form').addEventListener('submit', (event) => {
        if (!verificarFormulario()) {
            event.preventDefault(); // Prevenir el envío si la validación falla
        } else {
            guardarDatosFormulario();
        }
    });
});
