import { z } from "zod";

export const verifyPaymentRequestPayloadDto = z.object({
  orderId: z.string().trim(),
  paymentId: z.string().trim(),
  signature: z.string().trim(),
});

export const VerifyPaymentRequestDto = verifyPaymentRequestPayloadDto;
export type VerifyPaymentRequestDto = z.infer<typeof verifyPaymentRequestPayloadDto>;
