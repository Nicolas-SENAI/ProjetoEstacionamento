const http = require("http");
const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();
require('dotenv').config()

//importação de rotas
const usuarioRoutes = require("./routes/sistema.routes");

// configurações iniciais
app.use(morgan('dev'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const porta = Number(process.env.PORTA)


//rotas de usuario
app.use("/", usuarioRoutes);

// Rota de erro
app.use((req, res) => {
  res.status(404).render("erro404");
});

app.listen(porta, () => {
    console.log('Servidor rodando');
    console.log('Endereco: http://localhost:'+porta);
});

