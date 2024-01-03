const url = "https://esm.sh/v135/assert";

async function getRedirectUrl(url: string): Promise<string> {
  const response = await fetch(url, { redirect: "manual" });
  if (response.status === 301 || response.status === 302) {
    return response.headers.get("location") || "";
  }
  return url;
}

console.log(await getRedirectUrl(url));
