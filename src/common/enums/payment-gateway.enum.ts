export enum paymentProviderEnums {
  RAZORPAY = "razorpay",
  PAYU = "payu",
  STRIPE = "stripe",
}

export enum paymentModeEnums {
  UPI = "upi",
  INTERNET_BANKING = "internet banking",
  OTHER = "other",
}

export enum paymentOrderStatusEnums {
  ORDER_INITIATED = "order_initiated",
  ORDER_PROCESSING = "order_processing",
  ORDER_CREATED = "order_created",
  ORDER_FAILED = "order_failed",
}
