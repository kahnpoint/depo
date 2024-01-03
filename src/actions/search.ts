import { parse as htmlParse } from "node-html-parser";
import moment from "moment";
import { cacheHtml } from "../utils/utils.ts";
import { Command } from "cliffy-command";
import {
  dealiasSource,
  sourceEnum,
  sourceListBase,
  sourceListFull,
} from "../sources/sources.ts";

export const searchCommand = new Command()
  .alias("s")
  .type("source", sourceEnum)
  .description("Search Deno.land, NPM, or Github for libraries.")
  .arguments("<source:string:source> [library:string] [count:integer]")
  .action(async (options, source: string | undefined, library, count) => {
    source = dealiasSource(source);

    if (sourceListBase.includes(source)) {
      // source is valid
      if (library === undefined) {
        console.log("Required : %c[library]", "color: yellow");
        return;
      }
    } else {
      // source is a package
      library = source;
      source = undefined;
    }

    //console.log("search command called", options, library, source, count)
    if (source === undefined) {
      for (const source of sourceListBase) {
        await printSearchResults(source, library, count || 1);
      }
    } else {
      // search a specific source
      await printSearchResults(source, library, count || 3);
    }
    console.log();
  });

const tab = "  ";

async function parseDenoSearch(html: string) {
  const result = htmlParse(html);
  const ul = result.querySelector("ul.divide-y");
  const lis = ul!.querySelectorAll("li");
  const contents = lis.map((li) => {
    const title = li.querySelector("div.text-blue-600.font-bold");
    const description = li.querySelector(
      "div.col-span-2.md\\:col-span-1.text-gray-600.text-sm",
    );
    return {
      title: title ? title.text : null,
      description: description ? description.text : null,
    };
  });
  return contents;
}

async function parseNodeSearch(html: string, library: string, count = 3) {
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
        hl_trunc_description: "A modern JavaScript utility library delivering modularity, performance, &amp; extras.",
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

function printDenoSearchResult(data: any, tabCount = 1) {
  /*
   {
  title: "lodash",
  description: "A modern JavaScript utility library delivering modularity, performance, & extras."
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

function printGithubSearchResult(data: any, tabCount = 1) {
  /*
      title: "lodash/lodash",
        updatedAt: "3 days ago",
        description: "A modern JavaScript utility library delivering modularity, performance, &amp; extras.",
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

export async function printSearchResults(
  source: string,
  library: string,
  count = 3,
) {
  source = dealiasSource(source);

  switch (source) {
    case "deno": {
      const searchUrl = "https://deno.land/x?query=";
      const searchResults = await cacheHtml(searchUrl + library);
      const denoSearchResults = await parseDenoSearch(searchResults);
      denoSearchResults.slice(0, count).forEach((result) => {
        console.log(...printDenoSearchResult(result));
      });
      break;
    }
    case "node": {
      const searchUrl = "https://www.npmjs.com/search?q=";
      const searchResults = await cacheHtml(searchUrl + library);
      const nodeSearchResults = await parseNodeSearch(
        searchResults,
        library,
        count,
      );
      nodeSearchResults.slice(0, count).forEach((result) => {
        console.log(...printNodeSearchResult(result));
      });
      break;
    }
    case "github": {
      const searchUrl = "https://github.com/search?type=repositories&q=";
      const searchResults = await cacheHtml(searchUrl + library);
      const githubSearchResults = await parseGithubSearch(searchResults);
      githubSearchResults.slice(0, count).forEach((result: any) => {
        console.log(...printGithubSearchResult(result));
      });
      break;
    }
  }
}
