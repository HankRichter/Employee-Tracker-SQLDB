const inquirer = require("inquirer");
const mysql = require("mysql2");

// Creates the connection to the SQL db.
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "job_db",
  },
  console.log(`Connected the the job database.`)
);

// init function to start the app on a `node server.js`.
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
    // switch case for the user to select what action they would like to perform.
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
        case "Update employee role": updateEmployee();
          break;
        case "Quit":
        default:
          db.close;
          break;
      }
    });
};

// shows all the departments in the job_db.
showDepartments = () => {
  const sql = `SELECT departments.id AS id, department_name AS departments FROM departments`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    init();
  });
};

// shows all the roles, with the department they are in, in the job_db. 
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

// shows all the employees with the role, department, salary and manager. 
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

// allows you to create a department and add it to the job_db.
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

// allows you to create a role and add it to the job_db.
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

// allows you to create an employee and add them to the job_db.
createEmployee = () => {
  let rolesChoices = [];
  let rolesData;
  db.query(`SELECT * FROM roles;`, (err, rows) => {
    if (err) throw err;
    rolesData = rows;
    rows.map((row) => {
      rolesChoices.push(row.title);
    });
  });
  let employeesChoices = [];
  let employeesData;
  db.query(`SELECT * FROM employees;`, (err, rows) => {
    if (err) throw err;
    employeesData = rows;
    rows.map((row) => {
      employeesChoices.push(`${row.first_name} ${row.last_name}`);
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: rolesChoices,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: employeesChoices,
      },
    ])
    .then((userInput) => {
      console.log(userInput);
      const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)`;
      const rolesTitle = rolesData.filter((x) => x.title === userInput.role)[0];
      const manager = employeesData.filter(
        (x) => `${x.first_name} ${x.last_name}` === userInput.manager
      )[0];
      console.log(manager);
      console.log(rolesTitle);
      db.query(
        sql,
        [userInput.firstName, userInput.lastName, rolesTitle.id, manager.id],
        (err) => {
          if (err) throw err;
          console.log(
            `Added ${userInput.firstName}${userInput.lastName} to the database.`
          );
          init();
        }
      );
    });
};

// allows you to update an employee thats already in the job_db.
updateEmployee = () => {
  let employeesChoices = [];
  let employeesData;
  let employeeInput;
  let rolesInput;
  db.promise()
    .query(`SELECT * FROM employees;`)
    .then(([rows]) => {
      employeesData = rows;
      rows.map((row) => {
        employeesChoices.push(`${row.first_name} ${row.last_name}`);
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeesChoices,
          },
        ])
        .then((userInput) => {
          employeeInput = userInput;
          let rolesChoices = [];
          let rolesData;
          db.promise()
            .query(`SELECT * FROM roles;`)
            .then(([rows]) => {
              rolesData = rows;
              rows.map((row) => {
                rolesChoices.push(row.title);
              });
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    message: "What is the employee's new role?",
                    choices: rolesChoices,
                  },
                ])
                .then((userInput) => {
                  const sql = `UPDATE employees SET roles_id = ? WHERE id = ?`;
                  console.log(employeesChoices);
                  console.log(employeeInput);
                  const employee = employeesData.filter(
                    (x) =>
                      `${x.first_name} ${x.last_name}` ===
                      employeeInput.employee
                  )[0];
                  const role = rolesData.filter(
                    (x) =>
                      x.title.toLowerCase() === userInput.role.toLowerCase()
                  )[0];
                  console.log(role);
                  db.query(sql, [role.id, employee.id], (err) => {
                    if (err) throw err;
                    console.log(
                      `Updated ${employeeInput.employee}'s role to ${userInput.role}.`
                    );
                    init();
                  });
                });
            });
        });
    })
    .catch((err) => {
      throw err;
    });
};

init();
