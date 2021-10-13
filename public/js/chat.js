//Referencias HTML
const txtUid = document.getElementById("txtUid");
const txtMensaje = document.getElementById("txtMensaje");
const ulUsuarios = document.getElementById("ulUsuarios");
const ulMensajes = document.getElementById("ulMensajes");
const btnSalir = document.getElementById("btnSalir");

let usuario = null;
let socket = null;

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://node-curso-socket-chat-2021.herokuapp.com/api/auth/";

//Validar el token desde el localStorage
const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const res = await fetch(url, {
    headers: { "x-token": token },
  });
  const { usuario: userDB, token: tokenDB } = await res.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.nombre;
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Socket online");
  });
  socket.on("disconnect", () => {
    console.log("Socket offline");
  });
  socket.on("recibir-mensaje", dibujarMensaje);
  socket.on("usuarios-activos", dibujarUsuarios);
  socket.on("mensaje-privado", (payload) => {
    console.log("Privado:", payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
        <li>
          <p>
            <h5 class="text-sucess"> ${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
          </p>
        </li>
      `;
  });

  ulUsuarios.innerHTML = usersHtml;
};

const dibujarMensaje = (mensajes = []) => {
  let mensajesHtml = "";
  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHtml += `
        <li>
          <p>
            <span class="text-sucess"> ${nombre}</span>
            <span>${mensaje}</span>
          </p>
        </li>
      `;
  });

  ulMensajes.innerHTML = mensajesHtml;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;
  if (keyCode !== 13) {
    return;
  }
  if (mensaje.length === 0) {
    return;
  }

  socket.emit("enviar-mensaje", { uid, mensaje });
  txtMensaje.value = "";
});

btnSalir.addEventListener("click", () => {
  localStorage.removeItem("token");

  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log("User signed out.");
    window.location = "index.html";
  });
});

const main = async () => {
  //Validar JWT
  await validarJWT();
};

(() => {
  gapi.load("auth2", () => {
    gapi.auth2.init();
    main();
  });
})();
//main();
//const socket = io();
