import { sources } from "../sources/sources.ts";
import { parse as htmlParse} from 'https://esm.sh/node-html-parser';
import moment from "https://esm.sh/moment";
import { cacheHtml } from "../utils/utils.ts";

//const response = await fetch(sources[source].searchUrl + library);

const tab = "  "

async function parseDenoSearch(html: string){
    const result = htmlParse(html);
    const ul = result.querySelector('ul.divide-y');
    const lis = ul.querySelectorAll('li');
    const contents = lis.map(li => {
        const title = li.querySelector('div.text-blue-600.font-bold');
        const description = li.querySelector('div.col-span-2.md\\:col-span-1.text-gray-600.text-sm');
        return {
            title: title ? title.text : null,
            description: description ? description.text : null
        };
    });
    return contents;
}

async function parseNodeSearch(html: string, library: string) {
    
    function getNodeInfo(html: string){
        const root = htmlParse(html);
        const h3Elements = root.querySelectorAll('h3');
    
        let output = {
            weeklyDownloads: "",
            unpackedSize: "",
            updatedAt: ""
        };
    
        h3Elements.forEach((h3) => {
            if (h3.text === 'DownloadsWeekly Downloads') {
                
                const parentDiv = h3.parentNode;
    
                if (parentDiv) {
                    const pElement = parentDiv.querySelector('div');
    
                    if (pElement) {
                        output.weeklyDownloads = pElement.innerText;
                    }
                }
            } else if (h3.text === 'Unpacked Size') {
                const parentDiv = h3.parentNode;
    
                if (parentDiv) {
                    const pElement = parentDiv.querySelector('p');
    
                    if (pElement) {
                        output.unpackedSize = pElement.innerText;
                    }
                }
            } else if (h3.text === 'Last publish') {
                
                const parentDiv = h3.parentNode;
    
                if (parentDiv) {
                    const pElement = parentDiv.querySelector('p');
    
                    if (pElement) {
                        output.updatedAt = pElement.innerText;
                    }
                }
            }
        });
        return output;
    }
    
    
    const root = htmlParse(html);
    const sections = root.querySelectorAll('section[class*="flex-l pl1-ns pt3 pb2 ph1 bb b--black-10"]');
    if (!sections) return [];
    const data = sections.map(section => async () => {
        const title = section.querySelector('h3')!.innerText;
        const description = section.querySelector('p')!.innerText; 
        let returnData = getNodeInfo(await cacheHtml(sources["node"].defaultUrl + "package/" + title))
        returnData.title = title;
        returnData.description = description;
        return returnData;
    });

    const results = await Promise.all(data.map(func => func()));
    return results;
}

function parseGithubSearch(html: string){
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
   
    function stripEmphasis(str: string){
        return str.replaceAll("<em>", "").replaceAll("</em>", "");
    }
    const root = JSON.parse(html);
    return root.payload.results.map((result: any) => {
        const relativeDate = moment(result.repo.repository.updated_at).fromNow();
        return {
            title: stripEmphasis(result.hl_name),
            updatedAt: relativeDate,
            description: stripEmphasis(result.hl_trunc_description).replace("&amp;", "&"),
            stars: result.followers,
            language: result.language,
        }})
}


function printDenoSearchResult(data: any, tabCount = 1){
   /*
   {
  title: "lodash",
  description: "A modern JavaScript utility library delivering modularity, performance, & extras."
}
*/

    const tabs = tab.repeat(tabCount);
    const tabs1 = tab.repeat(tabCount + 1);
    
    const output = `${tabs}%c${data.title} %c- ${sources["deno"].defaultUrl + data.title}
${tabs1}%c${data.description}
`
    const styles = [
        `font-weight: bold; color: white`,
        `font-weight: normal; color: gray`,
        `font-weight: italic; color: gray`,
    ]
    
    return [output].concat(styles)
}

function printNodeSearchResult(data:any, tabCount= 1){
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
    
    const output = `${tabs}%c${data.title} %c- ${sources["node"].defaultUrl + "package/" + data.title}
${tabs1}%c${data.description}
${tabs1}%c⬇️  ${data.weeklyDownloads}/wk - ⚖️  ${data.unpackedSize} - ⌚ ${data.updatedAt}
`
    const styles = [
        `font-weight: bold; color: red`,
        `font-weight: normal; color: gray`,
        `font-weight: italic; color: maroon`,
        `font-weight: normal; color: gray`,
    ]
    
    return [output].concat(styles)
}


function printGithubSearchResult(data: any, tabCount = 1){
    /*
      title: "lodash/lodash",
        updatedAt: "3 days ago",
        description: "A modern JavaScript utility library delivering modularity, performance, &amp; extras.",
        stars: 58169,
        language: "JavaScript"
    */
    const tabs = tab.repeat(tabCount);
    const tabs1 = tab.repeat(tabCount + 1);
    
    const output = `${tabs}%c${data.title} %c- ${sources["github"].defaultUrl + data.title}
${tabs1}%c${data.description}
${tabs1}⭐ ${data.stars} - 🔣 %c${data.language} - ⌚ ${data.updatedAt}
    `
    const styles = [
        `font-weight: bold; color: green`,
        `font-weight: normal; color: gray`,
        `font-weight: italic; color: green`,
        `font-weight: normal; color: gray`
    ]
    
    return [output].concat(styles)
}

export async function printSearchResults(source: string, library: string, count = 3){
    const searchResults = await cacheHtml(sources[source].searchUrl + library);
    
    switch (source){
        case "deno":{
            const denoSearchResults = await parseDenoSearch(searchResults);
            denoSearchResults.slice(0, count).forEach((result) => {
                console.log(...printDenoSearchResult(result));
            });
            break;
        }case "node":{
            const nodeSearchResults = await parseNodeSearch(searchResults, library);
            nodeSearchResults.slice(0, count).forEach((result) => {
                console.log(...printNodeSearchResult(result));
            });
            break;
        }case "github":{
            const githubSearchResults = await parseGithubSearch(searchResults);
            githubSearchResults.slice(0, count).forEach((result) => {
                
                console.log(...printGithubSearchResult(result));
            });
            break;
        }
    }
}

// const library = "lodash"
// const library = "react"
// await printSearchResults("deno", library);
//await printSearchResults("node", library);
// await printSearchResults("github", library);
