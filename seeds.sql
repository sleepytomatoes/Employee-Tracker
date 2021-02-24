DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mary", "Shelley", 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kurt", "Vonnegut", 2, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Agatha", "Christy", 1, 5);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ivan", "Turgenev", 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ernest", "Hemingway", 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Fyodor", "Dostoyevsky", 6, 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Alice", "Walker", 7);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("William", "Faulkner", 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Toni", "Morrison", 4, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Osamu", "Dazai", 6, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Albert", "Camus", 5, 6);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Virginia", "Woolf", 7);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Merce", "Rodoreda", 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kazuo", "Ishiguro", 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Franz", "Kafka", 5, 7);


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Legal");
INSERT INTO department (name)
VALUES ("Finance");

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Associate", 60000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 70000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 65000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 65000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 80000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Junior Legal", 60000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 100000, 3);
