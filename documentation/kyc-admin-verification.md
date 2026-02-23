# Admin-Driven KYC Verification System (V1)

## Goal
Provide a practical KYC workflow where users upload documents, admins verify manually, and the system sends OTP for final confirmation.

## Scope (V1)
- Manual admin review (no third-party KYC API required).
- User document upload and status tracking.
- Admin approve/reject/resubmission decisions.
- OTP-based final confirmation after approval.
- Basic audit trail.

## Key Rule
Primary KYC OTP should be sent to the **user's verified mobile/email**.

If you want relative contact verification, keep it separate as a nominee/emergency-contact step and do not treat it as identity proof.

## KYC Status Lifecycle
- `DRAFT`: user started but not submitted.
- `PENDING_REVIEW`: submitted, waiting for admin.
- `NEEDS_RESUBMISSION`: admin requested corrections.
- `APPROVED_PENDING_OTP`: admin approved, waiting OTP confirmation.
- `VERIFIED`: OTP success, KYC complete.
- `REJECTED`: permanently rejected for compliance reasons.

## Suggested Data Model

### `kyc_records`
- `id`
- `user_id`
- `status`
- `submitted_at`
- `reviewed_by_admin_id`
- `reviewed_at`
- `review_reason` (required for reject/resubmission)
- `otp_channel` (`sms` | `email`)
- `otp_sent_at`
- `otp_verified_at`
- `created_at`
- `updated_at`

### `kyc_documents`
- `id`
- `kyc_record_id`
- `doc_type` (e.g., `id_front`, `id_back`, `address_proof`, `selfie`)
- `storage_key`
- `storage_url`
- `mime_type`
- `size_bytes`
- `uploaded_at`

### `kyc_audit_logs`
- `id`
- `kyc_record_id`
- `actor_type` (`user` | `admin` | `system`)
- `actor_id`
- `action` (submit, approve, reject, otp_sent, otp_verified, etc.)
- `metadata_json`
- `created_at`

### `otp_verifications`
- `id`
- `user_id`
- `kyc_record_id`
- `purpose` (`KYC_FINAL_CONFIRMATION`, optional: `NOMINEE_VERIFICATION`)
- `channel`
- `destination_masked`
- `code_hash`
- `expires_at`
- `attempt_count`
- `verified_at`
- `created_at`

## API Design (Example)

### User Endpoints
- `POST /kyc/submit`
- `POST /kyc/documents/upload`
- `GET /kyc/me/status`
- `POST /kyc/otp/send` (only when `APPROVED_PENDING_OTP`)
- `POST /kyc/otp/verify`

### Admin Endpoints
- `GET /admin/kyc?status=PENDING_REVIEW`
- `GET /admin/kyc/:kycId`
- `POST /admin/kyc/:kycId/approve`
- `POST /admin/kyc/:kycId/reject`
- `POST /admin/kyc/:kycId/request-resubmission`

## Admin Review Checklist
- Document readability and completeness.
- Name/date-of-birth consistency with profile.
- Document not expired.
- Selfie/face visibly matches ID photo (manual check).
- Suspicious tampering indicators.

## OTP Policy
- Use short expiry (5-10 minutes).
- Max attempts (e.g., 5).
- Rate limit sends (e.g., 1 per minute, 5 per hour).
- Store only OTP hash, never plain OTP.
- Block brute-force and log failures.

## Security and Compliance Baseline
- Encrypt documents at rest (or use provider-managed encryption).
- Signed/private access URLs for files.
- Role-based access for admin KYC tab.
- Keep immutable audit logs.
- Add PII-safe logs (mask phone/email/doc numbers).
- Define retention and deletion policy per jurisdiction.

## Recommended UI Tabs

### User Portal
- `KYC Upload`
- `KYC Status`
- `Resubmission Notes`
- `OTP Confirmation`

### Admin Portal
- `Pending Review`
- `Needs Resubmission`
- `Approved/Rejected History`
- KYC detail page with document preview + decision form + timeline.

## Implementation Notes for Current Project Structure
You already have modules for `kyc`, `storage`, and `emails`.

Suggested additions:
- `src/modules/kyc/kyc.controller.ts`
- `src/modules/kyc/kyc.service.ts`
- `src/modules/kyc/infrastructure/persistence/...` for `kyc_records`, `kyc_documents`, `kyc_audit_logs`
- `src/modules/otp/...` for OTP send/verify
- `src/routes/kyc.route.ts` for user + admin endpoints (guarded by roles)

## Future Upgrade Path (V2)
- Integrate provider-based verification (Persona, Onfido/Entrust, Sumsub, Veriff, etc.)
- Add liveness + OCR + sanctions/PEP checks
- Keep admin override queue for edge cases

---
This design is optimized for a fast, controllable first release with clear auditability and minimal vendor dependency.
