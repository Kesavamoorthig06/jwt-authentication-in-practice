# JWT Authentication in Practice

[![Book license: CC BY 4.0](https://img.shields.io/badge/book_license-CC_BY_4.0-blue)](LICENSE-CC-BY-4.0.txt)
[![Code license: MIT](https://img.shields.io/badge/code_license-MIT-green)](LICENSE-MIT.txt)

A practical, illustrated book about JWT authentication: from login and token
verification to refresh rotation, logout, key management, and seven worked
attack scenarios with defensive answers.

## What's inside

- 18 chapters following one running example (Tiffintime, a college lunch-ordering app)
- Compact icon-led flow diagrams
- Hypothetical login-attack incidents with worked solutions
- Node.js helper code with 30 local tests
- Chapter-level sources: RFC 7519, RFC 8725, RFC 9068, RFC 9700, RFC 10017,
  OWASP cheat sheets, NIST SP 800-63B-4, MDN

## Files

- `JWT-Authentication-in-Practice.pdf` - the finished book (29 A4 pages)
- `JWT-Authentication-in-Practice-editable.html.txt` - the complete editable
  source: prose, styles and SVG figures, all inline in one file
- `code/book-auth.js`, `code/book-tests.js` - the Chapter 7 helpers and tests
- `JWT-book-README.txt` - editing, rebuild and test instructions with the
  exact tested versions

## Rebuild the PDF

```
pip install weasyprint==70.0
python3 -m weasyprint JWT-Authentication-in-Practice-editable.html.txt book.pdf
```

Needs the Noto Serif and Noto Sans font families installed
(`fonts-noto-core` on Debian/Ubuntu).

## Run the tests

```
npm install jsonwebtoken@9.0.3
node code/book-tests.js    # 30 checks passed on Node.js 22.23.5
```

## Scope

Teaching material, not a production authentication server. The database,
HTTP, CSRF and concurrency examples are marked as outlines that still need
integration tests in a real application. Every incident and character is
fictional. Security sources were checked on 22-23 November 2026.
