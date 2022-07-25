# Building a Vending Machine

Your challenge is to design and implement a class representing a basic vending machine capable of keeping track of the number of items of each type currently in the machine, the amount of change currently in the machine for each type of coin, and to return correct change given a product selection and a set of coins submitted. You’ll expose ways of interacting with the vending machine through two separate services / interfaces - one mimicking what “regular users” can do, and the other what a maintenance person has access to.
When you create / configure the vending machine, you specify the types of coins accepted and the number of different products sold. The machine then needs to keep track of inventory - the coins in the machine as well as the number of each product available.
You do not need to worry about currencies as such, but the implementation does have to work with coins that are fractions of whatever currency is used, e.g. cents or pennies. For example, the machine should be possible to configure to use dollars, with 5¢, 10¢, 25¢, 50¢ coins supported.

## Operations available to regular users

A user should be able to do the following (operations exposed as REST endpoints)

* Buy a product by specifying the product slot and the amount of coins of different types. The machine should accept a purchase only when a product is available, the user has provided enough money, and it’s possible for the machine to give exact change back to the user. On success, the change is returned (the amount of coins of each type) and the inventory is updated. Note that it’s not enough that the user provides an amount of money equal to or greater than the unit price, the machine has to actually be able to return the exact change for the purchase to go through.

## Operations available for “maintenance users”

These mimic what a maintenance person would be able to do on a physical vending machine, e.g. collect money, restock products, etc.

Specifically you should be able to:
* Set the price for a product slot
* Adjust the number of items available for a product slot
* Update the coins available in the machine for each type of coin