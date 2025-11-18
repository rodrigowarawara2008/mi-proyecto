// Función para generar ID único
function generarId() {
  const usuariosLocal = localStorage.getItem('usuariosAdicionales');
  if (usuariosLocal) {
    const usuarios = JSON.parse(usuariosLocal);
    const maxId = Math.max(...usuarios.map(u => u.id), 3); // 3 es el último ID del JSON
    return maxId + 1;
  }
  return 4; // Primer ID para usuarios adicionales
}

// Función para verificar si el usuario ya existe
async function usuarioExiste(nombreUsuario) {
  try {
    // Verificar en JSON
    const response = await fetch('../data/usuarios.json');
    const data = await response.json();
    const existeEnJson = data.usuarios.some(u => u.usuario === nombreUsuario);
    
    if (existeEnJson) return true;
    
    // Verificar en localStorage
    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    if (usuariosLocal) {
      const usuarios = JSON.parse(usuariosLocal);
      return usuarios.some(u => u.usuario === nombreUsuario);
    }
    
    return false;
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    return false;
  }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
  const mensajeDiv = document.getElementById('mensaje');
  mensajeDiv.textContent = texto;
  mensajeDiv.className = `mensaje ${tipo}`;

  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    mensajeDiv.style.display = 'none';
  }, 5000);
}

// Función para registrar usuario
async function registrarUsuario(datosUsuario) {
  try {
    // Obtener usuarios existentes de localStorage
    let usuariosAdicionales = [];
    const usuariosLocal = localStorage.getItem('usuariosAdicionales');
    
    if (usuariosLocal) {
      usuariosAdicionales = JSON.parse(usuariosLocal);
    }
    
    // Agregar nuevo usuario
    usuariosAdicionales.push(datosUsuario);
    
    // Guardar en localStorage
    localStorage.setItem('usuariosAdicionales', JSON.stringify(usuariosAdicionales));
    
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return false;
  }
}

// Event Listener del formulario
document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;
  const confirmarPassword = document.getElementById('confirmarPassword').value;
  const rol = document.getElementById('rol').value;

  // Validaciones
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

  // Verificar si el usuario ya existe
  const existe = await usuarioExiste(usuario);
  if (existe) {
    mostrarMensaje('❌ El nombre de usuario ya está en uso', 'error');
    return;
  }

  // Crear objeto usuario
  const nuevoUsuario = {
    id: generarId(),
    usuario: usuario,
    password: password,
    nombre: nombre,
    rol: rol,
    fechaRegistro: new Date().toISOString().split('T')[0],
    activo: true
  };

  // Registrar usuario
  const registrado = await registrarUsuario(nuevoUsuario);

  if (registrado) {
    mostrarMensaje('✅ Usuario registrado exitosamente. Redirigiendo...', 'exito');
    
    // Limpiar formulario
    document.getElementById('registroForm').reset();
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 2000);
  } else {
    mostrarMensaje('❌ Error al registrar usuario. Intenta de nuevo.', 'error');
  }
});