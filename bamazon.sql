DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER (10) NOT NULL,
  PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lego", "Toys and Games", 25.95, 3000), ("Toilet Paper", "Health & Household", 7.75, 50000);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HP ink", "Office Products", 35.21, 70), ("White Noise Machine", "Health &Household", 49.99, 150),
("Hot Glue Gun", "Arts & Crafts", 12.85, 333), ("Inflatable Kayak", "Outdoor Recreation", 94.95, 10),
("Tennis Balls", "Sports & Outdoors", 6.96, 475), ("Batman Costume", "Toys and Games", 28.71, 56), 
("Bath Mat", "Home & Kitchen", 12.87, 675), ("Tambourine", "Musical Instruments", 14.99, 7000)
