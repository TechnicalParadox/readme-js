// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');

// TODO: Create an array of questions for user input
const questions = [];

// Function to write README file
function writeToFile(fileName, data)
{
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
  // Get input from user
  inquirer
    .prompt(questions)
    .then(answers => postPrompter(answers))
    .catch(error => errorHandler(error));
}

// Handle the answers to the initial inquirer prompt
function postPrompter(answers)
{
  // TODO: Check if the user wants to change anything and change it

  // Save file
  let fileName = "README.md";
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
    .then(data => {fileName = data.fileName;})
    .catch(error => errorHandler(error));

  writeFile(fileName, answers);
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
