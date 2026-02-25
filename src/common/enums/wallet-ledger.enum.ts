export enum transactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum referenceType {
  ORDER = "order",
  PAYMENT = "payment",
  REFUND = "refund",
  ADJUSTMENT = "adjustment",
  WALLET_TOPUP = "wallet_topup",
}

export enum transactionType {
  CREDIT = "credit",
  HOLD = "hold",
  DEBIT = "debit",
  RELEASE = "release",
  REFUND = "refund",
  ADJUSTMENT = "adjustment",
}

