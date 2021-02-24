// Dependencies
const mysql = require('mysql'); // database
const inquirer = require('inquirer'); // prompts user
const { clear } = require('console'); // clears console for a cleaner user experience
var colors = require('colors/safe'); // adds color to tables
var Table = require('cli-table'); // formats tables in a visually pleasing way
const validate = require('./lib/validate'); //validating functions

// connection to mySQL established
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: 'employeeTracker_db',
});

// once the connection is made, the first prompt function runs
connection.connect((err) => {
    if (err) throw err;
    initPrompt();
  });

const initPrompt = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Employees by Department',
          'View All Employees by Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Update Employee Role',
          'View All Roles',
          'View All Departments',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View All Employees':
            displayAll();
            break;
  
          case 'View All Employees by Department':
            employeeByDept();
            break;
  
          case 'View All Employees by Manager':
            employeeByMgr();
            break;
  
          case 'Add Employee':
            addEmployee();
            break;

          case 'Add Role':
            addRole();
            break;

          case 'Add Department':
            addDept();
            break;
    
          case 'Update Employee Role':
            updateRole();
            break;

          case 'View All Roles':
            viewRoles();
            break;

          case 'View All Departments':
            viewDepts();
            break;
  
          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

  function displayAll() {
      connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {
          renderTable(err, res);
  })
}

function employeeByDept() {

    connection.query("SELECT name FROM department;", function (err, res) {

        if (err) throw err;

        inquirer
            .prompt({
                name: "deptName",
                type: "list",
                message: "Choose Department",
                choices: nameAndIdArr(err, res, "department")[1]
            })
            .then(function (answer) {
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where name = ? ;", ["manager_first_name", "manager_last_name", answer.deptName], function (err, res) {
                    renderTable(err, res);
                })
            })
    })
} 

function employeeByMgr() {

    clear();

    connection.query("SELECT m.first_name AS ? , m.last_name AS ? , m.id FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id GROUP BY m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {
        let managerArr = nameAndIdArr(err, res, "manager");

        inquirer
            .prompt({
                name: "findMgrName",
                type: "list",
                message: "Choose a Manager",
                choices: managerArr[1]
            })
            .then(function (answer) {
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where m.id = ?;", ["manager_first_name", "manager_last_name", findId(answer, managerArrays)], function (err, res) {
                    renderTable(err, res);
                })
            })
    
    })
}

function addEmployee() {
    clear();

    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let managerArr = nameAndIdArr(err, res, "employee", "yes");
        let roleId = 0;
        let newMgrId = 0;

        connection.query("SELECT title, id FROM role;", function (err,res) {
            
            let roleArr = nameAndIdArr(err, res, "role");

            inquirer
                .prompt([{
                    name: "empName",
                    type: "text",
                    message: "Enter employee's first name:",
                    validate: validate.validateString
                },
               {
                   name: "empLastName",
                   type: "text",
                   message: "Enter employee's last name:",
                   validate: validate.validateString
               },
               {
                   name: "empTitle",
                   type: "list",
                   message: "What is the employee's title?",
                   choices: roleArr[1]
               },
               {
                   name: "empMgr",
                   type: "list",
                   message: "Enter employee's manager",
                   choices: managerArr[1]
               }])
               .then(function(answer) {
                   roleArr[1].forEach((value, i) => {if (answer.empTitle === roleArr[1][i]) {roleId = roleArr[0][i];}});
               
                   managerArrays[1].forEach((value, i) => {if (answer.empManager === managerArrays[1][i]) {newMgrId = managerArrays[0][i];}});

                   if (newMgrId === "NULL") {
                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)", [answer.empName, answer.empLastName, roleId], function (err, res) {
                        if (err) throw err;
                        clear();
                        let success = colors.brightGreen(`You've succesfully added ${answer.empName} ${answer.empLastName}.`)
                        console.log(success)

                        initPrompt();
                    })
                }
                else {
                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [answer.empName, answer.empLastName, roleId, newManagerId], function (err, res) {
                        if (err) throw err;
                        clear();
                        let success = colors.brightGreen(`You've succesfully added ${answer.empName} ${answer.empLastName}.`)
                        console.log(success)

                        initPrompt();
                    })
                }
            })
    })
})
}

function renderTable(err, res) {
    if (err) throw err;
    clear();

    console.log(res);
// Render the table using cli-table for a more fancy user experience
var table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });
  
  let tableHeaders = [colors.brightGreen.bold("ID"), colors.brightGreen.bold("First Name"), colors.brightGreen.bold("Last Name"), colors.brightGreen.bold("Title"), colors.brightGreen.bold("Department"), colors.brightGreen.bold("Salary"), colors.brightGreen.bold("Manager")];
  table.push(tableHeaders);

  res.forEach(() => {
  table.push([
    res[i].id, 
    res[i].first_name, 
    res[i].last_name, 
    res[i].title, 
    res[i].name, 
    res[i].salary, 
    res[i].manager_first_name + " " + res[i].manager_last_name])});

  let finalTable = table.toString();
  console.log(finalTable);

  initPrompt();

}
            