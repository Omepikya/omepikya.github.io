# Security headers deployment notes

## What changed

- `_headers` defines HSTS, a restrictive Content Security Policy, clickjacking protection, MIME-sniffing protection, a referrer policy, and a permissions policy.
- `theme-init.js` preserves the early saved-theme / system-theme initializer as a same-origin script, so the proposed CSP can use `script-src 'self'` rather than allowing inline JavaScript.
- The repeated inline theme initializer was replaced by a reference to `theme-init.js` on all HTML pages.

## Critical hosting limitation

The current production site uses **GitHub Pages** (`CNAME` contains `omepikya.in`, and the SecurityHeaders.com scan identified `server: GitHub.com`). GitHub Pages does not apply Cloudflare Pages' `_headers` file. Therefore, merging this branch into the existing GitHub Pages deployment will **not** add the six missing response headers or change the live SecurityHeaders.com result.

To activate these headers, deploy this static repository as a Cloudflare Pages project, attach and verify `omepikya.in` there, and switch DNS only after the Cloudflare Pages deployment and HTTPS are validated. Alternatively, a Cloudflare proxy with response-header transform rules can apply headers, but that requires a separately verified DNS/proxy configuration. Do not change nameservers or proxy mode until the target deployment is ready.

## CSP notes

The policy allows same-origin scripts, images, connections, service workers and media, plus Google Fonts stylesheet/font hosts. It blocks objects, embedded frames, and untrusted script origins. One existing inline style attribute is allowed by `style-src 'unsafe-inline'`; inline JavaScript is not allowed. Structured-data `application/ld+json` blocks are data, not executable JavaScript.

Before activation, test the entire site—not only the homepage—including legal pages, all feature pages, the mobile menu, theme switch, PWA/service-worker behavior, and any later-added third-party assets. If the browser console reports a legitimate blocked resource, review it and narrow the policy deliberately rather than adding broad wildcards.

HSTS is set for one year without `includeSubDomains` or `preload` to avoid imposing a long-lived HTTPS requirement on unverified subdomains. Keep HTTPS available before and after activation.
