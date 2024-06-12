import _ from "lodash";

const DB_NAME = "eshop_mui_off";
const offlineProdutoDbName = "offlineProdutoStore";
const offlineCategoriaDbName = "offlineCategoriaStore";

// Função para inicializar o banco de dados
const initDB = async () => {
  if (!localStorage.getItem(offlineProdutoDbName)) {
    localStorage.setItem(offlineProdutoDbName, JSON.stringify([]));
  }
  if (!localStorage.getItem(offlineCategoriaDbName)) {
    localStorage.setItem(offlineCategoriaDbName, JSON.stringify([]));
  }
};

// Função para adicionar um produto offline
const addProdutoOffline = async (produto) => {
  const produtos = JSON.parse(localStorage.getItem(offlineProdutoDbName)) || [];
  if (!produto.codigo) {
    const maiorCodigoDoOffline = Math.max(...produtos.map((p) => p.codigo), 0);
    console.log("Maior código do offline: ");
    console.log(maiorCodigoDoOffline);
    produto.codigo = 0;
    if (maiorCodigoDoOffline < 9000) produto.codigo = 9000;

    produto.codigo = produto.codigo + maiorCodigoDoOffline + 1;
  }
  produtos.push(produto);
  localStorage.setItem(offlineProdutoDbName, JSON.stringify(produtos));
  return produto;
};

// Função para obter todos os produtos offline
const getProdutosOffline = async () => {
  return JSON.parse(localStorage.getItem(offlineProdutoDbName)) || [];
};

// Função para obter um único produto offline pelo código
const getOneProdutosOffline = async (codigo) => {
  const produtos = JSON.parse(localStorage.getItem(offlineProdutoDbName)) || [];
  return produtos.find((produto) => +produto.codigo === +codigo);
};

// Função para atualizar um produto offline
const updateProdutoOffline = async (codigo, produto) => {
  const produtos = JSON.parse(localStorage.getItem(offlineProdutoDbName)) || [];
  const index = produtos.findIndex((p) => p.codigo === codigo);
  if (index !== -1) {
    produtos[index] = { ...produto, codigo };
    localStorage.setItem(offlineProdutoDbName, JSON.stringify(produtos));
  }
};

// Função para deletar um produto offline pelo código
const deleteProdutoOffline = async (codigo) => {
  const produtos = JSON.parse(localStorage.getItem(offlineProdutoDbName)) || [];
  const updatedProdutos = produtos.filter((p) => p.codigo !== codigo);
  localStorage.setItem(offlineProdutoDbName, JSON.stringify(updatedProdutos));
};

// Função para encontrar diferenças entre produtos offline e online
const findDifferences = (offlineProdutos, onlineProdutos) => {
  const differences = [];

  offlineProdutos.forEach((offlineProduto) => {
    const onlineProduto = onlineProdutos.find(
      (op) => op.codigo === offlineProduto.codigo
    );

    if (!onlineProduto) {
      differences.push({ offlineProduto, onlineProduto: null });
      return;
    }

    const diff = _.reduce(
      offlineProduto,
      (result, value, key) => {
        if (!_.isEqual(value, onlineProduto[key])) {
          result[key] = { offline: value, online: onlineProduto[key] };
        }
        return result;
      },
      {}
    );

    if (Object.keys(diff).length > 0) {
      differences.push({ offlineProduto, onlineProduto, diff });
    }
  });

  // Check for products that are online but not offline
  onlineProdutos.forEach((onlineProduto) => {
    const offlineProduto = offlineProdutos.find(
      (op) => op.codigo === onlineProduto.codigo
    );
    if (!offlineProduto) {
      differences.push({ offlineProduto: null, onlineProduto });
    }
  });

  return differences;
};

export const LocalStorageDB = {
  initDB,
  addProdutoOffline,
  getOneProdutosOffline,
  getProdutosOffline,
  updateProdutoOffline,
  deleteProdutoOffline,
  findDifferences,
};
