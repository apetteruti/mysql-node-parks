var mysql = require("mysql");
var inquirer = require("inquirer");
// var Table = require("cli-table");
var Table = require('easy-table')

// var table = new Table({
//   head: ["Park Name", "Location", "Visited"],

//   style: {
//     head: ['white'],
//     compact: false,
//     colAligns: ["center"]
//   }

// });

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

  console.log("-----WELCOME TO The National Parks Tracker-----")

  connection.query("SELECT parks_name, location, visited FROM park", function (err, results) {
    if (err) throw err;
    // for (var i = 0; i < results.length; i++) {
    //   table.push(
    //     [results[i].parks_name, results[i].location, results[i].visitors]
    //   );
    // }
    // console.log(results);
    console.log(Table.print(results));
    optionsMenu();
  });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  readParks();
});

function createPark() {
  inquirer.prompt([{
        name: "parks_name",
        type: "input",
        message: "What is the name of the park you would like to add?"
      },
      {
        name: "location",
        type: "input",
        message: "In which state is the park located?"
      },
      {
        name: "visited",
        type: "confirm",
        message: "Have you visited this park?"
      }
    ])
    .then(function (answer) {
      connection.query("INSERT INTO park SET ?", {
        parks_name: answer.parks_name,
        location: answer.location,
        visited: answer.visited

      }, function (err, res) {
        console.log(res)
        optionsMenu();
      })
    })
};

function updatePark(){
  connection.query("SELECT parks_name FROM park", function(err, results){
  if(err) throw err;
  inquirer.prompt([{
    name: "choice",
    type: "rawlist",
    choices: function(){
      var choiceArray = [];
      for (var i=0; i<results.length; i++){
        choiceArray.push(results[i].parks_name);
      }
      return choiceArray;
    },
    message: "Which park have you visited?"
  }])
  .then(function(answer){
    connection.query ("UPDATE park SET ? WHERE ?", [
      {visited: true},
      {
      parks_name: answer.choice
    }], function(err, res){
      console.log(answer.choice + "has been set to Visited!");
      optionsMenu();
    })
  })
})
}

function deletePark() {
  connection.query("SELECT parks_name FROM park", function (err, results) {
  if (err) throw err;
  inquirer.prompt([{
      name: "choice",
      type: "rawlist",
      choices: function () {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].parks_name);
        }
        return choiceArray;
      },
      message: "Which park would you like to remove from the list?"
      }])
      .then(function (answer) {
        connection.query("DELETE FROM park WHERE ?", {
          parks_name: answer.choice
        }, function (err, res) {
          console.log(Table.print(res));
          optionsMenu();
        })
      })
  }
  )
}

var optionsMenu = function () {
  inquirer.prompt([{

    name: "options",
    type: "list",
    choices: ["See park list", "Create a new park", "Update a park", "Delete a park"],
    message: "What would you like to do?"

  }]).then(function (answer) {
    switch (answer.options) {
      case "See park list":
        readParks();
        break;
      case "Create a new park":
        createPark();
        break;
      case "Delete a park":
        deletePark();
        break;
      case "Update a park":
        updatePark();
        break;
    }
  })
}