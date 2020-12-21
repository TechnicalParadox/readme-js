// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license)
{

}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(license)
{

}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license)
{

}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data)
{
  return `
# ${data.title}
##### ${data.desc}
---------------${toc(data.toc)}${install(data.installation)}
## Usage
${data.usage}
${generateImages(data.imageAlts, data.imageURLs)}
`;
}

// Returns the table of contents section, if used
function toc(use)
{
  if (use)
  {
    // TODO: return table of contents depending on what sections are added
    return "\n## Table of Contents: \n * example \n * example \n---------------";
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
  {
    images += "!["+alts[x]+"]("+urls[x]+")\n";
  }
  return images;
}

module.exports = generateMarkdown;
