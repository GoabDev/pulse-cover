# Pulse Cover Demo

Fast static prototype for the Pulse Cover micro-insurance concept.

## Run locally

From this folder, run:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

Upload this folder to Vercel Drop, or connect the folder's GitHub repository to Vercel. No build command is required.

## Demo paths

- Insurance: `Home → Insurance → Build cover → Claims centre → Submit claim`
- Money: `Home → Pay → Send money → Review transfer`
- Card: `Cards → Freeze card → Unfreeze card`
- Account: `More → Notifications / Security / Help`

The payment, wallet, evidence upload, and claim review states are simulated for presentation purposes. Browser state is persisted with `localStorage`, so demo claims and transactions remain visible after navigation or refresh on the same device.
