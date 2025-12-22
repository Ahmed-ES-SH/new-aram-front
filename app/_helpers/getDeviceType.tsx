export function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();

  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua)) {
    return "mobile";
  }

  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) {
    return "tablet";
  }

  if (/macintosh|windows nt|linux/.test(ua)) {
    return "desktop";
  }

  return "unknown";
}
