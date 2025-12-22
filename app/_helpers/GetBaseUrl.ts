import { headers } from "next/headers";

export async function getBaseUrl() {
  const headersList = headers();
  const protocol = (await headersList).get("x-forwarded-proto") ?? "http";
  const host =
    (await headersList).get("x-forwarded-host") ??
    (await headersList).get("host");
  return `${protocol}://${host}`;
}
