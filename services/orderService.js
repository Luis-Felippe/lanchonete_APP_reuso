// Domain service for Orders (applies Template Method and emits events)
const mongoose = require('mongoose');
require('../models/Pedido');
require('../models/Receita');
const Pedido = mongoose.model('pedidos');
const Receita = mongoose.model('receitas');
const eventBus = require('../events/eventBus');
const { adjustTimezone } = require('../utils/formatters');
const { createReceita } = require('./factory');

class BaseOrderService {
  // Template Method: process an order lifecycle
  async concludeOrder(orderId) {
    const order = await Pedido.findById(orderId).lean();
    if (!order) throw new Error('Pedido não encontrado');

    // Hook for pre-processing
    await this.beforeConclude(order);

    // Persist revenue (Factory will be used to create receita)
    const receitaData = this.createReceitaFromOrder(order);
    await new Receita(receitaData).save();

    // Update order status
    await Pedido.updateOne({ _id: orderId }, { $set: { status: true } });

    // Emit domain event
    eventBus.emit('order.concluded', { orderId, receita: receitaData });

    // Hook for post-processing
    await this.afterConclude(order);
    return { orderId, receita: receitaData };
  }

  // Hooks (can be overridden)
  async beforeConclude(order) {}
  async afterConclude(order) {}

  // Factory Method
  createReceitaFromOrder(order) {
    const data = order.data ? new Date(order.data) : adjustTimezone(new Date());
    return createReceita({
      data,
      descricao: `Venda de sanduíches - ${order.cliente}`,
      tipo: 1,
      valor: order.total,
    });
  }
}

module.exports = new BaseOrderService();
