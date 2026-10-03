const storageKey = (locale) => `homeScrollY-${locale}`;

export function saveHomeScroll(locale) {
  try {
    sessionStorage.setItem(storageKey(locale), String(window.scrollY));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

export function clearHomeScroll() {
  try {
    sessionStorage.removeItem(storageKey('it'));
    sessionStorage.removeItem(storageKey('en'));
  } catch {
    // ignore
  }
}

export function consumeHomeScroll(locale) {
  try {
    const key = storageKey(locale);
    const saved = sessionStorage.getItem(key);
    if (saved === null) return null;
    sessionStorage.removeItem(key);
    return Number.parseInt(saved, 10);
  } catch {
    return null;
  }
}
