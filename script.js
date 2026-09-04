// === 1. FUNCIONALIDAD DEL BUSCADOR ===
const buscador = document.getElementById('buscador');

if (buscador) {
    buscador.addEventListener('keyup', function(event) {
        const textoBusqueda = event.target.value.toLowerCase();
        const productos = document.querySelectorAll('.producto-card');

        productos.forEach(function(producto) {
            const nombreProducto = producto.getAttribute('data-nombre').toLowerCase();
            if (nombreProducto.includes(textoBusqueda)) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    });
}

// === 2. FUNCIONALIDAD DEL CARRITO DE COMPRAS ===
let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];

function actualizarContador() {
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        contadorElemento.textContent = carrito.length;
    }
}

// Configurar botones de "Añadir a la bolsa" en la tienda
const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', function() {
        const nombre = this.getAttribute('data-nombre');
        const precio = parseInt(this.getAttribute('data-precio'));
        
        carrito.push({ nombre, precio });
        localStorage.setItem('carritoStore', JSON.stringify(carrito));
        actualizarContador();
        
        const textoOriginal = this.textContent;
        this.textContent = "¡AGREGADO!";
        this.style.backgroundColor = "#008a00";
        this.style.color = "white";
        
        setTimeout(() => {
            this.textContent = textoOriginal;
            this.style.backgroundColor = "#f4f4f4";
            this.style.color = "#000";
        }, 1500);
    });
});

// Redirigir a carrito.html al hacer clic en el ícono de la bolsa
const iconoBolsa = document.getElementById('icono-bolsa');
if (iconoBolsa) {
    iconoBolsa.addEventListener('click', function() {
        window.location.href = 'carrito.html';
    });
}

// --- LÓGICA EXCLUSIVA PARA LA PÁGINA carrito.html ---
const listaCarrito = document.getElementById('lista-carrito');
if (listaCarrito) {
    function renderizarCarrito() {
        listaCarrito.innerHTML = ''; 
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p class="carrito-vacio-msg">Tu bolsa está vacía actualmente. ¡Agrega productos para entrenar!</p>';
        } else {
            carrito.forEach((item) => {
                total += item.precio;
                const div = document.createElement('div');
                div.className = 'carrito-item';
                div.innerHTML = `
                    <span class="carrito-item-nombre">${item.nombre}</span>
                    <span class="carrito-item-precio">$${item.precio.toLocaleString('es-CL')}</span>
                `;
                listaCarrito.appendChild(div);
            });
        }

        const precioTotalEl = document.getElementById('precio-total');
        if (precioTotalEl) {
            precioTotalEl.textContent = `$${total.toLocaleString('es-CL')}`;
        }
    }

    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', function() {
            if (carrito.length > 0) {
                if(confirm('¿Estás seguro de que quieres vaciar tu bolsa?')) {
                    carrito = [];
                    localStorage.setItem('carritoStore', JSON.stringify(carrito));
                    actualizarContador();
                    renderizarCarrito();
                }
            }
        });
    }

    renderizarCarrito();
}

actualizarContador();

// === 3. VALIDACIÓN DEL FORMULARIO DE ADMIN ===
const formProducto = document.getElementById('formProducto');

if (formProducto) {
    formProducto.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let valid = true;

        const codigo = document.getElementById('codigo');
        const nombre = document.getElementById('nombre');
        const categoria = document.getElementById('categoria');

        const errorCodigo = document.getElementById('errorCodigo');
        const errorNombre = document.getElementById('errorNombre');
        const errorCategoria = document.getElementById('errorCategoria');
        const mensajeExito = document.getElementById('mensaje');

        errorCodigo.textContent = '';
        errorNombre.textContent = '';
        errorCategoria.textContent = '';
        mensajeExito.textContent = '';

        if (codigo.value.trim() === '') {
            errorCodigo.textContent = 'Ingrese el código.';
            valid = false;
        }
        if (nombre.value.trim() === '') {
            errorNombre.textContent = 'El nombre es obligatorio.';
            valid = false;
        }
        if (categoria.value === '') {
            errorCategoria.textContent = 'Seleccione una categoría.';
            valid = false;
        }

        if (valid) {
            mensajeExito.textContent = 'PRODUCTO AGREGADO AL INVENTARIO CON ÉXITO.';
            formProducto.reset(); 
        }
    });
}

// === 4. FUNCIONALIDAD DE FAVORITOS (CORAZONES) ===
const iconoFavoritos = document.getElementById('icono-favoritos');
if (iconoFavoritos) {
    iconoFavoritos.addEventListener('click', function() {
        window.location.href = 'favoritos.html';
    });
}

const corazonesProducto = document.querySelectorAll('.heart-icon');
corazonesProducto.forEach(corazon => {
    corazon.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        if (this.textContent === '🤍') {
            this.textContent = '❤️';
            this.style.color = '#d0021b';
        } else {
            this.textContent = '🤍';
            this.style.color = 'black';
        }
    });
});