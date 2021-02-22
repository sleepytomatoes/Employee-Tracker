const mysql = require('mysql');
const inquirer = require('inquirer')

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: process.env.MYSQL,
  database: 'employeeTracker_db',
});

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
          'exit',
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