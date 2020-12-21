// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');

var ui;
var contributors = [], contributorURLs = [];
var imageAlts = [], imageURLs = [];
var features = [];
var tests = [];

// Array of questions for user input
const questions =
[
  {
    type: 'confirm',
    name: 'quick',
    message: 'Would you like to skip the extras and do this quickly?',
    default: false
  },
  // Project Name (Required)
  {
    type: 'input',
    name: 'title',
    message: 'Project Name (*):',
    validate: a => {return a ? true : 'Please enter a project name!'}
  },
  // Project Description (Required)
  {
    type: 'input',
    name: 'desc',
    message: 'Project Description (*):',
    validate: a => {return a ? true : 'Please enter a project description!'}
  },
  // Table of Contents
  {
    type: 'confirm',
    name: 'toc',
    message: 'Display Table of Contents?:',
    default: true,
    when: a => {return !a.quick}
  },
  // Installation Instructions (check if needed)
  {
    type: 'confirm',
    name: 'installable',
    message: 'Is your project to be installed?:',
    default: false,
    when: a => {return !a.quick}
  },
  // Installation Instructions (get if needed)
  {
    type: 'input',
    name: 'installation',
    message: 'Installation Instructions (*):',
    validate: a => {return a ? true : 'Please enter the installation instructions!'},
    when: a => {return a.installable}
  },
  // Usage (Required)
  {
    type: 'input',
    name: 'usage',
    message: 'Instructions for Use/Examples of Use (*):',
    validate: a => {return a ? true : 'Please enter instructions for/examples of use!'}
  },
  // License (Required)
  {
    type: 'list',
    name: 'license',
    message: 'Select a License (*):',
    choices:
    [
      'Apache License 2.0',
      'BSD 3-Clause ("New/Revised") License',
      'BSD 2-Clause ("Simplified/FreeBSD") License',
      'GNU General Public License (GPL)',
      'GNU Library or "Lesser" General Public License (LGPL)',
      'MIT License',
      'Mozilla Public License 2.0',
      'Eclipse Public License version 1.0',
      'Custom License',
      'None'
    ],
    default: 'Custom License'
  },
  // If Custom License, get name
  {
    type: 'input',
    name: 'license_name',
    message: 'Enter the name of the license (*):',
    validate: a => {return a ? true : "Please enter the name of your license!";},
    when: a => {return a.license == "Custom License";}
  },
  // If Custom License, do they have a custom badge?
  {
    type: 'confirm',
    name: 'has_badge',
    message: 'Do you have a filepath/URL for your License\'s badge?:',
    default: true,
    when: a => {return a.license == 'Custom License';}
  },
  // If they have a custom badge, what is the relative filepath/URL?
  {
    type: 'input',
    name: 'license_badge_url',
    message: 'License Badge Filepath/URL (*):',
    validate: a => {return a ? true : 'Please enter the filepath/url!';},
    when: a => {return a.has_badge;}
  },
  // If Custom License, link to URL of terms
  {
    type: 'input',
    name: 'license_url',
    message: 'Enter the URL to the terms of your license (*):',
    validate: a => {return a ? true : 'Please enter the URL to the terms of your license!';},
    when: a => {return a.license == "Custom License";}
  },
  // Contributor(s) (Required)
  {
    type: 'input',
    name: 'contributors',
    message: 'Enter contributors one by one, leave empty when finished, please include any Third Party attributions (*):',
    validate: a =>
    {
      if (!a && contributors.length == 0) // Need to enter at least one name
        return "Please enter a contributor name!"
      else if (!a) // Finished
        return true;
      else // Add to list and ask for next
      {
        console.log("\n" + a + " added to list of contributors.");
        contributors.push(a);
        return false;
      }
    }
  },
  // Contributor URLs (Required)
  {
    type: 'input',
    name: 'contributorURLs',
    message: 'Enter each contributor\'s URL one by one (*):',
    validate: a =>
    {
      if (!a)
        return "Please enter a URL!";
      else
      {
        console.log("\n" + a + " added as the GitHub URL for " +contributors[contributorURLs.length]);
        contributorURLs.push(a);
        if (contributors.length != contributorURLs.length)
          return false;
        else return true;
      }
    }
  },
  // Image Descriptions (Required)
  {
    type: 'input',
    name: 'imageAlts',
    message: 'Enter descriptions of showcase images, one by one, leave blank when finished (*):',
    validate: a =>
    {
      if (!a && imageAlts.length == 0) // Need to enter at least one name
        return "Please enter an image description!"
      else if (!a) // Finished
        return true;
      else // Add to list and ask for next
      {
        console.log("\n" + a + " added to list of image descriptions.");
        imageAlts.push(a);
        return false;
      }
    }
  },
  // Image URLs (Required)
  {
    type: 'input',
    name: 'imageURLs',
    message: 'Enter each image\'s filepath/URL one by one (*):',
    validate: a =>
    {
      if (!a)
        return "Please enter an image filepath/URL!";
      else
      {
        console.log("\n" + a + " added as the filepath/URL for \"" +imageAlts[imageURLs.length] +"\"");
        imageURLs.push(a);
        if (imageAlts.length != imageURLs.length)
          return false;
        else return true;
      }
    }
  },
  // If !quick, ask if user wants to showcase features
  {
    type: 'confirm',
    name: 'has_features',
    message: 'Does your project have features you wish to showcase?:',
    default: false,
    when: a => {return !a.quick;}
  },
  // If user wants to showcase features, get features
  {
    type: 'input',
    name: 'features',
    message: 'Enter features one by one, leave blank when finished (*):',
    validate: a =>
    {
      if (!a && features.length == 0)
        return "Please enter a feature!";
      else if (!a)
        return true;
      else
      {
        console.log("\n" + a + " added as a feature!");
        features.push(a);
        return false;
      }
    },
    when: a => {return a.has_features;}
  },
  // If !quick, ask if user has example tests
  {
    type: 'confirm',
    name: 'has_tests',
    message: 'Do you have example test cases for your project?:',
    default: false,
    when: a => {return !a.quick;}
  },
  // If user has example tests, add them
  {
    type: 'input',
    name: 'tests',
    message: 'Enter example tests, one by one, leave blank when finished (*):',
    validate: a =>
    {
      if (!a && tests.length == 0)
        return "Please enter an example test!";
      else if (!a)
        return true;
      else
      {
        console.log("\n\"" + a + "\" added as an example test.");
        tests.push(a);
        return false;
      }
    },
    when: a => {return a.has_tests}
  },
  // If !quick get ask for Contribution Guidelines
  {
    type: 'confirm',
    name: 'has_cont_guidlines',
    message: 'Does you want to give contribution guidelines?:',
    default: false,
    when: a => {return !a.quick;}
  },
  // If has_cont_guidlines, ask for them.
  {
    type: 'input',
    name: 'cont_guidelines',
    message: 'Enter your contribution guidelines, leave blank to default to the Contributor Covenant:',
    when: a => {return a.has_cont_guidlines;}
  }
  // TODO: Questions section with email/github contact info

  // TODO: Check if the user wants to change anything and change it
];

