import { eventBus } from "../event-bus";
import { walletModule } from "../../wallet/wallet.module";
import { authEvents } from "../events/auth.events";

type UserRegisteredPayload = {
  userId: string;
  email: string;
  role: string;
  occurredAt: Date;
};

export const registerAuthListeners = () => {
  eventBus.on(
    authEvents.USER_REGISTERED,
    async (payload: UserRegisteredPayload) => {
      try {
        await walletModule.walletService.createWallet(payload.userId, {
          currency: "INR",
        });
      } catch (error) {
        console.error("Wallet creation failed after user registration:", error);
      }
    },
  );
};
