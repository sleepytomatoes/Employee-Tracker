// Dependencies
const mysql = require('mysql'); // database
const inquirer = require('inquirer'); // prompts user
const { clear } = require('console'); // clears console for a cleaner user experience
var colors = require('colors/safe'); // adds color to tables
var Table = require('cli-table'); // formats tables in a visually pleasing way
const headerGraphic = require('./lib/headerGraphic'); //opening graphics

// connection to mySQL established
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: 'employeeTracker_db',
});

// once the connection is made, the first prompt function runs
connection.connect(function (err) {
    if (err) throw err;
    headerGraphic()
    initPrompt();
  });

// initPrompt uses a switch statement to direct the code to the proper functions based on user input
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

  // displayAll combines data from the three tables in our database into one
  function displayAll() {
      connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {
        renderTable(err, res);
          
  })
}

// employeeByDept renders a table by a specific department
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
// employeeByMgr renders a table by a specific manager
function employeeByMgr() {

    clear();

    connection.query("SELECT m.first_name AS ? , m.last_name AS ? , m.id FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id GROUP BY m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {
        let managerArr = nameAndIdArr(err, res, "manager");

        inquirer
            .prompt({
                name: "findThisValue",
                type: "list",
                message: "Choose a Manager",
                choices: managerArr[1]
            })
            .then(function (answer) {
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where m.id = ?;", ["manager_first_name", "manager_last_name", findId(answer, managerArr)], function (err, res) {
                    renderTable(err, res);
                })
            })
    
    })
}
// addEmployee adds an employee into our database 
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
                    message: "Enter employee's first name:"
                },
               {
                   name: "empLastName",
                   type: "text",
                   message: "Enter employee's last name:"
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
               
                   managerArr[1].forEach((value, i) => {if (answer.empManager === managerArr[1][i]) {newMgrId = managerArr[0][i];}});

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
                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [answer.empName, answer.empLastName, roleId, newMgrId], function (err, res) {
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

// addRole adds a new role to the role table in our database
function addRole() {
    clear();
    connection.query("SELECT name, id FROM department;", function (err, res) {

        let nameArrs = nameAndIdArr(err, res, "department")

        inquirer
            .prompt([{
                name: "roleTitle",
                type: "text",
                message: "Enter Title for the new role:"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Enter Salary for the new role:"
            },
            {
                name: "findThisValue",
                type: "list",
                message: "Which department does this role belong to?",
                choices: nameArrs[1]
            },
            ])
            .then(function (answer) {
               
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [answer.roleTitle, answer.roleSalary, findId(answer, nameArrs)], function (err, res) {

                    if (err) throw err;

                    clear();
                    let success = colors.brightGreen(`You've succesfully added ${answer.roleTitle}.`)
                    console.log(success)

                    initPrompt();
                }) 
            }) 
    }) 
}
// addDept adds a new department into the department table in our database
function addDept() {
    clear();

    inquirer
        .prompt({
            name: "departmentName",
            type: "text",
            message: "Enter Department name:"
        })
        .then(function (answer) {
            let thisDepartment = answer.departmentName;

            connection.query("INSERT INTO department (name) VALUES (?);", [answer.departmentName], function (err, res) {

                if (err) throw err;

                clear();

                let success = colors.brightGreen(`You've succesfully added ${thisDepartment}.`)
                console.log(success)

                initPrompt();
            }) 
        }) 

}

// updateRole takes an existing employee and changes their role before adding them back into the table
function updateRole() {
    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let empArrs = nameAndIdArr(err, res, "employee");

        inquirer
            .prompt({
                name: "findThisValue",
                type: "list",
                message: "Select employee to update:",
                choices: empArrs[1]
            })
            .then(function (answer) {
                let selectedEmpName = answer.findThisValue;
                updateThisId = findId(answer, empArrs);

                connection.query("SELECT title, id FROM role;", function (err, res) {

                   let roleArrs = nameAndIdArr(err, res, "role");

                    inquirer
                        .prompt({
                            name: "findThisValue",
                            type: "list",
                            message: "Choose a role",
                            choices: roleArrs[1]

                        })

                        .then(function (answer) {
                            roleId = findId(answer, roleArrs);

                            connection.query("UPDATE employee set role_id = ? where id = ?;", [roleId, updateThisId], function (err, res) {
                                if (err) throw err;
                                clear();
                                let success = colors.brightGreen(`You've succesfully updated ${selectedEmpName}'s role to ${answer.findThisValue}.`)
                                console.log(success)

                                initPrompt();
                            })
                        })
                })
            })
    })
}



// Renders all departments into a table
function viewDepts() {
    connection.query("SELECT name FROM department;", function (err, res) {
        renderTable2(err, res, "Department Name", "name");
    })
}
// Renders all roles into a table
function viewRoles() {
    connection.query("SELECT title FROM role;", function (err, res) {
        renderTable2(err, res, "Role Title", "title");
    })
}

function renderTable(err, res) {
    if (err) throw err;
    clear();

// Render the table using cli-table for a more fancy user experience
let table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });
  
  let tableHeaders = [colors.brightGreen.bold("ID"), colors.brightGreen.bold("First Name"), colors.brightGreen.bold("Last Name"), colors.brightGreen.bold("Title"), colors.brightGreen.bold("Department"), colors.brightGreen.bold("Salary"), colors.brightGreen.bold("Manager")];
  table.push(tableHeaders);

  res.forEach((value, i) => {
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

// Function to render Departments and Roles tables
function renderTable2(err, res, headerTitle, name, answer) {
    clear();
    if (err) throw err;

    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    let tableHeaders = [colors.brightGreen.bold(headerTitle)];
    table.push(tableHeaders);

    if (name === "name") {
        res.forEach((value, i) => {let outputName = res[i].name; table.push([outputName])});
    }

    else if (name === "title") {
        res.forEach((value, i) => {let outputName = res[i].title; table.push([outputName])});
    }

    let finalTable = table.toString();
    console.log(finalTable);

    initPrompt();
}
            
// nameAndIdArr declares two empty arrays, one for names/titles and the other for Id's. The user selects from names, and the queries find the corresponding Ids.
function nameAndIdArr(err, res, nameType, isEmpty) {
    if (err) throw err;
    let empIdArr = [];
    let empNamesArr = [];

    if (isEmpty === "yes") {
        empIdArr.push("NULL")
        empNamesArr.push("none");
        res.forEach((value, i) => {empNamesArr.push(res[i].first_name + " " + res[i].last_name); empIdArr.push(res[i].id);});
        }
    if (nameType === "manager") {
        res.forEach((value, i) => {if (res[i].manager_first_name != null) 
            {empNamesArr.push(res[i].manager_first_name + " " + res[i].manager_last_name); empIdArr.push(res[i].id);}});
    }
    if (nameType === "department") {
        res.forEach((value, i) => {empNamesArr.push(res[i].name); empIdArr.push(res[i].id);});
    }
    if (nameType === "role") {
        res.forEach((value, i) => {empNamesArr.push(res[i].title); empIdArr.push(res[i].id);});
    }
    if (nameType === "employee") {
        res.forEach((value, i) => {empNamesArr.push(res[i].first_name + " " + res[i].last_name); empIdArr.push(res[i].id);});
    }
    return empArrs = [empIdArr, empNamesArr];
}
// Using the Name and ID arrays, findId compares the user-response to the Name array and returns the ID located in the same position in the ID array.
let findId = (answer, nameArrs) => {nameArrs[1].forEach((value, i) => {if (answer.findThisValue === value) {useThisId = nameArrs[0][i];}});
      return useThisId;   
}
