# ParcelX Integration Guide

This document defines how to integrate ParcelX (warehouse/storage/delivery APIs) into this project in a maintainable way.

## 1. Goal

Integrate ParcelX APIs for:
- Order creation
- Transaction operations
- NDR operations
- B2B operations
- Tracking/sync/webhook events (if provided)

Keep ParcelX integration isolated from existing business modules (`auth`, `kyc`, etc.) through a dedicated module.

## 2. Module Placement

Create a new module under `src/modules/parcelx`.

Recommended structure:

```txt
src/
  modules/
    parcelx/
      parcelx.module.ts
      parcelx.service.ts
      parcelx.controller.ts             # only if internal API endpoints are needed
      validators/
        create-order.schema.ts
        ndr.schema.ts
        b2b.schema.ts
      types/
        parcelx.types.ts
      infrastructure/
        http/
          parcelx.client.ts
          parcelx.endpoints.ts
          parcelx.auth.ts
        persistence/
          parcelx.repository.ts          # optional, if DB persistence is needed
          document/
            schemas/
              parcelx-sync-log.schema.ts # optional
            repositories/
              parcelx-document.repository.ts # optional
      mapper/
        parcelx-order.mapper.ts
        parcelx-status.mapper.ts
```

## 3. Layer Responsibilities

- `parcelx.client.ts`
  - Raw HTTP calls to ParcelX.
  - Handles base URL, headers, auth, timeout.
  - No business logic.

- `parcelx.service.ts`
  - Business orchestration.
  - Converts internal DTOs to ParcelX payloads using mappers.
  - Handles retries, idempotency, response normalization.

- `validators/*.schema.ts`
  - Zod validation for incoming API request payloads.
  - Optional validation for external responses (recommended for critical fields).

- `mapper/*`
  - Internal-to-provider and provider-to-internal transformations.
  - Prevents provider field names from leaking through your app.

- `persistence/*` (optional at start)
  - Store external IDs, sync logs, raw responses, and webhook events.

## 4. Config / Environment Variables

Add to `.env` and `.env.example`:

```env
PARCELX_BASE_URL=
PARCELX_API_KEY=
PARCELX_TIMEOUT_MS=10000
PARCELX_RETRY_COUNT=2
PARCELX_WEBHOOK_SECRET=
```

Validation suggestions:
- Fail fast on startup if required ParcelX vars are missing.
- Parse timeout/retry as numbers once and reuse.

## 5. API Integration Strategy

Use incremental rollout instead of implementing all endpoints at once.

Phase 1 (MVP):
1. Build `parcelx.client.ts` with a common request wrapper.
2. Implement `createOrder` in `parcelx.service.ts`.
3. Add request schema + route + controller endpoint (if needed).
4. Save `externalOrderId` and response metadata.

Phase 2:
1. Add transaction APIs.
2. Add tracking/sync endpoint.
3. Add provider error mapping.

Phase 3:
1. Add NDR and B2B APIs.
2. Add webhook receiver + signature verification.
3. Add periodic reconciliation job for failed/uncertain statuses.

## 6. Error Handling Standards

Create a provider-specific error class, e.g. `ParcelXError`:
- Capture provider status code.
- Capture provider error code/message.
- Attach request correlation ID if available.

Map errors to consistent internal API responses.

## 7. Idempotency and Reliability

For order creation and mutable operations:
- Generate and send idempotency key if ParcelX supports it.
- If not supported, enforce app-level dedupe before external call.
- Log request/response pairs with redaction for secrets.

Retry policy:
- Retry only transient failures (timeouts, 5xx).
- Do not retry validation/auth failures (4xx except 429).

## 8. Security Requirements

- Never log API keys or secrets.
- Mask sensitive payload fields in logs.
- Verify webhook signature (`PARCELX_WEBHOOK_SECRET`) before processing.
- Use strict request validation on webhook payloads.

## 9. Suggested Internal Routes (Optional)

If your app exposes integration endpoints, keep them under a dedicated router:

```txt
src/routes/parcelx.route.ts
```

Possible endpoints:
- `POST /parcelx/order/create`
- `POST /parcelx/transaction/create`
- `POST /parcelx/ndr/update`
- `POST /parcelx/b2b/create`
- `POST /parcelx/webhook`

## 10. Data to Persist (Recommended)

At minimum for each operation, persist:
- internal reference id (order/transaction id)
- provider name (`parcelx`)
- provider request id (if available)
- provider entity id (`externalOrderId`, etc.)
- latest status
- raw response snapshot (sanitized)
- timestamps

This helps support retries, reconciliation, and support debugging.

## 11. Testing Plan

Unit tests:
- Mapper tests (payload conversion correctness).
- Service tests (retry/idempotency/error mapping).

Integration tests:
- Mock ParcelX API with success and failure cases.
- Validate behavior for timeouts, 429, and 5xx.

Contract checks:
- Validate critical response fields with Zod.

## 12. Coding Rules for This Repo

- Follow existing module pattern (`*.module.ts`, service, controller, repository).
- Use `zod` schemas in `validators/` or `types/` consistently.
- Keep external API code isolated to ParcelX module.
- Do not mix ParcelX DTOs directly in unrelated modules.

## 13. Starter Checklist

- [ ] Create `src/modules/parcelx` module structure
- [ ] Add env variables and startup validation
- [ ] Implement shared HTTP client wrapper
- [ ] Implement `createOrder` first
- [ ] Add route/controller/service flow
- [ ] Add error mapping + logging
- [ ] Add persistence for external identifiers
- [ ] Add webhook endpoint and signature verification
- [ ] Add retry and reconciliation strategy

---

If needed, this guide can be followed with a concrete scaffold implementation in the next step.
