# Bamazon

### Overview

This activity is a command-line Amazon-like storefront using node and MySQL.

### Node Packages

This app uses mysql, inquirer and cli-table node packages (see package.JSON)

## Instructions

skills you learned this week. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.


## Instructions

### Customer View

* The user types `node bamazonCustomer.js` in the terminal/bash window to run the app.

* The app will display the items for sale from the corresponding MySQL database (bamazon_db)

* The app will prompt the user to input the ID of the product they would like to buy and how many units.

* It will check how much of that product is in stock:

	* If there is enough to meet the user's request
		* the order will be fulfilled
		* the stock quantity in the database will be updated to reflect the remaining quantity
		* the user will be informed of the total cost.

	* If there is not enough of the product in stock
		* the user is informed that the order cannot be fulfilled.

- - -

### Manager View

* The user types `node bamazonCustomer.js` in the terminal/bash window to run the app.

* Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product
    
    * Exit

  * If a manager selects `View Products for Sale`, the app will display a table of every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it will list all items with an inventory count less than or equal to five.

  * If a manager selects `Add to Inventory`, the app will display a set of prompts that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it will display a set of prompts to allow the manager to add a completely new product to the store.

* If a manager selects `Exit`, it will end the connection to the database and stop running the app.
- - -
