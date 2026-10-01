# Vidyarthi.ai Course Data Model

This model is intentionally provider-neutral and payment-ready without implementing payments.

## Source types

- `public_provider`: public/free discovery listing; Vidyarthi links to the official provider.
- `provider_submitted`: course submitted by an institute/creator and approved by Vidyarthi.
- `affiliate`: commercial referral listing; affiliate relationship must exist and be disclosed.
- `vidyarthi_original`: content owned/created by Vidyarthi.
- `sample`: temporary V7.1 catalogue item; must not be treated as a verified provider listing.

## Publication rule

Only `status: "published"` entries should be exposed as production catalogue content. Provider claims, price, duration and last-verified date must be checked before publication.

## Future payment readiness

The current model deliberately leaves room for:

- provider payout/revenue share
- currency and tax fields
- checkout URL / product ID
- enrolment/access URL
- refund policy reference
- commercial relationship metadata

Those fields are **not activated yet**.
