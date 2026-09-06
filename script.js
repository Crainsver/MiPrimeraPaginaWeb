// FUNCIONALIDAD DEL BUSCADOR 
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


// FUNCIONALIDAD DEL CARRITO DE COMPRAS 
let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];

function actualizarContador() {
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        contadorElemento.textContent = carrito.length;
    }
}

// Configurar botones de "Añadir a la bolsa" en la tienda con talla obligatoria
const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', function() {
        // Encontrar el selector de talla dentro de la tarjeta actual
        const tarjeta = this.closest('.producto-card');
        const selector = tarjeta.querySelector('.selector-talla');
        
        let tallaSeleccionada = '';
        if (selector) {
            tallaSeleccionada = selector.value;
            if (tallaSeleccionada === '') {
                alert('⚠️ Por favor, selecciona una talla antes de continuar.');
                return; // Detiene la función
            }
        }

        const nombre = this.getAttribute('data-nombre');
        const precio = parseInt(this.getAttribute('data-precio'));
        
        // Se añade la talla al objeto del carrito
        carrito.push({ nombre, precio, talla: tallaSeleccionada });
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
            if (selector) selector.value = ''; // Resetea el selector
        }, 1500);
    });
});

// Funcionalidad de enviar al carrito al hacer clic en el icono de la bolsa
const iconoBolsa = document.getElementById('icono-bolsa');
if (iconoBolsa) {
    iconoBolsa.addEventListener('click', function() {
        window.location.href = 'carrito.html';
    });
}

// LÓGICA DEL CARRITO
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

// VALIDACIÓN DEL FORMULARIO DE ADMIN 
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

// FUNCIONALIDAD DE FAVORITOS (Corregida por 3ra vez)
let favoritos = JSON.parse(localStorage.getItem('favoritosStore')) || [];

// A. Lógica para guardar desde las páginas de la tienda (index.html, etc.)
// Usamos :not(.heart-favoritos) para que no choque con los corazones de la página de favoritos
const corazonesProducto = document.querySelectorAll('.heart-icon:not(.heart-favoritos)'); 
corazonesProducto.forEach(corazon => {
    const tarjeta = corazon.closest('.producto-card');
    const nombreProd = tarjeta.getAttribute('data-nombre');
    
    // Pintar corazones si ya estaban guardados al cargar la página
    if (favoritos.some(fav => fav.nombre === nombreProd)) {
        corazon.textContent = '❤️';
        corazon.style.color = '#d0021b';
    }

    corazon.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        const botonAgregar = tarjeta.querySelector('.btn-agregar-carrito');
        const precio = parseInt(botonAgregar.getAttribute('data-precio'));
        // Capturamos la ruta de la imagen para usarla en favoritos.html
        const imagenSrc = tarjeta.querySelector('img').src; 
        
        if (this.textContent === '🤍') {
            this.textContent = '❤️';
            this.style.color = '#d0021b';
            favoritos.push({ nombre: nombreProd, precio: precio, imagen: imagenSrc });
        } else {
            this.textContent = '🤍';
            this.style.color = 'black';
            favoritos = favoritos.filter(fav => fav.nombre !== nombreProd);
        }
        
        localStorage.setItem('favoritosStore', JSON.stringify(favoritos));
    });
});

// B. Lógica exclusiva para pintar y gestionar dentro de favoritos.html
const contenedorFavoritos = document.getElementById('contenedor-favoritos');
if (contenedorFavoritos) {
    function renderizarFavoritos() {
        contenedorFavoritos.innerHTML = '';
        favoritos = JSON.parse(localStorage.getItem('favoritosStore')) || [];

        if (favoritos.length === 0) {
            contenedorFavoritos.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666; font-weight: 600;">No tienes artículos guardados. ¡Explora la tienda y dales amor!</p>';
            return;
        }

        favoritos.forEach(fav => {
            const article = document.createElement('article');
            article.className = 'producto-card';
            article.setAttribute('data-nombre', fav.nombre);
            
            article.innerHTML = `
                <div class="img-container">
                    <span class="heart-icon heart-favoritos" style="color: #d0021b; cursor: pointer; z-index: 10;">❤️</span>
                    <img src="${fav.imagen}" alt="${fav.nombre}">
                </div>
                <div class="producto-info">
                    <h3>${fav.nombre}</h3>
                    <p class="precio">$${fav.precio.toLocaleString('es-CL')}</p>
                    <select class="selector-talla" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; font-size: 0.8rem; cursor: pointer;">
                        <option value="">Selecciona tu talla</option>
                        <option value="S">Talla S</option>
                        <option value="M">Talla M</option>
                        <option value="L">Talla L</option>
                        <option value="XL">Talla XL</option>
                    </select>
                    <button class="btn-agregar-carrito btn-mover-bolsa" data-nombre="${fav.nombre}" data-precio="${fav.precio}">Mover a la bolsa</button>
                </div>
            `;
            contenedorFavoritos.appendChild(article);
        });

        asignarEventosFavoritos();
    }

    function asignarEventosFavoritos() {
        // Evento 1: Mover al carrito
        const botonesMover = contenedorFavoritos.querySelectorAll('.btn-mover-bolsa');
        botonesMover.forEach(boton => {
            boton.addEventListener('click', function() {
                const tarjeta = this.closest('.producto-card');
                const selector = tarjeta.querySelector('.selector-talla');
                
                let tallaSeleccionada = '';
                if (selector) {
                    tallaSeleccionada = selector.value;
                    if (tallaSeleccionada === '') {
                        alert('⚠️ Por favor, selecciona una talla antes de moverlo a tu bolsa.');
                        return;
                    }
                }

                const nombre = this.getAttribute('data-nombre');
                const precio = parseInt(this.getAttribute('data-precio'));
                
                // Agregar al carrito
                let carrito = JSON.parse(localStorage.getItem('carritoStore')) || [];
                carrito.push({ nombre, precio, talla: tallaSeleccionada });
                localStorage.setItem('carritoStore', JSON.stringify(carrito));
                
                // Actualizar el número rojo de la bolsa arriba
                const contadorElemento = document.getElementById('contador-carrito');
                if (contadorElemento) contadorElemento.textContent = carrito.length;

                // Eliminar automáticamente de favoritos
                favoritos = favoritos.filter(fav => fav.nombre !== nombre);
                localStorage.setItem('favoritosStore', JSON.stringify(favoritos));
                
                // Refrescar la pantalla de favoritos
                renderizarFavoritos();
            });
        });

        // Evento 2: Quitar de favoritos apretando el corazón rojo
        const corazones = contenedorFavoritos.querySelectorAll('.heart-favoritos');
        corazones.forEach(corazon => {
            corazon.addEventListener('click', function() {
                const tarjeta = this.closest('.producto-card');
                const nombre = tarjeta.getAttribute('data-nombre');
                
                favoritos = favoritos.filter(fav => fav.nombre !== nombre);
                localStorage.setItem('favoritosStore', JSON.stringify(favoritos));
                
                renderizarFavoritos();
            });
        });
    }

    // Dibujar los favoritos al entrar a la página
    renderizarFavoritos();
}

