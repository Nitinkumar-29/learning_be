# Backend OOPS Project Workflow

## 1. Project Goal

Build a scalable backend for order processing with:

- Auth/KYC/Wallet foundations
- Order creation and cancellation APIs
- Asynchronous ParcelX integration through BullMQ workers
- Reliable request/response logging for provider calls
- Idempotent behavior for repeated client requests

Primary objective: keep API responses fast while moving provider-heavy tasks to background workers with retry handling and audit logs.

## 2. Core Architecture

The project follows a modular service-repository pattern:

- `auth` module: authentication and user profile
- `kyc` module: KYC onboarding flows
- `wallet` module: wallet and ledger management
- `orders` module: order lifecycle and API endpoints
- `parcelx` module: provider mapping, API client, request/response logs, queue processors
- `bullmq` module: worker bootstrap and lifecycle

Persistence uses MongoDB (Mongoose), queue transport uses Redis (BullMQ).

## 3. High-Level Request Flow

### Order Create Flow

1. Client calls `POST /orders/create`.
2. Request is validated with Zod schema.
3. `OrderService`:
- checks idempotency with `userId + clientOrderId`
- creates internal order document
- enqueues `create-order` job in `parcelx-orders-queue`
4. API returns immediately (`201` for new, `200` for idempotent replay).
5. Worker picks job and calls `ParcelXOrderService.processParcelXOrder(orderId)`.
6. Service:
- fetches order
- maps order to ParcelX payload using mapper
- logs provider request
- calls ParcelX API via class-based client
- logs provider response (success/failure)
- updates order provider refs/status

### Order Cancel Flow

1. Client calls cancellation API.
2. `OrderService` validates order and enqueues `cancel-order` job in `parcelx-order-cancellation-queue`.
3. Worker consumes cancellation job.
4. `ParcelXOrderService.processParcelXOrderCancellation(orderId)`:
- validates order
- logs request
- calls ParcelX cancellation endpoint
- logs response
- on success sets order status to `cancelled`
- on failure sets provider sync to failed and rethrows

## 4. Queue Workflow

Two queues are currently used:

- `parcelx-orders-queue` for create-order jobs
- `parcelx-order-cancellation-queue` for cancel-order jobs

Producer side:

- Order module enqueues jobs after DB write.

Consumer side:

- ParcelX consumer workers process jobs and classify errors:
- `NonRetryableJobError` => unrecoverable
- `HttpError` 401 => unrecoverable
- other errors => retry as per queue config

Shared queue defaults are centralized in queue factory:

- retries
- exponential backoff
- remove-on-complete/fail limits

## 5. ParcelX Integration Design

ParcelX integration is intentionally decoupled from orders:

- Order schema stores only linking refs and sync status:
- `parcelxRequestRefId`
- `parcelxResponseRefId`
- `providerSyncStatus`
- Full provider request/response payloads are stored in ParcelX log schemas.

This design allows future expansion for:

- warehouse operations
- NDR operations
- B2B flows

without bloating order documents.

## 6. Data and Logging Strategy

For each provider operation:

1. Save request log (`ParcelXRequestLog`)
2. Call provider API
3. Save response log (`ParcelXResponseLog`)
4. Update order with ref IDs and sync status

Even failure paths log response snapshots for debugging and audits.

## 7. Idempotency Strategy

Order creation uses client-provided `clientOrderId`:

- same user + same `clientOrderId` returns existing order
- prevents duplicate order creation from retries/double-submits

## 8. Runtime Processes

Run API and worker separately:

1. API process: serves routes and enqueues jobs
2. Worker process: consumes queues and executes provider workflows

Scripts:

- `npm run dev` => API
- `npm run worker` => BullMQ worker
- `npm run combine` => run both concurrently

## 9. Monitoring

Bull Board is exposed at:

- `/admin/queues`

Use it to inspect:

- waiting/active/completed/failed jobs
- job payloads and return values
- retry behavior

## 10. Current Optimization State

Implemented:

- queue config centralization
- duplicated consumer error logic reduction
- cancellation success/failure status consistency
- Mongoose update option deprecation fix (`returnDocument: "after"`)

Next recommended improvements:

- typed DTOs for provider logs
- centralized provider operation constants
- metrics/alerts for failed job spikes
- route-level auth guard for `/admin/queues`
