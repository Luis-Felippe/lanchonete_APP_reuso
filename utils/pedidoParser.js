// Adapter: parse form strings into domain objects for Pedido

function parseDescricao(descricaoPedido) {
  const result = [];
  if (!descricaoPedido) return result;
  const partesPedido = descricaoPedido.split(';');
  let cont = 1;
  for (const auxPedido of partesPedido) {
    if (!auxPedido) continue;
    const parte = auxPedido.split('\\');
    const auxDescricao = {
      idDescricao: cont,
      idLanche: parte[0],
      nomeLanche: parte[1],
      tipoDePao: parte[2],
      subtotal: parte[3],
      quantidade: parte[4],
    };
    if (parte[5]) auxDescricao.observacoes = parte[5];
    result.push(auxDescricao);
    cont += 1;
  }
  return result;
}

function parseExtras(extraPedido) {
  const result = [];
  if (!extraPedido) return result;
  const parts = extraPedido.split('\\');
  let cont = 1;
  for (const p of parts) {
    if (!p) continue;
    const kv = p.split('&');
    result.push({ idExtra: cont, extra: kv[0], valorExtra: parseFloat(kv[1]) });
    cont += 1;
  }
  return result;
}

module.exports = { parseDescricao, parseExtras };
