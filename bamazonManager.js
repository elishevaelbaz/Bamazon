
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
      message: "\nWhat would you like to do?",
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
	console.log("here")
	var query = connection.query("SELECT * FROM products", function(err, res) {
    
    if (err) throw err;

    console.log("now here")

    itemArr = [];
    objArr = [];
    for (var i = 0; i < res.length; i++) {
    	itemArr.push(res[i].product_name);
    	objArr.push(res[i]);
    }
    console.log(itemArr)
    console.log(objArr)

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
      // console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      // instantiate 
		var table = new Table({
    head: ['Product', 'Quantity']
  	, colWidths: [22,10]
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

	
	console.log("hi " + itemArr)
	console.log(objArr)

	inquirer.prompt([
		{	
			type: "list",
			message: "Which item would you like to add more of?",
			name: "item",
			choices: itemArr
		},
		{
			type: "input",
      message: "\nHow many units would you like to add?",
      name: "num",
      // choices: itemArr,

      validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return "Please enter a valid number";
   		}
      // if input is a number but not from 1-10
      else if (parseInt(input) < 1 || parseInt(input) > objArr.length){
      	return "Please enter a number between 1 and the number of items in the table"
      }
      // otherwise
      return true;
    	}
		}
		]).then(answers => {

 	  console.log("Updating the inventory...\n");

 	  var id = itemArr.indexOf(answers.item);

 	 	// newQuantity = objArr[id-1].stock_quantity - ans.amount;

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
      console.log(res.affectedRows + " products updated!\n");
      promptManager();
    }
  );

  // logs the actual query being run
  console.log(query.sql);

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
	},
	{
		type: "input",
		message: "Please enter the quantity in stock",
		name: "quantity",
	},

		]).then(input => {

     console.log("Inserting a new product...\n");
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
      // Call updateProduct AFTER the INSERT completes

      // logs the actual query being run
  console.log(query.sql);

  promptManager();
    }
  );

  
	});
 
}