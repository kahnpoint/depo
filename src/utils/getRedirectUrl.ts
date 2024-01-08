// get the esm.sh redirect url to get the version
export async function getRedirectUrl(url: string): Promise<string> {
  const response = await fetch(url, { redirect: "manual" });
  if (response.status === 301 || response.status === 302) {
    return response.headers.get("location") || "";
  }
  return url;
}
