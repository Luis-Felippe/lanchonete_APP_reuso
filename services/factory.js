// Simple Factory for creating domain objects (Factory pattern)

function createReceita({ data, descricao, tipo, valor }) {
  return { data, descricao, tipo, valor };
}

module.exports = {
  createReceita,
};
