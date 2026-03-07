import { registerAuthListeners } from "./listeners/auth.listeners";

let listenersInitialized = false;

export const initializeIntegrationEventListeners = (): void => {
  if (listenersInitialized) return;

  registerAuthListeners();
  listenersInitialized = true;
  console.log("Event Emitter running fine!...");
};