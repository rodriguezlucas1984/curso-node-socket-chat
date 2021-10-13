const { comprobarJWT } = require("../helpers");

const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();
const socketController = async (socket, io) => {
  //console.log("Cliente conectado", socket.id);
  const token = socket.handshake.headers["x-token"];
  const usuario = await comprobarJWT(token);
  if (!usuario) {
    return socket.disconnect();
  }
  //Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  socket.emit("recibir-mensaje", chatMensajes.utimosUsuarios10);

  //Conectar a una sala especial
  socket.join(usuario.id); //global, socket.id, usuario.id

  //Limpiar el usuario desconectado
  socket.on("disconnect", () => {
    chatMensajes.desconetarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  //Envio de mensaje
  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      //Mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
      io.emit("recibir-mensaje", chatMensajes.utimosUsuarios10);
    }
  });
};

module.exports = {
  socketController,
};
