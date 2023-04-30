INSERT INTO departments (department_name)
VALUES 
("Engineering"),
("Finance"),
("Legal"),
("Sales");

INSERT INTO roles (department_id, role_title, role_salary)
VALUES 
(4, "Sales Lead", 100000),
(4,"Salesperson",80000),
(1,"Lead Engineer",150000),
(1,"Software Engineer",120000),
(2,"Account Manager", 160000),
(2,"Accoutant",125000),
(3,"Legal Team Lead",250000),
(3, "Lawyer",190000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("John", "Doe", 1),
("Mike","Chan", 2, 1),
("Ashley", "Rodriguez", 3),
("Kevin", "Tupik", 4, 3),
("Kunal", "Singh", 5),
("Malia", "Brown", 6, 5),
("Sarah", "Lourd", 7),
("Tom", "Allen", 8, 7)