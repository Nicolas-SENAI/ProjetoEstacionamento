const db = require("../db/dbConnect");

class Sistema {
  // Criar tabela de estacionamento se não existir
  static async criarTabela() {
    const query = `
      CREATE TABLE IF NOT EXISTS estacionamento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        placa VARCHAR(10) NOT NULL UNIQUE,
        modelo VARCHAR(100) NOT NULL,
        cor VARCHAR(50),
        data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        data_saida DATETIME DEFAULT NULL,
        valor DECIMAL(10, 2) DEFAULT 0.00
      )
    `;
    return db.executarQuery(query);
  }

  // Inserir novo veículo (entrada)
  static async inserirVeiculo(placa, modelo, cor) {
    const query = `
      INSERT INTO estacionamento (placa, modelo, cor, data_entrada)
      VALUES (?, ?, ?, NOW())
    `;
    return db.executarQuery(query, [placa, modelo, cor]);
  }

  // Listar todos os veículos
  static async listarVeiculos() {
    const query = 'SELECT * FROM estacionamento ORDER BY data_entrada DESC';
    return db.executarQuery(query);
  }

  // Listar veículos estacionados (sem saída)
  static async listarVeiculosEstacionados() {
    const query = 'SELECT * FROM estacionamento WHERE data_saida IS NULL ORDER BY data_entrada DESC';
    return db.executarQuery(query);
  }

  // Buscar veículo por placa
  static async buscarPorPlaca(placa) {
    const query = 'SELECT * FROM estacionamento WHERE placa = ?';
    return db.executarQuery(query, [placa]);
  }

  // Buscar veículo por ID
  static async buscarPorId(id) {
    const query = 'SELECT * FROM estacionamento WHERE id = ?';
    return db.executarQuery(query, [id]);
  }

  // Registrar saída do veículo e calcular valor
  static async registrarSaida(id) {
    // Primeiro busca o veículo para calcular o valor
    const veiculos = await this.buscarPorId(id);
    if (veiculos.length === 0) {
      throw new Error('Veículo não encontrado');
    }

    const veiculo = veiculos[0];
    if (veiculo.data_saida) {
      throw new Error('Veículo já possui saída registrada');
    }

    // Calcular valor (R$ 10,00 por hora ou fração)
    const dataEntrada = new Date(veiculo.data_entrada);
    const dataSaida = new Date();
    const horas = Math.ceil((dataSaida - dataEntrada) / (1000 * 60 * 60)); // Arredonda para cima
    const valor = Math.max(horas * 10, 10); // Mínimo R$ 10,00

    const query = `
      UPDATE estacionamento 
      SET data_saida = NOW(), valor = ? 
      WHERE id = ?
    `;
    return db.executarQuery(query, [valor, id]);
  }

  // Deletar veículo
  static async deletarVeiculo(id) {
    const query = 'DELETE FROM estacionamento WHERE id = ?';
    return db.executarQuery(query, [id]);
  }

  // Histórico completo (com saídas)
  static async historico() {
    const query = 'SELECT * FROM estacionamento WHERE data_saida IS NOT NULL ORDER BY data_saida DESC';
    return db.executarQuery(query);
  }
}

module.exports = Sistema;

