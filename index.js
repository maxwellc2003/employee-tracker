const inquirer = require("inquirer");
const db = require("./db/connection");

const options = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];


const departmentQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the department?",
  },
];

const promptLoop = async () => {
  const connection = await db;

  const choice = await inquirer.prompt(options);

  if (choice.choice == "View All Employees") {
    const [rows] = await connection.query("SELECT * FROM employee;");

    console.table(rows);
  }

  if (choice.choice == "View All Roles") {
    const [rows] = await connection.query("SELECT * FROM role;");

    console.table(rows);
  }

  if (choice.choice == "View All Departments") {
    const [rows] = await connection.query("SELECT * FROM department;");

    console.table(rows);
  }

  if (choice.choice == "Quit") {
    process.exit(0);
  }

  if (choice.choice == "Add Employee") {
    const [roles] = await connection.query("SELECT * FROM role;");
    const [managers] = await connection.query("SELECT * FROM employee;");

    const employee = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter Employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter Employee's last name:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Enter Employee's role:",
        choices: roles.map( ({id, title}) => ({name: title, value:id}) )
      },
      {
        type: "list",
        name: "manager_id",
        message: "Enter Employee's manager:",
        choices: [{name: "None", value: null},...managers.map( ({id, first_name, last_name}) => ({name: first_name + " " + last_name, value:id}) )]
      },
    ]);

    const [rows] = await connection.query(
      "INSERT INTO employee SET ?",
      employee
    );
  }

  if (choice.choice == "Update Employee Role") {
    const [employees] = await connection.query("SELECT * FROM employee;");
    const [roles] = await connection.query("SELECT * FROM role;");

    const update = await inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "Which employee's role would you like to update?",
        choices: employees.map( ({id, first_name, last_name}) => ({name: first_name + " " + last_name, value:id}) )
      },
      {
        type: "list",
        name: "role",
        message: "Which role would you like to switch them to?",
        choices: roles.map( ({id, title}) => ({name: title, value:id}) )
      },
    ]);

    const [rows] = await connection.query(
      "UPDATE employee SET role_id = " +
        update.role +
        " WHERE id = " +
        update.name
    );
  }

  if (choice.choice == "Add Role") {
    const [departments] = await connection.query("SELECT * FROM department;");

    const role = await inquirer.prompt(    [
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departments.map( ({id, name}) => ({name, value:id}) )
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
    ]);

    const [rows] = await connection.query("INSERT INTO role SET ?", role);
  }

  if (choice.choice == "Add Department") {
    const department = await inquirer.prompt(departmentQuestions);

    const [rows] = await connection.query(
      "INSERT INTO department SET ?",
      department
    );
  }

  promptLoop();
};

promptLoop();
