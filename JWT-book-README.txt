JWT AUTHENTICATION IN PRACTICE
Complete English edition | Sources checked 22-23 November 2026

FILES
1. JWT-Authentication-in-Practice.pdf
   The illustrated book: 18 chapters, linked contents and a small glossary.

2. JWT-Authentication-in-Practice-editable.html.txt
   The full editable book source in one text file. It contains the chapter
   writing, code examples, page styles and inline SVG illustrations. It is
   not a transcript or a flattened image. No external images are required.

3. JWT-book-code-and-tests.txt
   Two small JavaScript files in a plain-text bundle, separated by @@FILE
   markers. These contain the Chapter Seven issue/verify helpers, refresh
   generator, a simple owner-check predicate and their 30 local assertions.
   They are teaching helpers, not a complete authentication server.

EDIT AND PREVIEW
Open the editable source in a text/code editor. Save a backup first.
Edit prose as HTML, styles inside <style>, and drawings inside <svg>.
For a browser preview, rename its ending from .html.txt to .html and open it.
Browser printing may differ from the supplied PDF. The pagination and linked
contents page numbers are designed for WeasyPrint.

REBUILD THE PDF
The supplied standalone source was rebuilt and compared page by page with
the supplied PDF. All 29 rendered pages were pixel-identical in the checked
setup: Python 3.10.12, WeasyPrint 70.0 and installed Noto fonts.

Install Python, WeasyPrint 70.0, Noto Serif, Noto Sans and Noto Sans Mono.
On Debian/Ubuntu, fonts-noto-core supplies the main Noto families. WeasyPrint
may also need OS libraries; follow its installation guidance for your OS.

    pip install weasyprint==70.0
    python3 -m weasyprint JWT-Authentication-in-Practice-editable.html.txt rebuilt.pdf

The command also accepts the source after it is renamed to .html. Different
fonts, rendering libraries or versions can change wrapping and pagination.
The book has no remote asset dependency, scripts, credentials or real user
information. Tiffintime and every attack incident are fictional.

RUN THE COMPANION CHECKS
The checks were run on Node.js 22.23.5 with jsonwebtoken 9.0.3. To reproduce
them, put the text bundle in a new local folder, then split its two files:

    python3 - <<'PY'
    from pathlib import Path
    text = Path('JWT-book-code-and-tests.txt').read_text()
    for block in text.split('\n@@FILE ')[1:]:
        name, body = block.split('\n', 1)
        if name not in {'book-auth.js', 'book-tests.js'}:
            raise ValueError('Unexpected filename')
        Path(name).write_text(body)
    PY

    npm init -y
    npm install jsonwebtoken@9.0.3
    node book-tests.js

Expected: 30 checks passed. The version pin reproduces the named test setup;
it is not a promise that this version is the right deployment choice forever.
Review dependency advisories and updates before using any example in an app.

WHAT WAS AND WAS NOT TESTED
The strict JWT helpers, duration behavior, refresh digest shape and simple
owner predicate passed 30 assertions. The earlier Chapter Three middleware
sketch separately passed nine smoke checks. The strict Chapter Seven parser
is the implementation boundary to use; the early sketch explains middleware.

The database transaction outline, CSRF/framework integration, cookie emission,
proxy configuration, real concurrent refresh requests, tab coordination and
end-to-end deployment were not implemented or tested as a complete app here.
The text marks those boundaries. None of these checks is a penetration test
or a claim that an application is production-ready.

POLICY CHOICES, NOT UNIVERSAL DEFAULTS
The 900-second access lifetime, 30-second clock tolerance, sample cookie age,
rotation/retry behavior and application-specific use claim are teaching policy.
Registered JWT claims are required by the applicable application/protocol
profile, not all universally mandatory in the base JWT format.

PUBLICATION
No repository upload, website publication or video creation is included in
these files. Chapter-level source URLs remain visible and clickable so the
technical claims can be checked before future editing or publication.
