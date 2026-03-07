"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_bus_1 = require("../event-bus");
const wallet_module_1 = require("../../wallet/wallet.module");
const auth_events_1 = require("../events/auth.events");
event_bus_1.eventBus.on(auth_events_1.authEvents.USER_REGISTERED, async (payload) => {
    try {
        await wallet_module_1.walletModule.walletService.createWallet(payload.userId, {
            currency: "INR",
        });
    }
    catch (error) {
        console.error("Wallet creation failed after user registration:", error);
    }
});
