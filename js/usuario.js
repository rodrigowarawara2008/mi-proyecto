// Variables globales
const modal = document.getElementById('modalRegistro');
const btnAbrirModal = document.getElementById('btnAbrirModal');
const btnCerrarModal = document.querySelector('.close');
const btnCancelar = document.getElementById('btnCancelar');
const registroForm = document.getElementById('registroForm');

// Cargar todos los usuarios
async function cargarTodosUsuarios() {
  try {
    const response = await fetch('../data/usuarios.json');
    const data = await response.json();
    let usuarios = data.usuarios.map(u => ({...u, origen: 'JSON'}));

    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    if (usuariosLocal) {
      const usuariosAdicionales = JSON.parse(usuariosLocal).map(u => ({...u, origen: 'LocalStorage'}));
      usuarios = [...usuarios, ...usuariosAdicionales];
    }
    return usuarios;
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    return [];
  }
}

// Mostrar usuarios en la tabla
async function mostrarUsuarios() {
  const usuarios = await cargarTodosUsuarios();
  const tbody = document.getElementById('tablaUsuariosBody');
  tbody.innerHTML = '';

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(u => u.rol === 'admin').length;
  const totalRegulares = usuarios.filter(u => u.rol === 'usuario').length;

  document.getElementById('totalUsuarios').textContent = totalUsuarios;
  document.getElementById('totalAdmins').textContent = totalAdmins;
  document.getElementById('totalRegulares').textContent = totalRegulares;

  usuarios.forEach(usuario => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td><strong>${usuario.usuario}</strong></td>
      <td>${usuario.nombre}</td>
      <td><span class="badge badge-${usuario.rol}">${usuario.rol.toUpperCase()}</span></td>
      <td><span class="badge badge-${usuario.origen === 'JSON' ? 'json' : 'local'}">${usuario.origen}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para generar ID único
function generarId() {
  const usuariosLocal = localStorage.getItem('usuariosAdicionales');
  if (usuariosLocal) {
    const usuarios = JSON.parse(usuariosLocal);
    const maxId = Math.max(...usuarios.map(u => u.id), 3);
    return maxId + 1;
  }
  return 4;
}

// Función para verificar si el usuario ya existe
async function usuarioExiste(nombreUsuario) {
  const usuarios = await cargarTodosUsuarios();
  return usuarios.some(u => u.usuario === nombreUsuario);
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
  const mensajeDiv = document.getElementById('mensaje');
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;
  mensajeDiv.style.display = 'block';
  setTimeout(() => {
    mensajeDiv.style.display = 'none';
  }, 5000);
}

// Función para registrar usuario
async function registrarUsuario(datosUsuario) {
  try {
    let usuariosAdicionales = [];
    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    if (usuariosLocal) {
      usuariosAdicionales = JSON.parse(usuariosLocal);
    }

    usuariosAdicionales.push(datosUsuario);
    localStorage.setItem('usuariosAdicionales', JSON.stringify(usuariosAdicionales));
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return false;
  }
}

// Abrir modal
function abrirModal() {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Cerrar modal
function cerrarModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  registroForm.reset();
  const msg = document.getElementById('mensaje');
  if (msg) msg.style.display = 'none';
}

// Event Listeners del modal
btnAbrirModal.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

// Cerrar modal al hacer click fuera de él
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    cerrarModal();
  }
});

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    cerrarModal();
  }
});

// Manejo del formulario de registro
registroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;
  const confirmarPassword = document.getElementById('confirmarPassword').value;
  const rol = document.getElementById('rol').value;

  if (password !== confirmarPassword) {
    mostrarMensaje('❌ Las contraseñas no coinciden', 'error');
    return;
  }
  if (password.length < 6) {
    mostrarMensaje('❌ La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  if (usuario.length < 4) {
    mostrarMensaje('❌ El usuario debe tener al menos 4 caracteres', 'error');
    return;
  }

  const existe = await usuarioExiste(usuario);
  if (existe) {
    mostrarMensaje('❌ El nombre de usuario ya está en uso', 'error');
    return;
  }

  const nuevoUsuario = {
    id: generarId(),
    usuario: usuario,
    password: password,
    nombre: nombre,
    rol: rol
  };

  const registrado = await registrarUsuario(nuevoUsuario);
  if (registrado) {
    mostrarMensaje('✅ Usuario registrado exitosamente', 'exito');
    await mostrarUsuarios();
    setTimeout(() => {
      cerrarModal();
    }, 1500);
  } else {
    mostrarMensaje('❌ Error al registrar usuario. Intenta de nuevo.', 'error');
  }
});

// Verificar sesión
function verificarSesion() {
  const usuarioGuardado = localStorage.getItem('usuarioActivo');
  if (!usuarioGuardado) {
    window.location.href = '../index.html';
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../index.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  mostrarUsuarios();
  document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
});
