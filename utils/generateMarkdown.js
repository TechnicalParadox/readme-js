// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license, customName, customURL, customBadge, badgeURL)
{
  let section = "###License\n";

  switch (license)
  {
    case "Custom License":
      if (customBadge)
        section += "[![License: "+customName+"]("+badgeURL+")]("+customURL+")";
      else
        section += "["+customName+"]("+customURL+")";
      return section;
    case 'None':
      section += "This project does not currently use a license.";
      return section;
    case 'Apache License 2.0':
      section += `[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`;
      return section;
    case 'BSD 3-Clause ("New/Revised") License':
      section += `[![License: BSD 3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)`;
      return section;
    case 'BSD 2-Clause ("Simplified/FreeBSD") License':
      section += `[![License: BSD 2-Clause](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)`;
      return section;
    case 'GNU General Public License v3 (GPLv3)':
      section += `[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)`;
      return section;
    case 'GNU Library or "Lesser" General Public License v3 (LGPLv3)':
      section += `[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)`;
      return section;
    case 'MIT License':
      section += `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`;
      return section;
    case 'Mozilla Public License 2.0':
      section += `[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)`;
      return section;
    case 'Eclipse Public License version 1.0':
      section += `[![License: EPL 1.0](https://img.shields.io/badge/License-EPL%201.0-red.svg)](https://opensource.org/licenses/EPL-1.0)`;
      return section;
  }
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data)
{
  return `
# ${data.title}
##### ${data.desc}
${renderLicenseSection(data.license, data.license_name, data.license_url, data.has_badge, data.license_badge_url)}
---------------${toc(data)}${install(data.installation)}
## Usage
${data.usage}

${generateImages(data.imageAlts, data.imageURLs)}
## Credits
${
  generateContributors(data.contributors, data.contributorURLs) +
  generateList("Features", data.has_features, data.features) +
  generateContGuidelines(data.has_cont_guidlines, data.cont_guidelines) +
  generateList("Tests", data.has_tests, data.tests)
}
`;
}

// Returns the table of contents section, if used
function toc(data)
{
  if (data.toc) // If user wants ToC
  {
    let list = "\n## Table of Contents:\n";
    if (data.installable)
      list += "* [Installation](#installation)\n";
    list += "* [Usage](#usage)\n";
    list += "* [Credits](#credits)\n";
    if (data.has_features)
      list += "* [Features](#features)\n";
    if (data.has_cont_guidlines)
      list += "* [Contribution Guidelines](#contribution-guidelines)\n";
    if (data.has_tests)
      list += "* [Tests](#tests)\n";
    return list+"---------------";
  }
  else
    return "";
}

// Returns the installation instructions, if needed
function install(instructions)
{
  if (instructions)
  {
    return "\n## Installation:\n"+instructions;
  }
  else
    return "";
}

// Returns the formatted markdown images
function generateImages(alts, urls)
{
  let images = "";
  for (let x = 0; x < alts.length; x++)
    images += "!["+alts[x]+"]("+urls[x]+")\n";
  return images;
}

// Returns the contributors
function generateContributors(names, urls)
{
  let contributors = "";
  for (let x = 0; x < names.length; x++)
    contributors += "["+names[x]+"]("+urls[x]+")\n";
  return contributors;
}

function generateList(label, exists, items)
{
  if (exists)
  {
    let list = "## "+ label + "\n";
    for (item of items)
      list += "* " + item + "\n";
    return list;
  }
  else return "";
}

function generateContGuidelines(exists, guidelines)
{
  if (exists)
  {
    if (!guidelines) // Default to contributor covenant
    {
      return "## Contribution Guidelines\n" +
      "[The Contributor Covenant](https://www.contributor-covenant.org/)\n"
    }
    return "## Contribution Guidelines\n"+guidelines+"\n";
  }
  else
    return "";
}

module.exports = generateMarkdown;
