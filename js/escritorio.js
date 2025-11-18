// Verificar si hay sesión activa
function verificarSesion() {
  const usuarioGuardado = localStorage.getItem('usuarioActivo');
  if (!usuarioGuardado) {
    window.location.href = '../index.html';
    return null;
  }
  return JSON.parse(usuarioGuardado);
}

// Cargar información del usuario
function cargarInfoUsuario() {
  const usuario = verificarSesion();
  if (usuario) {
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
    document.getElementById('rolUsuario').textContent = usuario.rol.toUpperCase();
    document.getElementById('nombreUsuarioBienvenida').textContent = usuario.nombre;

    document.getElementById('infoUsuario').textContent = usuario.usuario;
    document.getElementById('infoNombre').textContent = usuario.nombre;
    document.getElementById('infoRol').textContent = usuario.rol;
    document.getElementById('infoId').textContent = usuario.id;
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../index.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  cargarInfoUsuario();
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  btnCerrarSesion.addEventListener('click', cerrarSesion);
});
