# Security Policy

## Scope

This repository is a portfolio demonstration built entirely with synthetic data. It must not contain client data, credentials, access tokens, private keys, or confidential operating procedures.

The dashboard is a static prototype. It does not provide authentication, accept sensitive data, connect to production services, or persist user-entered information.

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue. Use GitHub's **Report a vulnerability** option in the repository's Security tab when available. If private vulnerability reporting is unavailable, contact the repository owner privately through their GitHub profile.

Include the affected file or component, reproduction steps, potential impact, and a suggested remediation if known. Do not include real credentials or confidential data in the report.

## Supported version

Only the latest revision of the default branch is maintained.

## Dependency and secret controls

- GitHub secret scanning and push protection are enabled for the public repository.
- Dependabot checks the dashboard's npm dependencies weekly.
- Local environment files, private keys, build output, dependencies, and hosting metadata are excluded from version control.
