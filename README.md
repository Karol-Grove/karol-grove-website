# Karol Grove — Website

A 4-page static site (Home, About, Products, Contact) for the Karol Grove brand, built from the SRG Stores reference layout with all content, contact details, and structure carried over — only the brand name, logo, and color identity have changed.

## Files

```
karol-grove/
├── index.html        Home page
├── about.html        About page
├── products.html     Products page (all categories)
├── contact.html      Contact page
├── assets/
│   ├── style.css           Shared stylesheet (all brand colors/fonts)
│   ├── karol-grove-logo.jpg
│   └── karol-grove-tin.jpg
```

## 1. Run it locally right now (no setup needed)

You don't need GitHub to preview this. Two easy options:

**Option A — just double-click**
Open `index.html` directly in your browser. Everything will work except the contact form (which is just a placeholder — see note below).

**Option B — local server (recommended, avoids minor file-path quirks)**
If you have Python installed, open a terminal in the `karol-grove` folder and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

If you have Node.js installed instead:

```bash
npx serve .
```

## 2. Push it to GitHub

```bash
cd karol-grove
git init
git add .
git commit -m "Initial Karol Grove website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo-name>` with your actual GitHub username and the repository name you create on github.com (create an empty repo there first, with no README/license, so the push doesn't conflict).

## 3. Host it for free on GitHub Pages

1. Go to your repository on GitHub → **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to `Deploy from a branch`
3. Set **Branch** to `main` and folder to `/ (root)`
4. Click **Save**
5. Wait 1–2 minutes — GitHub will give you a live URL like:
   `https://<your-username>.github.io/<your-repo-name>/`

That's it — the site is now live and free, no separate hosting needed.

## Things to update before going live

- **GSTIN and FSSAI numbers** — currently placeholders `[GST_NUMBER_PLACEHOLDER]` and `[FSSAI_NUMBER_PLACEHOLDER]` in the footer of every page. Search and replace these once you have the numbers.
- **Contact form** — right now submitting the form just shows a "Thanks, we'll get back to you" popup; it doesn't actually send an email anywhere, since this is a static site with no backend. If you want real form submissions, the easiest no-code options are [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) — both let you keep a static site and just point the form's `action` at their service.
- **Domain** — GitHub Pages gives you a free `github.io` URL. If you want `karolgrove.in` or similar, you'd buy the domain separately and point its DNS at GitHub Pages (GitHub's docs cover this under "Custom domains").

## Notes

- All page content (About text, product list, benefits, contact address/phone/email) mirrors the reference site (srgstores.in) as requested, with only branding swapped to Karol Grove.
- Phone, WhatsApp, email, and address are intentionally kept identical to the reference site per your instruction.
- Design uses a cream/forest-green/gold/terracotta palette and serif+sans type pairing inspired directly by your logo artwork.
