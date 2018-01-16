
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

// var itemArr = [];
// to store the items in the database
var productArr = [];

var newQuantity;

var id;

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
  // promptUser();
});


function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    //clear out the itemArr
    // itemArr = [];
    productArr = res;

    console.log("item_id   product_name              price")
    console.log("-----------------------------------------")
    for (var i = 0; i < res.length; i++) {
    	// var numSpaces = 5 - (i+1) / 10;
    	// console.log(numSpaces)
      console.log("  " + res[i].item_id + " ".repeat(9 - res[i].item_id.toString().length) + res[i].product_name + " ".repeat(25-res[i].product_name.length) +  res[i].price)
    	// itemArr.push(res[i].item_id + " " + res[i].product_name)
    }

    // console.log(res);
    // console.log("itemArr " + itemArr)
    promptUser();
  });
 }

 function promptUser(){

	inquirer.prompt([
		{
			type: "input",
      message: "\nPlease enter the id of the item you would like to buy.",
      name: "item",
      // choices: itemArr,

      validate: function (input) {

   		// if input is not a number
   		if (isNaN(input)) {
   			return "Please enter a valid number";
   		}
      // if input is a number but not from 1-10
      else if (parseInt(input) < 1 || parseInt(input) > productArr.length){
      	return "Please enter a number between 1 and " + productArr.length
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
   			return "Please enter a valid number";
   		}
      // otherwise
      return true;
    	}
		}
	]).then(ans => {
		

		// id = ans.item.substr(0, ans.item.indexOf(' '));
		id = ans.item;

		//the index will be one less than the id
		
		//if the store has enough 
		if (productArr[id-1].stock_quantity >= ans.amount){
			//calculate what the new quantity will be
			newQuantity = productArr[id-1].stock_quantity - ans.amount;
			
				
			//show the total cost
			var price = productArr[id-1].price;
			var totalPrice = price * ans.amount;

	console.log("total cost: $" + totalPrice.toFixed(2))

	//update sql database
			updateProduct();

		}
			
		else{
			console.log("Insufficient quantity! Your order cannot be filled.")
			exitOrCont();
		}

	});
 }

 function updateProduct() {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n");
      exitOrCont();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
  
}

function exitOrCont() {
	inquirer.prompt([
		{
			type: "confirm",
    	message: "Would you like to buy something else?",
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

