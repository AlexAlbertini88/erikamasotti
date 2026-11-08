const packages = {
  instagram: 'com.instagram.android',
  linkedin: 'com.linkedin.android',
} as const;
type Social = keyof typeof packages;

export function socialAppHref(webHref: string, social: Social, userAgent: string): string {
  // iOS universal links and non-Chrome browsers keep the ordinary HTTPS link.
  // Chrome on Android supports an explicit app Intent and a web fallback.
  const androidChrome = /Android/i.test(userAgent) && /Chrome\//i.test(userAgent) && !/;\s*wv\b/i.test(userAgent);
  if (!androidChrome) return webHref;
  try {
    const url = new URL(webHref);
    const domain = social === 'instagram' ? 'instagram.com' : 'linkedin.com';
    if (url.protocol !== 'https:' || ![domain, `www.${domain}`].includes(url.hostname)) return webHref;
    return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=${packages[social]};S.browser_fallback_url=${encodeURIComponent(webHref)};end`;
  } catch { return webHref; }
}

export function initializeSocialAppLinks(root: Document | HTMLElement = document, userAgent = navigator.userAgent) {
  root.querySelectorAll<HTMLAnchorElement>('a[data-social-app][data-app-web-url]').forEach(link => {
    const social = link.dataset.socialApp;
    const webHref = link.dataset.appWebUrl;
    if (!webHref || (social !== 'instagram' && social !== 'linkedin')) return;
    link.href = socialAppHref(webHref, social, userAgent);
  });
}
