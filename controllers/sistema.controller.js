const sistemaModel = require("../models/sistema.models");

// Criar tabela ao iniciar (opcional)
const inicializarBanco = async (req, res, next) => {
  try {
    await sistemaModel.criarTabela();
    console.log('Tabela estacionamento verificada/criada com sucesso!');
    next();
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
    next(err);
  }
};

// Cadastrar novo veículo (entrada)
const cadastrarVeiculo = async (req, res) => {
  try {
    const { placa, modelo, cor } = req.body;

    if (!placa || !modelo) {
      const veiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: "Erro: Placa e Modelo são obrigatórios!",
        tipo: "erro",
        dados: veiculos,
        historico: false
      });
    }

    // Verificar se veículo já está estacionado
    const veiculoExistente = await sistemaModel.buscarPorPlaca(placa);
    if (veiculoExistente.length > 0 && !veiculoExistente[0].data_saida) {
      const veiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: `Erro: Veículo com placa ${placa} já está estacionado!`,
        tipo: "erro",
        dados: veiculos,
        historico: false
      });
    }

    await sistemaModel.inserirVeiculo(placa, modelo, cor || "");
    
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: `Veículo ${placa} estacionado com sucesso!`,
      tipo: "sucesso",
      dados: veiculos,
      historico: false
    });
  } catch (err) {
    console.error('Erro ao cadastrar veículo:', err);
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao cadastrar veículo: " + err.message,
      tipo: "erro",
      dados: veiculos,
      historico: false
    });
  }
};

// Listar todos os veículos estacionados
const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: `Total de veículos estacionados: ${veiculos.length}`,
      tipo: "info",
      dados: veiculos,
      historico: false
    });
    
  } catch (err) {
    console.error('Erro ao listar veículos:', err);
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao listar veículos",
      tipo: "erro",
      dados: [],
      historico: false
    });
  }
};

// Buscar veículo por placa
const buscarVeiculo = async (req, res) => {
  try {
    const { placa } = req.query;

    if (!placa) {
      const veiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: "Informe a placa para buscar",
        tipo: "erro",
        dados: veiculos,
        historico: false
      });
    }

    const veiculos = await sistemaModel.buscarPorPlaca(placa);
    
    if (veiculos.length === 0) {
      const listaVeiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: `Nenhum veículo encontrado com placa ${placa}`,
        tipo: "erro",
        dados: listaVeiculos,
        historico: false
      });
    }

    res.render("index", {
      title: "Estacionamento",
      mensagem: `Veículo encontrado:`,
      tipo: "sucesso",
      dados: veiculos,
      historico: false
    });
  } catch (err) {
    console.error('Erro ao buscar veículo:', err);
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao buscar veículo",
      tipo: "erro",
      dados: veiculos,
      historico: false
    });
  }
};

// Registrar saída do veículo
const registrarSaida = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const veiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: "ID do veículo não informado",
        tipo: "erro",
        dados: veiculos,
        historico: false
      });
    }

    await sistemaModel.registrarSaida(id);

    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Saída registrada com sucesso!",
      tipo: "sucesso",
      dados: veiculos,
      historico: false
    });
  } catch (err) {
    console.error('Erro ao registrar saída:', err);
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao registrar saída: " + err.message,
      tipo: "erro",
      dados: veiculos,
      historico: false
    });
  }
};

// Deletar veículo
const deletarVeiculo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const veiculos = await sistemaModel.listarVeiculosEstacionados();
      return res.render("index", {
        title: "Estacionamento",
        mensagem: "ID do veículo não informado",
        tipo: "erro",
        dados: veiculos,
        historico: false
      });
    }

    await sistemaModel.deletarVeiculo(id);

    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Veículo removido com sucesso!",
      tipo: "sucesso",
      dados: veiculos,
      historico: false
    });
  } catch (err) {
    console.error('Erro ao deletar veículo:', err);
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao deletar veículo: " + err.message,
      tipo: "erro",
      dados: [],
      historico: false
    });
  }
};

// Mostrar histórico
const mostrarHistorico = async (req, res) => {
  try {
    const historico = await sistemaModel.historico();
    res.render("index", {
      title: "Histórico",
      mensagem: `Total de registros: ${historico.length}`,
      tipo: "info",
      dados: historico,
      historico: true
    });
  } catch (err) {
    console.error('Erro ao mostrar histórico:', err);
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao carregar histórico",
      tipo: "erro",
      dados: [],
      historico: true
    });
  }
};

// Página inicial
const paginaInicial = async (req, res) => {
  try {
    const veiculos = await sistemaModel.listarVeiculosEstacionados();
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Sistema de Estacionamento",
      tipo: "info",
      dados: veiculos,
      historico: false
    });
  } catch (err) {
    console.error('Erro na página inicial:', err);
    res.render("index", {
      title: "Estacionamento",
      mensagem: "Erro ao carregar dados",
      tipo: "erro",
      dados: [],
      historico: false
    });
  }
};

module.exports = {
  inicializarBanco,
  cadastrarVeiculo,
  listarVeiculos,
  buscarVeiculo,
  registrarSaida,
  deletarVeiculo,
  mostrarHistorico,
  paginaInicial
};

