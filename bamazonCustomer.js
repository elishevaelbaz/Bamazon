
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

var itemArr = [];
// to store the items in the database
var productArr = [];

var newQuantity;

var id;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
  // promptUser();
});


function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    //clear out the itemArr
    itemArr = [];
    productArr = res;

    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " " + res[i].product_name)
    	itemArr.push(res[i].item_id + " " + res[i].product_name)
    }

    // console.log(res);
    // console.log("itemArr " + itemArr)
    promptUser();
  });
 }

 function promptUser(){

	inquirer.prompt([
		{
			type: "list",
      message: "Which item would you like to buy?",
      name: "item",
      choices: itemArr
		},
		{
			type: "input",
      message: "How many units would you like to buy?",
      name: "amount"
		}
	]).then(ans => {
		

		id = ans.item.substr(0, ans.item.indexOf(' '));

		//the index will be one less than the id
		
		//if the store has enough 
		if (productArr[id-1].stock_quantity >= ans.amount){
			//calculate what the new quantity will be
			newQuantity = productArr[id-1].stock_quantity - ans.amount;
			//update sql database
			updateProduct();
				
			//show the total cost
			var price = productArr[id-1].price;
			var totalPrice = price * ans.amount;

	console.log("total cost: $" + totalPrice)
		}
			
		else{
			console.log("Insufficient quantity! Your order cannot be filled")
			//insufficient quantity - do nothing
		}

		console.log(price)

		console.log(id +"id " + id)
		console.log(id == 1);
		console.log(id ===1)

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
      
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}


