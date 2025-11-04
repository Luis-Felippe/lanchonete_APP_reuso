// Simple Event Bus to decouple modules (Observer pattern)
const EventEmitter = require('events');

class EventBus extends EventEmitter {}

module.exports = new EventBus();
