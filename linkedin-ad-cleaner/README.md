# LinkedIn Ad Cleaner

A tiny Manifest V3 extension that hides "Promoted" and "Sponsored" content on LinkedIn.
No permissions, no background script, no network requests.

## Load it locally

**Chrome / Edge / Brave / Arc**
1. Unzip the folder somewhere permanent.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `linkedin-ad-cleaner` folder.
5. Open or reload https://www.linkedin.com/feed/ and scroll.

**Firefox**
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `manifest.json`.
   (Temporary add-ons are removed when Firefox restarts.)

After editing any file, click the reload icon on the extension's card, then refresh LinkedIn.

## How it works

`content.js` scans the page for short text labels ("Promoted", "Sponsored"), finds the
post or card around each one, and adds a class that `content.css` hides. A
`MutationObserver` re-runs the scan as new posts load while you scroll.

## Tweaking when LinkedIn changes its layout

- **Ads still show up:** right-click the ad, choose **Inspect**, and look at the
  label text and the element that wraps the whole card. Then edit `content.js`:
  - `AD_LABELS`: add the exact label text (for example a translation like `"gesponsert"`).
  - `CONTAINER_SELECTORS`: add a selector for the wrapper element, most specific first.
- **Fixed ad blocks (banners, sidebar):** add their selector to the top of `content.css`.
- **Hiding too much:** narrow `LABEL_CANDIDATES` or remove broad entries such as `li` from
  `CONTAINER_SELECTORS`.
- Test a selector quickly in DevTools with `document.querySelectorAll("your-selector")`.
