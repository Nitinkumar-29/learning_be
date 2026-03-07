"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeIntegrationEventListeners = void 0;
let listenersInitialized = false;
const initializeIntegrationEventListeners = () => {
    if (listenersInitialized) {
        return;
    }
    // Side-effect import that registers auth event listeners once.
    require("./listeners/auth.listeners");
    listenersInitialized = true;
};
exports.initializeIntegrationEventListeners = initializeIntegrationEventListeners;
