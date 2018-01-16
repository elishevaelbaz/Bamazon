
var mysql = require("mysql");
var inquirer = require("inquirer");

var Table = require('cli-table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

var itemArr = [];
var objArr = [];


connection.connect(function(err) {
  if (err) throw err;
  promptManager();
});

function promptManager(){

	inquirer.prompt([
		{
			type: "list",
      message: "\n What would you like to do?",
      name: "menu",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
		}
	]).then(ans => {
		
		switch(ans.menu){

	  	case "View Products for Sale":
	  	viewProducts();
	  	break;

	  	case "View Low Inventory":
	  	lowInventory();
	  	break;

	  	case "Add to Inventory":
	  	readProducts();
	  	break;

	  	case "Add New Product":
	  	createProduct();
	  	break;

	  	case "Exit":
	  	connection.end();
	  	break;
	  }

		});
 	}

function readProducts(){
	// get the most recent table
	var query = connection.query("SELECT * FROM products", function(err, res) {
    
    if (err) throw err;

    //store the data in arrays
    itemArr = [];
    objArr = [];
    for (var i = 0; i < res.length; i++) {
    	itemArr.push(res[i].product_name);
    	objArr.push(res[i]);
    }

    // prompt and update inventory
    updateInventory();
  })

}

function viewProducts(){
	var query = connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;


    console.log("Items for Sale:")
    
    // instantiate 
		var table = new Table({
    head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
  	, colWidths: [10, 22, 21, 10, 10]
		});
 
		for (var i = 0; i < res.length; i++) {
 			table.push(
    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
 		} 
 		console.log(table.toString());
 		promptManager();
  });
}

function lowInventory(){
  var query = connection.query(
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity <= 5",
    
    function(err, res) {
      // instantiate 
		var table = new Table({
    head: ['Product', 'Quantity']
  	, colWidths: [22, 10]
		});
 
		for (var i = 0; i < res.length; i++) {
 			table.push(
    	[res[i].product_name, res[i].stock_quantity]
			);
 		} 
 		console.log(table.toString());
      
    promptManager();
      
    }
  );
}

function updateInventory(){

	inquirer.prompt([
		{	
			type: "list",
			message: "Which item would you like to add more of?",
			name: "item",
			choices: itemArr
		},
		{
			type: "input",
      message: "\n How many units would you like to add?",
      name: "num",
      // choices: itemArr,

      validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return "Please enter a valid number";
   		}
      // otherwise
      return true;
    	}
		}
	]).then(answers => {

 	  console.log("\nUpdating the inventory...");

 	  var id = itemArr.indexOf(answers.item);

		var query = connection.query(
  	"UPDATE products SET ? WHERE ?",
  	[
    	{
      	stock_quantity: objArr[id].stock_quantity + parseInt(answers.num)
    	},
    	{
      	item_id: parseInt(id) + 1
    	}
  	],
  	function(err, res) {
    	console.log("All Set!");
    	promptManager();
  	});
	});
}

function createProduct() {
	inquirer.prompt([
	{
		type: "input",
		message: "Please enter the item name",
		name: "item"
	},
	{
		type: "input",
		message: "Please enter the department",
		name: "department"
	},
	{
		type: "input",
		message: "Please enter the price",
		name: "price",

		validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return " Please enter a valid number";
   		}
      
      // otherwise
      return true;
    	}
	},
	{
		type: "input",
		message: "Please enter the quantity in stock",
		name: "quantity",

		validate: function (input) {

   	// if input is not a number
   	if (isNaN(input)) {
   		return " Please enter a valid number";
   	}
     // otherwise
     return true;
    }
	},

	]).then(input => {

    console.log("\n Inserting a new product...");
  	var query = connection.query(
    "INSERT INTO products SET ?",
    {
    	product_name:  input.item,
  		department_name: input.department,
  		price: input.price,
  		stock_quantity: input.quantity
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");

      // Call promptManager AFTER the INSERT completes
  		promptManager();
    });

	});
}