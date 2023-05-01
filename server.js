const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "job_db",
  },
  console.log(`Connected the the job database.`)
);

const init = () =>{
    inquirer.prompt([
      {
      type: "list",
      name: "Main Menu",
      message: 'What would you like to do?',
      choices: [
      "View All Employees",
      "Add Employee",
      "Update employee role",
      "View all roles",
      "Add role",
      "View all departments",
      "Add department",
      "Quit"]
    }
  ]).then(selection =>{
    switch (selection.int) {
    case "View All Employees":
        break;
    case "Add Employee":
      break;
    case "Update employee role":
      break;
    case "View all roles":
      break;
    case "Add role":
      break;
    case "View all departments":
      break;
    case "Add department":
      break;
    case "Quit": 
      default:
        break;
    }
  })
};

