import Razorpay from "razorpay";
import { env } from "../env";
import { HttpError } from "../../common/errors/http.error";

// credentials
const razorpayKeyId = env.paymentProvider.paymentProviderKeyId;
const razorpayKeySecret = env.paymentProvider.paymentProviderKeySecret;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new HttpError(500, "Razorpay initialization failed");
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export { razorpay };
