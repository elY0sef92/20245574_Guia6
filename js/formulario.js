const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

const idModal = document.getElementById("idModal");

const regexPatrones = {
  nombre: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,     
  dui: /^\d{8}-\d{1}$/,                    
  nit: /^\d{4}-\d{6}-\d{3}-\d{1}$/,        
  fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/, 
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,   
  edad: /^(1[01]?\d|120|[1-9]\d?)$/       
};


function validarConRegex(valor, tipo) {
  if (!regexPatrones[tipo]) return true;
  return regexPatrones[tipo].test(valor.trim());
}


function esFechaValida(dia, mes, año) {
  const fecha = new Date(año, mes - 1, dia);
  return (
    fecha.getFullYear() == año &&
    fecha.getMonth() == mes - 1 &&
    fecha.getDate() == dia
  );
}

let arrayPaciente = [];
let editIndex = -1;
const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";
  inputNombre.focus();
};

function cargarPacienteEnFormulario(idx) {
  const p = arrayPaciente[idx];
  inputNombre.value = p[0];
  inputApellido.value = p[1];
  inputFechaNacimiento.value = p[2];
  inputRdMasculino.checked = p[3] === "Hombre";
  inputRdFemenino.checked = p[3] === "Mujer";
  [...cmbPais.options].forEach(o => { if (o.text === p[4]) cmbPais.value = o.value; });
  inputDireccion.value = p[5];
  editIndex = idx;
  buttonAgregarPaciente.innerHTML = `<i class="bi bi-save"></i> Actualizar`;
  inputNombre.focus();
}

function eliminarPaciente(idx) {
  if (confirm("¿Eliminar este registro?")) {
    arrayPaciente.splice(idx, 1);
    imprimirPacientes();
    mensaje.innerHTML = "Paciente eliminado";
    toast.show();
    if (editIndex === idx) {
      editIndex = -1;
      buttonAgregarPaciente.innerHTML = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
      limpiarForm();
    }
  }
}

const addPaciente = function () {
  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();
  const fechaNacimiento = inputFechaNacimiento.value;
  const sexo = inputRdMasculino.checked ? "Hombre" : (inputRdFemenino.checked ? "Mujer" : "");
  const paisValue = cmbPais.value;
  const labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  const direccion = inputDireccion.value.trim();

  if (!nombre || !apellido || !fechaNacimiento || !sexo || paisValue == 0 || !direccion) {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
    return;
  }

  if (!validarConRegex(nombre, "nombre")) {
    mensaje.innerHTML = "El nombre contiene caracteres no permitidos (solo se permiten letras)";
    toast.show();
    return;
  }

  if (!validarConRegex(apellido, "nombre")) {
    mensaje.innerHTML = "El apellido contiene caracteres no permitidos (solo se permiten letras)";
    toast.show();
    return;
  }

  if (!validarConRegex(fechaNacimiento, "fecha")) {
    mensaje.innerHTML = "Formato de fecha inválido. Use dd/mm/yyyy (ej: 25/12/2005)";
    toast.show();
    return;
  }

  const partes = fechaNacimiento.split("/");
  if (partes.length === 3) {
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const año = parseInt(partes[2]);

    if (!esFechaValida(dia, mes, año)) {
      mensaje.innerHTML = "La fecha ingresada no es válida (verifique día y mes)";
      toast.show();
      return;
    }
  }

  const registro = [nombre, apellido, fechaNacimiento, sexo, labelPais, direccion];

  if (editIndex >= 0) {
    arrayPaciente[editIndex] = registro;
    editIndex = -1;
    buttonAgregarPaciente.innerHTML = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
    mensaje.innerHTML = "Paciente actualizado";
  } else {
    arrayPaciente.push(registro);
    mensaje.innerHTML = "Se ha registrado un nuevo paciente";
  }

  toast.show();
  limpiarForm();
  imprimirPacientes();
};

function imprimirFilas() {
  let fila = "";
  arrayPaciente.forEach((p, idx) => {
    fila += `
      <tr>
        <td scope="row" class="text-center fw-bold">${idx + 1}</td>
        <td>${p[0]}</td>
        <td>${p[1]}</td>
        <td>${p[2]}</td>
        <td>${p[3]}</td>
        <td>${p[4]}</td>
        <td>${p[5]}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary btn-sm btn-edit" data-index="${idx}" title="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm btn-delete" data-index="${idx}" title="Eliminar">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>`;
  });
  return fila;
}

const imprimirPacientes = () => {
  const html = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <tr>
          <th scope="col" class="text-center" style="width:5%">#</th>
          <th scope="col" class="text-center" style="width:15%">Nombre</th>
          <th scope="col" class="text-center" style="width:15%">Apellido</th>
          <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
          <th scope="col" class="text-center" style="width:10%">Sexo</th>
          <th scope="col" class="text-center" style="width:10%">País</th>
          <th scope="col" class="text-center" style="width:25%">Dirección</th>
          <th scope="col" class="text-center" style="width:10%">Opciones</th>
        </tr>
        ${imprimirFilas()}
      </table>
    </div>`;
  document.getElementById("idTablaPacientes").innerHTML = html;
  
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", function() {
      const idx = this.getAttribute("data-index");
      cargarPacienteEnFormulario(idx);
    });
  });
    document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", function() {
      const idx = this.getAttribute("data-index");
      eliminarPaciente(idx);
    });
  });
};

let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  const paisNew = inputNombrePais.value.trim();
  if (paisNew) {
    const option = document.createElement("option");
    option.textContent = paisNew;
    option.value = ++contadorGlobalOption;
    cmbPais.appendChild(option);

    mensaje.innerHTML = "País agregado correctamente";
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

buttonLimpiarPaciente.onclick = limpiarForm;
buttonAgregarPaciente.onclick = addPaciente;
buttonMostrarPaciente.onclick  = imprimirPacientes;
buttonAgregarPais.onclick      = addPais;

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});
