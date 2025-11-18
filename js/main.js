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

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
}

// Función para validar login
async function validarLogin(usuario, password) {
  const usuarios = await cargarUsuarios();
  
  const usuarioEncontrado = usuarios.find(
    u => u.usuario === usuario && u.password === password
  );
  
  return usuarioEncontrado;
}

// Evento del formulario
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;
  
  const usuarioValido = await validarLogin(usuario, password);
  
  if (usuarioValido) {
    mostrarMensaje('¡Inicio de sesión exitoso! 🎉', 'exito');
    
    // Guardar sesión en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
    
    // Redirigir al escritorio después de 1 segundo
    setTimeout(() => {
      window.location.href = 'page/escritorio.html';
    }, 1000);
  } else {
    mostrarMensaje('❌ Usuario o contraseña incorrectos', 'error');
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