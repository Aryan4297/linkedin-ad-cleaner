// LinkedIn Ad Cleaner
// Finds small text labels such as "Promoted" or "Sponsored", then hides the
// post or card that contains them. Matching on visible text is more stable
// than matching class names, which LinkedIn changes often.

// Labels that mark an ad. Compared case-insensitively against the full text
// of an element. Add translations here if you use LinkedIn in another language.
const AD_LABELS = new Set(["promoted", "sponsored"]);

// Which element to hide once a label is found. The first selector that matches
// an ancestor of the label wins, so put the most specific ones first.
const CONTAINER_SELECTORS = [
  "div.feed-shared-update-v2",
  "[data-urn^='urn:li:activity']",
  "[data-id^='urn:li:activity']",
  "[role='listitem']",
  "article",
  "li",
];

// Where to look for labels. Narrow this if you see false positives.
const LABEL_CANDIDATES = "span, p";

const HIDDEN_CLASS = "li-ad-cleaner-hidden";

function isAdLabel(el) {
  // Only leaf-ish elements, so a whole post's text never matches.
  if (el.childElementCount > 1) return false;
  const text = (el.textContent || "").trim().toLowerCase();
  return AD_LABELS.has(text);
}

function hideAds(root = document) {
  for (const el of root.querySelectorAll(LABEL_CANDIDATES)) {
    if (!isAdLabel(el)) continue;
    const container = el.closest(CONTAINER_SELECTORS.join(","));
    if (container && !container.classList.contains(HIDDEN_CLASS)) {
      container.classList.add(HIDDEN_CLASS);
    }
  }
}

// LinkedIn is a single-page app that loads posts as you scroll,
// so re-scan whenever the DOM changes (debounced to stay cheap).
let timer = null;
const observer = new MutationObserver(() => {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    hideAds();
  }, 300);
});

hideAds();
observer.observe(document.body, { childList: true, subtree: true });
