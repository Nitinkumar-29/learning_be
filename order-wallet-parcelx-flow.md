# Order, Wallet, Queue, and ParcelX Integration Flow

This document defines the full production flow for order creation when wallet charging is involved and the provider call is asynchronous via queue.

## 1. High-Level Objective

When an order is created from dashboard:
- Validate request
- Ensure user has sufficient funds
- Reserve funds safely
- Call ParcelX through queue worker
- Capture exact amount on success
- Release/refund on failure/cancellation/NDR
- Keep complete audit trail via wallet ledger and provider logs

## 2. Core Principle: Hold First, Capture Later

Do not directly deduct final amount at API request time.

Use this pattern:
1. `HOLD` amount (reservation)
2. Call provider asynchronously
3. On provider success, `CAPTURE/DEBIT`
4. On provider failure, **`RELEASE`*
5. On post-order events (cancel/RTO/NDR approved), `REFUND`

This avoids charging users for failed provider creation and keeps accounting clean.

## 3. Full End-to-End Flow

### Step A: Dashboard Request
1. Dashboard sends `POST /orders/create` with order payload and `idempotency_key`.
2. Backend validates input (Zod).
3. Backend checks duplicate idempotency request.

### Step B: Pre-Charge and Reservation
1. Estimate expected charge (shipping + tax + fee + optional buffer).
2. Check wallet `available_balance`.
3. If insufficient: return `402/400` (insufficient balance).
4. If sufficient:
- Create wallet ledger entry: `type=hold`, `status=success`
- Reduce `available_balance`
- Increase `hold_balance`

### Step C: Internal Order Creation
1. Create `order` with status `PENDING_PROVIDER`.
2. Save `hold_transaction_id` in order.
3. Write `order_event_log` (`request_received`, `wallet_hold_created`).
4. Enqueue job `create_provider_order` with order id + idempotency key.

### Step D: Queue Worker -> ParcelX
1. Worker picks job.
2. Save `provider_request_log` (sanitized request payload).
3. Call ParcelX order creation API.
4. Save `provider_response_log` (code + response body).

### Step E: Provider Success Path
1. If ParcelX confirms order:
- Save provider ids (`provider_order_id`, shipment/reference ids)
- Compute final charge (actual billed amount)
2. Convert hold into final debit:
- Ledger: `type=debit` against held amount
- Move funds from `hold_balance` to consumed
3. If held > final actual:
- Ledger: `type=refund` for difference
- Credit back to `available_balance`
4. Update order status to `CONFIRMED`.
5. Write order event logs.

### Step F: Provider Failure Path
1. If ParcelX rejects/fails after retries:
- Ledger: `type=release` for full held amount
- Move held amount back to `available_balance`
2. Update order status to `FAILED`.
3. Write failure event and reason.

### Step G: Post-Order Lifecycle (NDR/Cancel/RTO)
1. Webhook or polling updates shipment status.
2. If refund condition met (cancel, RTO, service failure, approved NDR policy):
- Ledger: `type=refund`
- Credit user wallet
3. Save event and provider status transition logs.

## 4. What Is Wallet Ledger?

Wallet ledger is an immutable transaction history table for all money movements.

Think of it as bank statement lines. Never overwrite old rows. Always append new rows.

Each wallet operation (hold/debit/release/refund/manual adjustment) must generate a ledger row with:
- amount
- type
- reference order
- status
- before and after balances
- idempotency key

Without ledger, reconciliation and dispute handling become unreliable.

## 5. Wallet Data Model

Use two related models:
1. `wallet` (current balances snapshot)
2. `wallet_ledger` (immutable money movements)
****
## 6. Suggested Wallet Schema

