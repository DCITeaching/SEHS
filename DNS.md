# Pointing the GoDaddy domain at GitHub Pages

Use a **subdomain**, not the apex. A subdomain is a single CNAME record, it does not
disturb anything already running on the root domain, and GitHub can issue its TLS
certificate without you touching the apex A records.

## 1. GoDaddy — add one record

DNS → Manage Zones → your domain → Add New Record:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `sehs` *(or whatever subdomain you want)* |
| Value | `<your-github-username>.github.io` |
| TTL | 1 hour |

Do not put `https://` in the value, and do not point it at the repository — it is the
username, not `username.github.io/SEHS`.

## 2. GitHub — claim the domain

Repository → Settings → Pages → Custom domain → `sehs.yourdomain.org` → Save.

That writes a `CNAME` file into the repository root. Keep it; deleting it unsets the domain.

## 3. Wait, then force HTTPS

DNS usually propagates in minutes, occasionally up to an hour. When GitHub shows the
domain as verified, tick **Enforce HTTPS**. The certificate is issued automatically and
renews itself.

## If you would rather use the apex (`yourdomain.org` with no subdomain)

Four A records and two AAAA records, replacing any existing A record for the root — which
will take down whatever currently answers there. Only do this if nothing else is on the apex.

**Verify the current addresses against GitHub's own documentation before entering them.**
GitHub has changed its Pages IP addresses before, and a stale address fails silently:
<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>

## One caution about which domain you use

A DC HOSA domain is the state CTSO's public identity. This site is DC International
School course material. Putting one under the other ties two organisations together in a
way that is hard to undo later — the URL ends up in student bookmarks, Toddle links and
parent emails, and moving it afterwards breaks all of them.

A DCI subdomain, or a separate domain for your teaching work, keeps the two apart. Worth
deciding before the first link goes out rather than after.
