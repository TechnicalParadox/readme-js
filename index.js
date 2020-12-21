// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');

var quick = false;

// TODO: Create an array of questions for user input
const questions = // TODO: Skippable questions should be skipped if quick = true
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
      'Common Development and Distribution License',
      'Eclipse Public License version 2.0',
      'Custom License'
    ],
    default: 'Custom License'
  },
  {
    type: 'confirm',
    name: 'has_badge',
    message: 'Do you have a filepath/URL for your License\'s badge?',
    default: true,
    when: a => {return a.license == 'Custom License';}
  },
  {
    type: 'input',
    name: 'license_badge_url',
    message: 'License Badge Filepath/URL (*):',
    validate: a => {return a ? true : 'Please enter the filepath/url!';},
    when: a => {return a.has_badge;}
  }

  // TODO: Let user add screenshots (required)

  // TODO: Ask user for contributors (required)

  // TODO: Ask user for features (if !quick), each feature emphasized with description

  // TODO: if !quick, ask user for example tests of application (if applicable)

  // TODO: Check if the user wants to change anything and change it
];

// Function to write README file
function writeToFile(fileName, data)
{
  console.log(data);
  const readmeMD = generateMarkdown(data);
  fs.writeFile(('./'+fileName), readmeMD, err =>
    {
      if (err) throw new Error(err);
      console.log("README created! Check out ./"+fileName+" to see it!");
    });
}

// TODO: Create a function to initialize app
function init()
{
  // Check if user wants quick README or full custom.
  inquirer
    .prompt(questions)
    .then(answers => {postPrompter(answers);})
    .catch(error => errorHandler(error));
}

// Handle the answers to the initial inquirer prompt
function postPrompter(answers)
{

  // Save file
  inquirer
    .prompt
    (
      [
        {
          type: 'input',
          name: 'fileName',
          message: 'Save as ("<filename>.md"):',
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