// Function to write README file
function writeToFile(fileName, data)
{
  const readmeMD = generateMarkdown(data);
  fs.writeFile(fileName, readmeMD, err =>
    {
      if (err) throw new Error(err);
      console.log("README created! Check out "+fileName+" to see it!");
    });
}

// Function to initialize app
function init()
{
  // Prompt the questions.
  inquirer
    .prompt(questions)
    .then(answers => {answerHandler(answers);})
    .catch(error => errorHandler(error));
}

// Handle the answers to the initial inquirer prompt
function answerHandler(answers)
{
  // Store lists in the answers data
  answers.contributors = contributors;
  answers.contributorURLs = contributorURLs;
  answers.imageAlts = imageAlts;
  answers.imageURLs = imageURLs;
  answers.features = features;
  answers.tests = tests;

  // Save file
  inquirer
    .prompt
    (
      [
        {
          type: 'input',
          name: 'fileName',
          message: 'Save as ("<filename>.md"):',
          default: 'README.md',
          validate: a => {return a ? true : 'Please enter "<filename>.md"!'}
        }
      ]
    )
    .then(data => {writeToFile(data.fileName, answers);})
    .catch(error => errorHandler(error));
}

// Handle any errors that occur from the inquirer prompt
function errorHandler(error)
{
  if (error.isTtyError)
    console.log("Error: Prompt couldn't be rendered in the current environment.");
  else
    console.log("Error:", error);
}

// Function call to initialize app
init();
