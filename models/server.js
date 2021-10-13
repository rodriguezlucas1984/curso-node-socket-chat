const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      uploads: "/api/uploads",
      usuarios: "/api/usuarios",
    };

    //Conectar a base de datos
    this.conectarDB();
    //Middlewares
    this.middlewares();
    //Rutas de mi aplicación
    this.routes();

    //Sockets
    this.sockets();
  }
  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //Lectura y parseo del body
    this.app.use(express.json());
    //Directorio publico
    this.app.use(express.static("public"));
    //Fileupload - Carga de Archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
  }
  sockets() {
    this.io.on("connect", (socket) => socketController(socket, this.io));
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
