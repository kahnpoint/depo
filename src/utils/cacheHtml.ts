//cache html locally for development (to prevent repeatedly calling the url)

export async function cacheHtml(url: string): Promise<string> {
  if (Deno.env.get("NODE_ENV") === "development") {
    let html;
    let modifiedUrl = url;
    for (const disallowedChar of ["/", ":", "?", "&", "="]) {
      modifiedUrl = modifiedUrl.replaceAll(disallowedChar, "_");
    }

    const resultOutputPath = `./.cache/${modifiedUrl}`;

    // check for .cache folder
    await Deno.mkdir(`./.cache/`, { recursive: true });

    try {
      //check for locally cached version
      html = await Deno.readTextFile(resultOutputPath);
    } catch {
      //if not, fetch it
      const response = await fetch(url);
      html = await response.text();
      await Deno.writeTextFile(resultOutputPath, html);
    }
    return html;
  } else {
    // just fetch the url
    const response = await fetch(url);
    return await response.text();
  }
}
