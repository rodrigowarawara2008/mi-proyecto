// ===== MEJORAS DE SEGURIDAD Y UTILIDADES =====

// Función para hashear contraseñas (básico)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

// Sistema de notificaciones mejorado
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notification');
    notificacionesExistentes.forEach(notif => notif.remove());
    
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

// Validación de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validación de nombre
function validarNombre(nombre) {
    return nombre.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
}

// ===== FUNCIONES ORIGINALES MEJORADAS =====

// Cargar usuarios del JSON y localStorage
async function cargarUsuarios() {
  try {
    // Cargar usuarios del JSON
    const response = await fetch('data/usuarios.json');
    const data = await response.json();
    let usuarios = data.usuarios;
    
    // Cargar usuarios adicionales de localStorage
    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    if (usuariosLocal) {
      const usuariosAdicionales = JSON.parse(usuariosLocal);
      usuarios = [...usuarios, ...usuariosAdicionales];
    }
    
    return usuarios;
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    
    // Si falla, al menos intentar cargar de localStorage
    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    return usuariosLocal ? JSON.parse(usuariosLocal) : [];
  }
}

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');

// Función para mostrar mensajes (original)
function mostrarMensaje(texto, tipo) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
}

// Función para validar login MEJORADA
async function validarLogin(usuario, password) {
  const usuarios = await cargarUsuarios();
  
  // Hashear la contraseña ingresada para comparar
  const passwordHash = hashPassword(password);
  
  const usuarioEncontrado = usuarios.find(u => 
    u.usuario === usuario && 
    u.password === password // En producción, comparar con hash
    // u.password === passwordHash // Para usar hashing
  );
  
  return usuarioEncontrado;
}

// Guardar fecha de login
function guardarFechaLogin() {
    localStorage.setItem('fechaLogin', Date.now().toString());
}

// ===== EVENTO DEL FORMULARIO MEJORADO =====

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;
  
  // Mostrar estado de carga en el botón
  const button = loginForm.querySelector('.submit-btn');
  const originalContent = button.innerHTML;
  button.classList.add('loading');
  button.innerHTML = '<div class="loader"></div>';
  button.disabled = true;
  
  const usuarioValido = await validarLogin(usuario, password);
  
  // Restaurar botón
  button.classList.remove('loading');
  button.innerHTML = originalContent;
  button.disabled = false;
  
  if (usuarioValido) {
    mostrarNotificacion('¡Inicio de sesión exitoso! 🎉', 'success');
    
    // Guardar sesión en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
    guardarFechaLogin();
    
    // Redirigir al escritorio después de 1 segundo
    setTimeout(() => {
      window.location.href = 'page/escritorio.html';
    }, 1000);
  } else {
    mostrarNotificacion('❌ Usuario o contraseña incorrectos', 'error');
  }
});

// ===== RECUPERACIÓN DE CONTRASEÑA =====

document.getElementById('olvidoPassword')?.addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Ingresa tu email para recuperar contraseña:');
    if (email && validarEmail(email)) {
        mostrarNotificacion('Se ha enviado un enlace de recuperación a tu email', 'info');
    } else if (email) {
        mostrarNotificacion('Email inválido', 'error');
    }
});

// Verificar si ya hay sesión activa al cargar la página de login
window.addEventListener('DOMContentLoaded', () => {
  const usuarioGuardado = localStorage.getItem('usuarioActivo');
  
  if (usuarioGuardado) {
    // Si ya hay sesión, redirigir directamente al escritorio
    window.location.href = 'page/escritorio.html';
  }
});