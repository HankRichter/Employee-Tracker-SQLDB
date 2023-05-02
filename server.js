const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "job_db",
  },
  console.log(`Connected the the job database.`)
);

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "MainMenu",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then((selection) => {
      switch (selection.MainMenu) {
        case "View all departments":
          showDepartments();
          break;
        case "View all roles":
          showRoles();
          break;
        case "View all employees":
          showEmployees();
          break;
        case "Add department":
          createDepartment();
          break;
        case "Add role":
          createRole();
          break;
        case "Add employee":
          createEmployee();
          break;
        case "Update employee role":
          break;
        case "Quit":
        default:
          db.close;
          break;
      }
    });
};

showDepartments = () => {
  const sql = `SELECT departments.id AS id, department_name AS departments FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    init();
  });
};

showRoles = () => {
  const sql = `SELECT roles.title, roles.salary, departments.department_name AS department
  FROM roles
  LEFT JOIN departments ON departments.id = roles.departments_id `;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
};

showEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name AS department, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.roles_id = roles.id
  LEFT JOIN departments ON roles.departments_id = departments.id
  LEFT JOIN employees managers ON employees.manager_id = managers.id`;

  db.query(sql, (err, rows) => {
    console.log(err);
    if (err) throw err;
    console.table(rows);
    init();
  });
};

createDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((userInput) => {
      const sql = `INSERT INTO departments (department_name) VALUES (?)`;
      db.query(sql, [userInput.department], (err) => {
        if (err) throw err;
        console.log(`Added ${userInput.department} to the database.`);
        init();
      });
    });
};

createRole = () => {
  let departmentChoices = [];
  let departmentsData;
  db.query(`SELECT * FROM departments;`, (err, rows) => {
    if (err) throw err;
    departmentsData = rows;
    rows.map((row) => {
      departmentChoices.push(row.department_name);
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ])
    .then((userInput) => {
      const sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?,?,?)`;
      const departmentId = departmentsData.filter(
        (x) =>
          x.department_name.toLowerCase() === userInput.department.toLowerCase()
      )[0];
      console.log(userInput);
      db.query(
        sql,
        [userInput.title, userInput.salary, departmentId.id],
        (err, rows) => {
          if (err) throw err;
          console.log(`Added ${userInput.title} to the database.`);
          init();
        }
      );
    });
};

createEmployee = () => {
  let rolesChoices = [];
  let departmentsData;
  db.query(`SELECT * FROM departments;`, (err, rows) => {
    if (err) throw err;
    departmentsData = rows;
    rows.map((row) => {
      departmentChoices.push(row.department_name);
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ])
    .then((userInput) => {
      const sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?,?,?)`;
      const departmentId = departmentsData.filter(
        (x) =>
          x.department_name.toLowerCase() === userInput.department.toLowerCase()
      )[0];
      console.log(userInput);
      db.query(
        sql,
        [userInput.title, userInput.salary, departmentId.id],
        (err, rows) => {
          if (err) throw err;
          console.log(`Added ${userInput.title} to the database.`);
          init();
        }
      );
    });
};

init();

// app.use((req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
