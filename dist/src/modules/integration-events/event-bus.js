"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = void 0;
const node_events_1 = require("node:events");
exports.eventBus = new node_events_1.EventEmitter();
exports.eventBus.setMaxListeners(20);
