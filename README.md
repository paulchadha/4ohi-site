# Four of Hearts Interactive website

Static company website for Four of Hearts Interactive, LLC and `4ohi.com`.

## Architecture

- Plain HTML and CSS; no build step.
- No client analytics, advertising, tracking pixels, remote fonts, databases, or user accounts.
- GitHub Pages is the intended host.
- `4ohi.com` is the canonical hostname; `www.4ohi.com` should redirect to it.

## Local preview

From the repository root:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Deploy

Push the default branch to GitHub and enable Pages from that branch at the repository root. The committed `CNAME` file declares `4ohi.com`.

Do not change website A/CNAME records until the temporary `github.io` deployment passes. Do not alter MX, SPF, DKIM, or DMARC records during website deployment.

## Documentation

- [Domain and DNS](docs/DOMAIN-AND-DNS.md)
- [Email operations](docs/EMAIL-OPERATIONS.md)
- [Website deployment](docs/WEBSITE-DEPLOYMENT.md)
- [Security and account recovery](docs/SECURITY-AND-ACCOUNT-RECOVERY.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)
- [Brand assets](docs/BRAND-ASSETS.md)
- [Privacy policy review](docs/PRIVACY-POLICY-REVIEW.md)

Never commit credentials, tokens, recovery codes, private keys, or account exports.
