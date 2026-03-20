# airline-front

This repository owns frontend application code and static asset deployment.

## Production Delivery

- Build the frontend on pushes to `main`
- Upload the generated `dist/` output to S3
- Invalidate CloudFront after deployment

## Delivery Boundary

- Keep frontend source and static hosting deployment here
- Manage shared AWS infrastructure in `../airline-infra`
- Treat `k8s/` as an experimental reference only unless the frontend is intentionally moved to EKS later
