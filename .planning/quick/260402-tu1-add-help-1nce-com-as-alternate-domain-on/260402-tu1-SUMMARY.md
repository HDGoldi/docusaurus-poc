---
phase: quick
plan: 260402-tu1
subsystem: infra
tags: [cloudfront, acm, multi-domain, cloudformation, aws]

requires:
  - phase: none
    provides: existing CloudFormation template with single-domain setup
provides:
  - CloudFormation template with dual-domain support (help.1nce.ai + help.1nce.com)
affects: [deployment, dns]

tech-stack:
  added: []
  patterns: [multi-domain CloudFront via AlternateDomainName parameter, SAN certificate for cross-account domains]

key-files:
  created: []
  modified: [infra/template.yaml]

key-decisions:
  - "No DomainValidationOptions for AlternateDomainName since its hosted zone is in a different AWS account"
  - "Used CloudFormation parameter for AlternateDomainName to keep it configurable"

patterns-established:
  - "Cross-account domain: omit DomainValidationOptions, manually validate DNS in external account"

requirements-completed: [multi-domain-cloudfront]

duration: 1min
completed: 2026-04-02
---

# Quick Task 260402-tu1: Add help.1nce.com as Alternate Domain Summary

**CloudFormation template updated with dual-domain ACM certificate (SAN) and CloudFront aliases for help.1nce.ai + help.1nce.com**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-02T19:31:08Z
- **Completed:** 2026-04-02T19:31:41Z
- **Tasks:** 1 automated + 1 checkpoint (manual deployment)
- **Files modified:** 1

## Accomplishments

- Added AlternateDomainName parameter (default: help.1nce.com) to CloudFormation template
- Expanded ACM Certificate with SubjectAlternativeNames covering both help.1nce.ai and help.1nce.com
- Added help.1nce.com to ProdDistribution CloudFront Aliases
- Intentionally omitted DomainValidationOptions for help.1nce.com (cross-account hosted zone)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update CloudFormation template for dual-domain support** - `ff1c597` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `infra/template.yaml` - Added AlternateDomainName parameter, SubjectAlternativeNames on Certificate, dual Aliases on ProdDistribution

## Decisions Made

- No DomainValidationOptions entry for help.1nce.com because its Route 53 hosted zone lives in a different AWS account. CloudFormation cannot auto-validate cross-account domains. The user must manually create the DNS CNAME for ACM validation.
- Used a CloudFormation parameter (AlternateDomainName) rather than hardcoding to keep the template flexible.

## Deviations from Plan

None - plan executed exactly as written.

## Manual Deployment Steps (Task 2 - Checkpoint)

The following steps must be performed manually by the user:

1. **Deploy the stack update:**
   ```
   aws cloudformation update-stack \
     --stack-name <your-stack-name> \
     --template-body file://infra/template.yaml \
     --parameters ParameterKey=HostedZoneId,UsePreviousValue=true \
                  ParameterKey=GitHubOrg,UsePreviousValue=true \
                  ParameterKey=GitHubRepo,UsePreviousValue=true \
     --capabilities CAPABILITY_IAM
   ```

2. **ACM certificate validation (cross-account):**
   - The stack update will pause waiting for ACM certificate validation for help.1nce.com
   - Go to AWS ACM console (us-east-1 region) and find the new certificate
   - Copy the CNAME name and value for the help.1nce.com domain validation
   - In the OTHER AWS account where help.1nce.com's hosted zone lives, create that CNAME record
   - Wait for ACM to validate (usually 5-30 minutes)

3. **DNS records in external account (after stack completes):**
   - In the external account's Route 53, create:
     - A record: help.1nce.com -> CloudFront distribution domain (dXXXXXXXXXX.cloudfront.net)
     - AAAA record: help.1nce.com -> same CloudFront distribution domain
     - For both, use hosted zone ID `Z2FDTNDATAQYW2` (global CloudFront hosted zone ID)

4. **Verify:**
   - `curl -I https://help.1nce.com` returns 200 (after DNS propagation)
   - `curl -I https://help.1nce.ai` still returns 200

## Issues Encountered

None.

## Known Stubs

None.

## Next Steps

- Deploy the CloudFormation stack update
- Complete cross-account DNS validation for ACM
- Create Route 53 alias records in external account
- Verify both domains serve the site correctly

---
*Quick task: 260402-tu1*
*Completed: 2026-04-02*
