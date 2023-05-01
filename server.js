const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
      name: "MainMenu",
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
    switch (selection.MainMenu) {
    case "View All Employees": showEmployees();
        break;
    case "Add Employee":
      break;
    case "Update employee role":
      break;
    case "View all roles": showRoles();
      break;
    case "Add role":
      break;
    case "View all departments": showDepartments();
      break;
    case "Add department":
      break;
    case "Quit": 
      default:
        break;
    }
  })
};

showDepartments = () =>{
  const sql = `SELECT departments.id AS id, departments.name AS departments FROM departments`;

  db.query(sql, (err, rows) => {
    if(err) throw err;
    console.table(rows);
    init()
  })
}

showRoles = () =>{
  const sql = `SQL code here`

  db.query(sql, (err, rows) =>{
    if(err) throw err;
    console.table(rows);
    init()
  })
}

showEmployees = () =>{
  const sql = `SQL code here`

  db.query(sql, (err, rows) =>{
    if(err) throw err;
    console.table(rows);
    init()
  })
}


app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
