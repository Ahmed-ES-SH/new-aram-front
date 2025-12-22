// utils/getBrowser.ts
export function getBrowser(): string {
  if (typeof navigator === "undefined") return "Unknown";

  const userAgent = navigator.userAgent;

  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|chromium|crios/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent))
    return "Safari";
  if (/opr|opera/i.test(userAgent)) return "Opera";
  if (/msie|trident/i.test(userAgent)) return "Internet Explorer";

  return "Unknown";
}
