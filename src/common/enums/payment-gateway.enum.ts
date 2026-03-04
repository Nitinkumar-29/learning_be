export enum paymentProviderEnums {
  RAZORPAY = "razorpay",
  PAYU = "payu",
  STRIPE = "stripe",
}

export enum paymentModeEnums {
  UPI = "upi",
  INTERNET_BANKING = "internet_banking",
  OTHER = "other",
}

export enum paymentOrderStatusEnums {
  ORDER_INITIATED = "order_initiated",
  ORDER_PROCESSING = "order_processing",
  ORDER_CREATED = "order_created",
  ORDER_FAILED = "order_failed",
  ORDER_COMPLETED = "order_completed",
  ORDER_EXPIRED = "order_expired",
}

export enum paymentTransactionStatusEnums {
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_SUCCESS = "payment_success",
  PAYMENT_FAILED = "payment_failed",
}

export enum paymentLogStageEnums {
  REQUEST = "request",
  RESPONSE = "response",
}

export enum paymentLogStatusEnums {
  PENDING = "pending",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum paymentEntityTypeEnums {
  ORDER = "order",
  TRANSACTION = "transaction",
}

export enum paymentLogOperationEnums {
  CREATE_ORDER = "create_order",
  FETCH_PAYMENT_STATUS = "fetch_payment_status",
  VERIFY_WEBHOOK = "verify_webhook",
  CREATE_TRANSACTION = "create_transaction",
}

export enum paymentEventEnums {
  ORDER_INITIATED = "order_initiated",
  ORDER_CREATION_REQUESTED = "order_creation_requested",
  ORDER_CREATED = "order_created",
  ORDER_CREATION_FAILED = "order_creation_failed",

  TRANSACTION_CREATED = "transaction_created",

  PAYMENT_PENDING = "payment_pending",
  PAYMENT_FAILED = "payment_failed",
  PAYMENT_SUCCESS = "payment_success",

  WEBHOOK_RECEIVED = "webhook_received",
}
