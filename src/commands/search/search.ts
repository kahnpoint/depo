/*
  search for a module on deno.land/x, npmjs.com, or github.com
*/
import { parse as htmlParse } from "node-html-parser";
import moment from "moment";
import { cacheHtml } from "@/utils/utils.ts";
import { dealiasSource, DEFAULT_SOURCE } from "@/sources/sources.ts";

// spaces for indentation
const tab = "  ";

// parse the html from deno.land/x
async function parseDenoSearch(html: string) {
  const result = await htmlParse(html);
  const ul = result.querySelector("ul.divide-y");
  const lis = ul!.querySelectorAll("li");
  const contents = lis.map((li) => {
    const title = li.querySelector("div.text-blue-600.font-bold");
    const description = li.querySelector(
      "div.col-span-2.md\\:col-span-1.text-gray-600.text-sm",
    );
    return {
      // deno doesn't have many of the fields that node and github have
      title: title ? title.text : null,
      description: description ? description.text : null,
    };
  });
  return contents;
}

// parse the html from npmjs.com
async function parseNodeSearch(html: string, count = 3) {
  function getNodeInfo(html: string) {
    const root = htmlParse(html);
    const h3Elements = root.querySelectorAll("h3");

    let output = {
      weeklyDownloads: "",
      unpackedSize: "",
      updatedAt: "",
      description: "",
      title: "",
    };

    h3Elements.forEach((h3) => {
      if (h3.text === "DownloadsWeekly Downloads") {
        const parentDiv = h3.parentNode;

        if (parentDiv) {
          const pElement = parentDiv.querySelector("div");

          if (pElement) {
            output.weeklyDownloads = pElement.innerText;
          }
        }
      } else if (h3.text === "Unpacked Size") {
        const parentDiv = h3.parentNode;

        if (parentDiv) {
          const pElement = parentDiv.querySelector("p");

          if (pElement) {
            output.unpackedSize = pElement.innerText;
          }
        }
      } else if (h3.text === "Last publish") {
        const parentDiv = h3.parentNode;

        if (parentDiv) {
          const pElement = parentDiv.querySelector("p");

          if (pElement) {
            output.updatedAt = pElement.innerText;
          }
        }
      }
    });
    return output;
  }

  const root = htmlParse(html);
  const sections = root.querySelectorAll(
    'section[class*="flex-l pl1-ns pt3 pb2 ph1 bb b--black-10"]',
  ).slice(0, count);
  if (!sections) return [];
  const data = sections.map((section) => async () => {
    const title = section.querySelector("h3")!.innerText;
    const description = section.querySelector("p")!.innerText;
    let returnData = getNodeInfo(
      await cacheHtml("https://www.npmjs.com/package/" + title),
    );
    returnData.title = title;
    returnData.description = description;
    return returnData;
  });

  const results = await Promise.all(data.map((func) => func()));
  return results;
}

// parse the html from github.com
function parseGithubSearch(html: string) {
  /*
    payload: {
    header_redesign_enabled: false,
    results: [
      {
        id: "3955647",
        archived: false,
        color: "#f1e05a",
        followers: 58169,
        has_funding_file: false,
        hl_name: "lodash/<em>lodash</em>",
        hl_trunc_description: "A modern JavaScript utility module delivering modularity, performance, &amp; extras.",
        language: "JavaScript",
        mirror: false,
        owned_by_organization: true,
        public: true,
        repo: { repository: [Object] },
        sponsorable: false,
        topics: [ "javascript", "modules", "utilities", "lodash" ],
        type: "Public",
        help_wanted_issues_count: 0,
        good_first_issue_issues_count: 0,
        starred_by_current_user: false
      },
    */

  function stripEmphasis(str: string) {
    return str.replaceAll("<em>", "").replaceAll("</em>", "").replaceAll(
      "&amp;",
      "&",
    ).replaceAll("&#x2F;", "/");
  }
  const root = JSON.parse(html);
  return root.payload.results.map((result: any) => {
    const relativeDate = moment(result.repo.repository.updated_at).fromNow();
    // console.log(result.hl_name, result.hl_trunc_description)
    return {
      title: stripEmphasis(result.hl_name),
      updatedAt: relativeDate,
      description: stripEmphasis(result.hl_trunc_description || ""),
      stars: result.followers,
      language: result.language,
    };
  });
}