// VALIDACIÓN DEL FORMULARIO DE REGISTRO CON ROL DE USUARIO

const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const nombre = document.getElementById('regNombre');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');

        const errorNombre = document.getElementById('errorRegNombre');
        const errorEmail = document.getElementById('errorRegEmail');
        const errorPassword = document.getElementById('errorRegPassword');
        const mensajeExito = document.getElementById('mensajeRegExito');

        if (errorNombre) errorNombre.textContent = '';
        if (errorEmail) errorEmail.textContent = '';
        if (errorPassword) errorPassword.textContent = '';
        if (mensajeExito) mensajeExito.textContent = '';

        let esValido = true;

        // Validar Nombre
        if (!nombre || nombre.value.trim() === '') {
            if (errorNombre) errorNombre.textContent = 'El nombre es obligatorio.';
            esValido = false;
        }

        // Validar Correo (@ y dominio)
        const emailVal = email ? email.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailVal === '') {
            if (errorEmail) errorEmail.textContent = 'El correo electrónico es obligatorio.';
            esValido = false;
        } else if (!emailRegex.test(emailVal)) {
            if (errorEmail) errorEmail.textContent = 'Ingresa un correo válido (ej: usuario@correo.com).';
            esValido = false;
        }

        // Validar Contraseña (mínimo 6 dígitos)
        if (!password || password.value.trim().length < 6) {
            if (errorPassword) errorPassword.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            esValido = false;
        }

        if (!esValido) return;

        // Éxito y Redirección a la Tienda
        localStorage.setItem('usuarioLogueado', nombre.value.trim());
        if (mensajeExito) {
            mensajeExito.style.color = '#008a00';
            mensajeExito.textContent = '¡CUENTA CREADA CON ÉXITO! Redirigiendo a la tienda...';
        }
        formRegistro.reset(); 
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}


// INICIO DE SESIÓN / MODO ADMIN desde (perfil.html) ===
const formPerfil = document.getElementById('formPerfil');

if (formPerfil) {
    formPerfil.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const errorEmail = document.getElementById('errorLoginEmail');
        const errorPassword = document.getElementById('errorLoginPassword');
        const mensajeExito = document.getElementById('mensajeLoginExito');

        if (errorEmail) errorEmail.textContent = '';
        if (errorPassword) errorPassword.textContent = '';
        if (mensajeExito) mensajeExito.textContent = '';

        let esValido = true;
        const emailVal = email ? email.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validar formato de correo
        if (emailVal === '') {
            if (errorEmail) errorEmail.textContent = 'Ingresa tu correo electrónico.';
            esValido = false;
        } else if (!emailRegex.test(emailVal)) {
            if (errorEmail) errorEmail.textContent = 'El correo debe incluir @ y un dominio (ej: correo@gmail.com).';
            esValido = false;
        }

        // Validar contraseña
        if (!password || password.value.trim().length < 6) {
            if (errorPassword) errorPassword.textContent = 'Ingresa tu contraseña (mínimo 6 caracteres).';
            esValido = false;
        }

        if (!esValido) return;

        const correoIngresado = emailVal.toLowerCase();

        // Si ingresa con el correo admin
        if (correoIngresado === 'admin@fitshark.com') {
            if (mensajeExito) {
                mensajeExito.style.color = '#008a00';
                mensajeExito.textContent = '¡MODO ADMINISTRADOR DETECTADO! Entrando al panel...';
            }
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            // Usuario normal
            const nombreExtraido = correoIngresado.split('@')[0];
            localStorage.setItem('usuarioLogueado', nombreExtraido);
            
            if (mensajeExito) {
                mensajeExito.style.color = '#008a00';
                mensajeExito.textContent = '¡SESIÓN INICIADA CON ÉXITO! Redirigiendo...';
            }
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}


