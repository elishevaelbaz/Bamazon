
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

// to store the items in the database
var productArr = [];

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    productArr = res;

    console.log(" item_id    product_name             price")
    console.log(" -----------------------------------------")
    for (var i = 0; i < res.length; i++) {
      console.log("   " + res[i].item_id + " ".repeat(9 - res[i].item_id.toString().length) + res[i].product_name + " ".repeat(25-res[i].product_name.length) +  res[i].price)
    }

    promptUser();
  });
 }

 function promptUser(){

	inquirer.prompt([
		{
			type: "input",
      message: "\n Please enter the id of the item you would like to buy.",
      name: "item",

      validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return " Please enter a valid number";
   		}
      // if input is a number but not from 1-10
      else if (parseInt(input) < 1 || parseInt(input) > productArr.length){
      	return " Please enter a number between 1 and " + productArr.length
      }
      // otherwise
      return true;
    	}
		},
		{
			type: "input",
      message: "How many units would you like to buy?",
      name: "amount",

      validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return " Please enter a valid number";
   		}
      // otherwise
      return true;
    	}
		}
	]).then(ans => {
		

		var id = ans.item;
		var amt = ans.amount

		//the index in productArr will be one less than the id
		
		//if the store has enough 
		if (productArr[id-1].stock_quantity >= ans.amount){
			//calculate what the new quantity will be
			var newQuantity = productArr[id-1].stock_quantity - ans.amount;
			
			//update sql database and show the cost
			updateProduct(newQuantity, id, amt);
		}
			
		else{
			console.log(" Insufficient quantity! Your order cannot be filled.")
			exitOrCont();
		}

	});
 }

function updateProduct(q, i, a) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: q
      },
      {
        item_id: i
      }
    ],
    function(err, res) {
      console.log(" Purchase Successful!");

      //show the total cost
			var price = productArr[i-1].price;
			var totalPrice = price * a;

			console.log(" Total Cost: $" + totalPrice.toFixed(2))

      exitOrCont();
    });
}

function exitOrCont() {
	inquirer.prompt([
		{
			type: "confirm",
    	message: "\n Would you like to buy something else?",
    	name: "again"
  	}
		]).then(answer => {

			if (answer.again){
				promptUser();
			}
			else{	
				connection.end();	
			}
	});
}

