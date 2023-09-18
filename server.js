const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileupload = require("express-fileupload");
const apiRoutes = require("./src/routes");
const path = require('path');

dotenv.config();

mongoose.connect(process.env.DATABASE,  {  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB conectado com sucesso");
  })
  .catch((error) => {
    console.log("erro na conexão com o mongo", error);
  });


mongoose.Promise = global.Promise;
mongoose.connection.on("error", () => {
  console.log("Erro: ", error.message);
});

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());

server.use(express.static(path.join(__dirname + '/public')));

server.use("/", apiRoutes);

server.listen(process.env.PORT || 80, () => {
  console.log(`porta ${process.env.PORT}`)
});
