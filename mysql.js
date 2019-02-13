var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require ("cli-table");

var table = new Table({
  head: ["Park Name", "Location"],
      
      style: {
        head: ['white'],
        compact: false,
        colAligns: ["center"]
      }

    });

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "parks"
});

function readParks() {

  console.log ("-----WELCOME TO The National Parks Tracker-----")
  
  connection.query("SELECT parks_name,location FROM park", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
         table.push(
        [results[i].parks_name, results[i].location]
      );
    }
    // console.log(results);
    console.log(table.toString());
    optionsMenu();
  });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  readParks();
});

function createPark(){
connection.query("CREATE (parks_name, location) VALUES ??")

}


var optionsMenu = function () {

  inquirer.prompt([{

      name: "options",
      type: "list",
      choices: ["Create a new park", "Update a park", "Delete a Park"],
      message: "What would you like to do?"

  }]).then(function (answer) {
      switch (answer.options) {
          case "Create a new park":
              createPark();
              break;
          case "Update a park":
              updatePark();
              break;
          case "Delete a park":
              deletePark();
              break;
      }
  })
}