// print the results from deno.land/x
function printDenoSearchResult(data: any, tabCount = 1) {
  /*
   {
  title: "lodash",
  description: "A modern JavaScript utility module delivering modularity, performance, & extras."
}
  */

  const tabs = tab.repeat(tabCount);
  const tabs1 = tab.repeat(tabCount + 1);

  const output = `
${tabs}%c${data.title} %c- https://deno.land/x/${data.title}
${tabs1}%c${data.description}`;

  const styles = [
    `font-weight: bold; color: white`,
    `font-weight: normal; color: gray`,
    `font-weight: italic; color: gray`,
  ];

  return [output].concat(styles);
}

// print the results from npmjs.com
function printNodeSearchResult(data: any, tabCount = 1) {
  /*
  {
  weeklyDownloads: "18,074,778",
  unpackedSize: "1.41 MB",
  lastPublish: "",
  updatedAt: "3 years ago",
  title: "lodash",
  description: "Lodash modular utilities."
}
  */
  const tabs = tab.repeat(tabCount);
  const tabs1 = tab.repeat(tabCount + 1);

  let output = `
${tabs}%c${data.title} %c- https://npmjs.com/package/${data.title}`;
  if (data.description) {
    output += `
${tabs1}%c${data.description}`;
  }
  output += `
${tabs1}%c⬇️  ${data.weeklyDownloads}/wk - ⚖️  ${data.unpackedSize} - ⌚ ${data.updatedAt}`;
  const styles = [
    `font-weight: bold; color: red`,
    `font-weight: normal; color: gray`,
    `font-weight: italic; color: maroon`,
    `font-weight: normal; color: gray`,
  ];

  return [output].concat(styles);
}

// print the results from github.com
function printGithubSearchResult(data: any, tabCount = 1) {
  /*
      title: "lodash/lodash",
        updatedAt: "3 days ago",
        description: "A modern JavaScript utility module delivering modularity, performance, &amp; extras.",
        stars: 58169,
        language: "JavaScript"
    */
  const tabs = tab.repeat(tabCount);
  const tabs1 = tab.repeat(tabCount + 1);

  const output = `
${tabs}%c${data.title} %c- https://github.com/${data.title}
${tabs1}%c${data.description}
${tabs1}⭐ ${data.stars} - 🔣 %c${data.language} - ⌚ ${data.updatedAt}`;

  const styles = [
    `font-weight: bold; color: green`,
    `font-weight: normal; color: gray`,
    `font-weight: italic; color: green`,
    `font-weight: normal; color: gray`,
  ];

  return [output].concat(styles);
}

// print the results from a search query
export async function printSearchResults(
  source: string | undefined,
  module: string,
  count = 3,
) {
  source = dealiasSource(source || DEFAULT_SOURCE);

  switch (source) {
    case "deno": {
      const searchUrl = "https://deno.land/x?query=";
      const searchResults = await cacheHtml(searchUrl + module);
      const denoSearchResults = await parseDenoSearch(searchResults);
      denoSearchResults.slice(0, count).forEach((result) => {
        console.log(...printDenoSearchResult(result));
      });
      break;
    }
    case "node": {
      const searchUrl = "https://www.npmjs.com/search?q=";
      const searchResults = await cacheHtml(searchUrl + module);
      const nodeSearchResults = await parseNodeSearch(
        searchResults,
        count, /* count is required to prevent getting the
                 weekly downloads for extra results */
      );
      nodeSearchResults.slice(0, count).forEach((result) => {
        console.log(...printNodeSearchResult(result));
      });
      break;
    }
    case "github": {
      const searchUrl = "https://github.com/search?type=repositories&q=";
      const searchResults = await cacheHtml(searchUrl + module);
      const githubSearchResults = await parseGithubSearch(searchResults);
      githubSearchResults.slice(0, count).forEach((result: any) => {
        console.log(...printGithubSearchResult(result));
      });
      break;
    }
  }
}
