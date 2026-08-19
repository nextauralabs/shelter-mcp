# Security

Do not report vulnerabilities through public GitHub issues.

Email security@shelter.money with a description, reproduction steps, and the affected version. Do not include real financial data, Shelter API keys, Plaid credentials, or other secrets.

## API keys

Treat `SHELTER_API_KEY` as a secret. Do not commit it, include it in screenshots, or paste it into issue reports. Create, scope, and revoke keys at https://shelter.money/developer.

The MCP server is read-only and sends the configured key only to `SHELTER_API_URL`, which defaults to `https://api.shelter.money/agent`. Without a key, financial values fail closed.
