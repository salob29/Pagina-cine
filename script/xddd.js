// Inicializar AOS (Animaciones on Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Navbar transparente al scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Variables globales
let peliculaActual = '';
let precioBoleto = 0;
let asientosSeleccionados = [];

// FUNCIÓN: Seleccionar película con animación
function seleccionarPelicula(nombre, precio) {
    peliculaActual = nombre;
    precioBoleto = precio;
    
    document.getElementById('pelicula-seleccionada').textContent = nombre;
    document.getElementById('precio-boleto').textContent = precio.toLocaleString();
    
    // Animación de destacado
    const card = document.querySelector('.selected-movie-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'pulse 0.5s ease';
    }, 10);
    
    // Scroll suave
    document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
    
    // Generar asientos después de un momento
    setTimeout(generarAsientos, 500);
}

// FUNCIÓN: Generar asientos
function generarAsientos() {
    const grid = document.getElementById('asientos-grid');
    grid.innerHTML = '';
    asientosSeleccionados = [];
    
    const totalAsientos = 60;
    const asientosOcupados = [5, 12, 19, 27, 33, 41, 48];
    
    for (let i = 1; i <= totalAsientos; i++) {
        const asiento = document.createElement('div');
        asiento.className = 'seat';
        asiento.dataset.numero = i;
        
        // Animar entrada de asientos
        asiento.style.opacity = '0';
        asiento.style.transform = 'scale(0)';
        setTimeout(() => {
            asiento.style.transition = 'all 0.3s ease';
            asiento.style.opacity = '1';
            asiento.style.transform = 'scale(1)';
        }, i * 20);
        
        if (asientosOcupados.includes(i)) {
            asiento.classList.add('occupied');
        } else {
            asiento.classList.add('available');
            asiento.addEventListener('click', toggleAsiento);
        }
        
        grid.appendChild(asiento);
    }
    
    actualizarResumen();
}

// FUNCIÓN: Toggle asiento con sonido visual
function toggleAsiento(e) {
    const asiento = e.target;
    const numero = parseInt(asiento.dataset.numero);
    
    if (asiento.classList.contains('available')) {
        asiento.classList.remove('available');
        asiento.classList.add('selected');
        asientosSeleccionados.push(numero);
        
        // Efecto de "pop"
        asiento.style.transform = 'scale(1.2)';
        setTimeout(() => {
            asiento.style.transform = 'scale(1.05)';
        }, 150);
        
    } else if (asiento.classList.contains('selected')) {
        asiento.classList.remove('selected');
        asiento.classList.add('available');
        asientosSeleccionados = asientosSeleccionados.filter(a => a !== numero);
    }
    
    actualizarResumen();
}

// FUNCIÓN: Actualizar resumen
function actualizarResumen() {
    const cantidad = asientosSeleccionados.length;
    const total = cantidad * precioBoleto;
    
    document.getElementById('cantidad-asientos').textContent = cantidad;
    document.getElementById('total-pagar').textContent = total.toLocaleString();
}

// FUNCIÓN: Procesar compra con Sweet Alert simulado
function procesarCompra() {
    if (asientosSeleccionados.length === 0) {
        mostrarAlerta('error', '⚠️ Error', 'Por favor selecciona al menos un asiento');
        return;
    }
    
    if (!peliculaActual) {
        mostrarAlerta('error', '⚠️ Error', 'Por favor selecciona una película primero');
        return;
    }
    
    const total = asientosSeleccionados.length * precioBoleto;
    
    mostrarAlerta('success', '✅ Compra Exitosa', 
        `Película: ${peliculaActual}\n` +
        `Asientos: ${asientosSeleccionados.join(', ')}\n` +
        `Total: $${total.toLocaleString()}\n\n` +
        `¡Disfruta tu función!`
    );
    
    // Resetear después de 2 segundos
    setTimeout(() => {
        generarAsientos();
    }, 2000);
}

// FUNCIÓN: Mostrar alerta personalizada
function mostrarAlerta(tipo, titulo, mensaje) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alerta.style.position = 'fixed';
    alerta.style.top = '100px';
    alerta.style.right = '20px';
    alerta.style.zIndex = '9999';
    alerta.style.minWidth = '300px';
    alerta.style.animation = 'fadeInUp 0.5s ease';
    alerta.innerHTML = `
        <h5>${titulo}</h5>
        <p style="white-space: pre-line">${mensaje}</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}
// FUNCIÓN: Formulario de inscripción
document.getElementById('form-inscripcion').addEventListener('submit', function(e) {
    e.preventDefault();
    mostrarAlerta('success', '✅ ¡Bienvenido!', 'Gracias por unirte a nuestra membresía VIP. Recibirás todas las promociones en tu correo.');
    this.reset();
});
// Cerrar navbar en móvil al hacer click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});
