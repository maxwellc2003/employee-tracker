const inquirer = require('inquirer');
const mysql2 = require('mysql2');

const questions = [{
    type: "list",
    name: "role",
    message: "Select the role of the employee",
    choices: ['Intern', 'Engineer', 'Manager'],
}, {
    type: "text",
    name: "name",
    message: "Enter name:",
}, {
    type: "text",
    name: "id",
    message: "Enter id:",
}, {
    type: "text",
    name: "email",
    message: "Enter email:",
}
];

const promptLoop = () => {
    inquirer.prompt(questions)
    .then 
    }};

promptLoop()