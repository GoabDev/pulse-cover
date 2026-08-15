# Pulse Cover Demo MVP Plan

## Purpose

Create a presentation-ready prototype that feels like a small working fintech app while showing how Pulse Cover makes micro-insurance simple for Nigeria's digital generation.

## Demo story

The presenter should be able to complete this flow in under two minutes:

`Home → Insurance → Choose cover → File claim → Claim submitted`

## In scope

- Wallet-style home dashboard
- Insurance overview with active policy
- Modular cover selection and monthly price calculation
- Gadget claim form with photo upload simulation
- Claim confirmation and status timeline
- Working Home, Pay, Cards, Insurance and More areas
- Transfer, airtime, bill-payment and card controls with simulated completion states
- Responsive layout that resembles a mobile app on desktop and adapts to phone widths
- Clear green Pulse Cover visual language with amber claim actions
- Browser-persisted claims and transaction activity using localStorage

## Demo data

| Module | Monthly price | Coverage |
| --- | ---: | --- |
| Health Micro-Cover | ₦500 | Outpatient care and hospital cash |
| Gadget & Device Protect | ₦1,200 | Theft, damage and liquid damage |
| Income Shield | ₦1,500 | Short-term income replacement |
| Cyber & Data Guard | ₦800 | Fraud reimbursement and identity support |

## Out of scope for this prototype

- Real payments or wallet integrations
- Real KYC, authentication, or database storage
- Real AI fraud detection
- Real insurer or claims APIs
- Production compliance and underwriting logic

The interface is intentionally broad enough to feel like a real app, while interactions remain local and simulated for a safe presentation environment.

These are represented with realistic UI states so the product concept can be evaluated quickly.

## Verifiable success criteria

- The user can move from the home screen to the insurance screen.
- Selecting a module updates the total monthly premium.
- The user can open the claim form and submit it.
- Submission produces a claim reference and visible status timeline.
- The layout works at phone width and desktop width.
- Pay, Cards and More areas are reachable from the bottom navigation.
- At least one non-insurance action (transfer, airtime or bill payment) completes with a visible success state.
- A submitted claim remains visible in Claims centre and Activity after navigation or refresh.
- The app runs with plain HTML, CSS, and JavaScript and can be deployed to Vercel as a static site.

## Build sequence

1. Build the screen shell and bottom navigation.
2. Add the insurance module cards and price calculation.
3. Add the claim form and simulated upload.
4. Add the success state and test the complete demo path.
5. Deploy the folder to Vercel.

## Source

Product direction is based on the supplied pitch deck and the three-screen reference image: wallet dashboard, insurance selection, and claim filing. The product name used in the app is Pulse Cover.
