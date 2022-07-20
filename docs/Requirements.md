# Vending Machine

## Functional Requirements

1. **Login**
   - Description - allow maintenance to be able to login to the system
   - Basic Flow - operator enters username & password & clicks login
   - Pre-condition - operators should have already registered & have their credentials ready
   - Post-condition - entered credentials will be checked & if entries are correct, the operator is logged in
2. **Update product slot quantity**
   - Pre-condition - items should exist in the inventory in order to be added to the vending machine
   - Post-condition - item quantity is updated in the vending machine
3. **Update coins**
   - Description - buy a product by s
4. **Buy product**
   - Description - buy a product by specifying the product & amount of coins of different types
   - Pre-conditions:
     - machine must be able to return the exact change for purchase to go through
     - product must be available for purchase
     - user has provided enough money
   - Post-conditions:
     - exact change is returned
     - inventory is updated

## Non-Functional Requirements

1. Clean code - descriptive names, modular & cohesive
2. Correctness
3. Completeness
