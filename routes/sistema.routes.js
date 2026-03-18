const express = require("express");
const sistemaController = require("../controllers/sistema.controller.js");
const router = express.Router();

// Middleware para inicializar o banco de dados
router.use(sistemaController.inicializarBanco);

// Rota principal - página inicial
router.get("/", sistemaController.paginaInicial);

// Rotas para veículos
router.post("/veiculos/cadastrar", sistemaController.cadastrarVeiculo);
router.get("/veiculos", sistemaController.listarVeiculos);
router.get("/veiculos/buscar", sistemaController.buscarVeiculo);
router.put("/veiculos/:id/saida", sistemaController.registrarSaida);
router.delete("/veiculos/:id", sistemaController.deletarVeiculo);

// Rota para histórico
router.get("/historico", sistemaController.mostrarHistorico);

module.exports = router;