```ts
// wallet
{
  _id: ObjectId,
  userId: ObjectId,                 // unique
  currency: "INR",

  availableBalance: number,         // spendable
  holdBalance: number,              // reserved, not spendable

  totalDebited: number,             // optional analytics
  totalCredited: number,            // optional analytics

  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

Notes:
- `availableBalance + holdBalance` represents current stored value in wallet context.
- Do not store floating point money; use integer smallest unit (paise) if possible.

## 7. Suggested Wallet Ledger Schema

```ts
// wallet_ledger
{
  _id: ObjectId,
  walletId: ObjectId,
  userId: ObjectId,

  transactionType: "credit" | "hold" | "debit" | "release" | "refund" | "adjustment",
  transactionStatus: "pending" | "success" | "failed",

  amount: number,                   // integer paise recommended
  currency: "INR",

  balanceBefore: number,
  balanceAfter: number,
  holdBefore: number,
  holdAfter: number,

  referenceType: "order" | "shipment" | "ndr" | "manual",
  referenceId: string,              // internal order id etc.
  provider: "parcelx" | null,
  providerReferenceId: string | null,

  idempotencyKey: string,
  description: string,
  metadata: object,

  createdBy: ObjectId | null,       // admin/system/user
  createdAt: Date,
  updatedAt: Date,
}
```

Indexes to add:
- unique: `(userId, idempotencyKey)`
- index: `(referenceType, referenceId)`
- index: `(provider, providerReferenceId)`
- index: `(walletId, createdAt)`

## 8. Provider Logs Schema (Recommended)

```ts
// provider_request_log
{
  _id: ObjectId,
  provider: "parcelx",
  operation: "create_order" | "ndr" | "b2b" | "transaction",
  referenceId: string,              // internal order id
  idempotencyKey: string,
  requestPayload: object,           // sanitized
  attempt: number,
  queuedAt: Date,
  sentAt: Date,
  createdAt: Date,
}

// provider_response_log
{
  _id: ObjectId,
  requestLogId: ObjectId,
  provider: "parcelx",
  operation: string,
  referenceId: string,
  statusCode: number,
  success: boolean,
  responsePayload: object,
  errorCode: string | null,
  errorMessage: string | null,
  latencyMs: number,
  receivedAt: Date,
  createdAt: Date,
}
```

## 9. Transaction Boundaries (Important)

Use DB transaction/session when doing these combined updates:
- wallet snapshot update
- wallet ledger insert
- order status update

Critical sections:
1. Create hold + create order + enqueue marker
2. Capture/release + order final state
3. Refund + status transition

## 10. Idempotency Rules

Apply idempotency in two places:
1. API layer (`POST /orders/create`)
2. Worker/provider operation (`create_provider_order`)

If duplicate key appears:
- return existing order/transaction result
- do not create extra hold/debit/refund

## 11. Failure/Retry Strategy

Retry only transient errors:
- network timeout
- 5xx
- 429

Do not retry:
- validation errors
- auth failures
- permanent business rule failures

After retry exhaustion:
- release hold
- mark order failed
- write logs and reason code

## 12. Recommended Order Statuses

- `DRAFT`
- `PENDING_PROVIDER`
- `PROVIDER_RETRYING`
- `CONFIRMED`
- `FAILED`
- `CANCELLED`
- `REFUND_PENDING`
- `REFUNDED`

## 13. Minimal Implementation Sequence

1. Implement `wallet` + `wallet_ledger` schemas.
2. Implement wallet service methods:
- `checkSufficientBalance`
- `createHold`
- `captureHold`
- `releaseHold`
- `refund`
3. Implement order create API with idempotency.
4. Push provider create job to queue.
5. Build ParcelX worker and provider logs.
6. Add webhook endpoint and status reconciliation.
7. Add admin reconciliation report (order vs wallet vs provider).

## 14. Practical Decision for Your Question

When should money be deducted?

Answer:
- Before provider call: only hold after checking sufficient funds.
- After provider success: capture/debit actual charge.
- On provider failure: release hold.
- On cancellation/RTO/NDR refund case: create refund credit.

This is the safest and most scalable flow.
