# Frontend Kubernetes Manifests

These manifests are kept as an experiment or future reference.

They are not the current production source of truth.

The active production path for the frontend is:

- build in `airline-front`
- upload `dist/` to S3
- invalidate CloudFront

If the frontend is later migrated onto EKS, move the production-owned manifests into `../airline-infra`.
