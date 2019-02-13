var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require ("cli-table");

var table = new Table({
  head: ["Item Id", "Product Name", "Price"],
      
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

  console.log ("-----WELCOME TO BAMAZON!-----")
  
  connection.query("SELECT * FROM park", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
         table.push(
        [results [i].id, results[i].parks_name, results[i].location]
      );
    }
    console.log(table.toString());
  });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  readParks();
});

