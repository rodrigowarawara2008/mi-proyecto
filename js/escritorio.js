// ===== SISTEMA MEJORADO DE ESCRITORIO =====

// Verificar sesión con expiración
function verificarSesion() {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    const fechaLogin = localStorage.getItem('fechaLogin');
    
    if (!usuarioGuardado) {
        mostrarNotificacion('Sesión expirada. Redirigiendo al login...', 'warning');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return null;
    }
    
    // Verificar expiración (24 horas)
    if (fechaLogin && (Date.now() - parseInt(fechaLogin)) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('usuarioActivo');
        localStorage.removeItem('fechaLogin');
        mostrarNotificacion('Sesión expirada por inactividad', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return null;
    }
    
    return JSON.parse(usuarioGuardado);
}

// Cargar información del usuario
function cargarInfoUsuario() {
    const usuario = verificarSesion();
    
    if (usuario) {
        // Header
        document.getElementById('nombreUsuario').textContent = usuario.nombre;
        document.getElementById('rolUsuario').textContent = usuario.rol.toUpperCase();
        
        // Bienvenida
        document.getElementById('nombreUsuarioBienvenida').textContent = usuario.nombre;
        
        // Información de sesión
        document.getElementById('infoUsuario').textContent = usuario.usuario;
        document.getElementById('infoNombre').textContent = usuario.nombre;
        document.getElementById('infoRol').textContent = usuario.rol;
        document.getElementById('infoId').textContent = usuario.id;
        
        // Mostrar notificación de bienvenida
        setTimeout(() => {
            mostrarNotificacion(`Bienvenido ${usuario.nombre}`, 'success');
        }, 500);
    }
}

// Cerrar sesión
function cerrarSesion() {
    mostrarNotificacion('Cerrando sesión...', 'info');
    setTimeout(() => {
        localStorage.removeItem('usuarioActivo');
        localStorage.removeItem('fechaLogin');
        window.location.href = '../index.html';
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarInfoUsuario();
    
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', cerrarSesion);
});

// ===== FUNCIÓN DE NOTIFICACIÓN PARA ESCRITORIO =====
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}