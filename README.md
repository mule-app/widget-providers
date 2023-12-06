# Mule Widget Provider

# ****Implementation Guide for Custom Platform Provider****

This document serves as a comprehensive guide for developers looking to extend the functionality of our application by implementing the **`CartProvider`** and **`ProductProvider`** for a new e-commerce platform. This guide will walk you through the necessary steps and considerations for integrating a new platform with our existing system.

## **Overview**

Our application is designed to be cross-platform, facilitating interaction with various e-commerce platforms. To achieve this, we utilize two abstract classes: **`CartProvider`** and **`ProductProvider`**. These classes define the essential methods that each specific platform provider must implement to handle cart and product functionalities.

## **Getting Started**

1. **Understand the Abstract Classes:**
    - Familiarize yourself with the **`CartProvider`** and **`ProductProvider`** abstract classes. Understand the methods you need to implement for your platform.
2. **Review Existing Implementations:**
    - Examine the existing implementations (like Shopify) to get a sense of how to structure your code and handle API interactions.

## **Implementing `CartProvider`**

Implementing the **`CartProvider`** for a new platform involves creating a new class that extends the **`CartProvider`** abstract class. This guide will walk you through the process step by step, using the **`ShopifyCartProvider`** as an example.

### **Step 1: Create a New Class**

1. **Extend the `CartProvider` Abstract Class**
    - Create a new TypeScript file for your platform's cart provider.
    - Define a class that extends **`CartProvider`**.
    - Example:
        
        ```ts
        typescriptCopy code
        import { Cart, CartProvider, CartItem } from 'cart';
        
        export default class YourPlatformCartProvider extends CartProvider {
          constructor() {
            super('YourPlatformName');
          }
          // Implement the abstract methods here
        }
        
        ```
        

### **Step 2: Implement Abstract Methods**

1. **`getCart()` Method**
    - This method should fetch the cart details from your platform's API.
    - Example:
        
        ```ts
        async getCart(): Promise<Cart> {
          // Replace with your platform's API endpoint
          const response = await fetch('/your-platform-cart-endpoint');
          const res = await response.json();
        
          // Map the response to the Cart interface
          return {
            // Map properties from res to the Cart interface properties
          };
        }
        ```
        
2. **`addProtectionItem(variantId, attributes)` Method**
    - This method adds a protection item to the cart.
    - Example:
        
        ```ts
        async addProtectionItem(variantId: string, { attributes = null }: { attributes: any }): Promise<void> {
          // Implement your platform's logic to add a protection item
          // You might need to first fetch the current cart, modify it, and then update the cart
        }
        ```
        
3. **`removeProtectionItem(attributes)` Method**
    - This method removes a protection item from the cart.
    - Example:
        
        ```ts
        async removeProtectionItem({ attributes = null }: { attributes: any }): Promise<void> {
          // Implement your platform's logic to remove a protection item
          // Similar to addProtectionItem, fetch the cart, modify it, and update
        }
        ```
        
4. **`getProtectionItems` Method**
    - Implement the logic to filter protection items from the provided cart.
    - Example
        
        ```ts
        async getProtectionItems(cart: Cart): Promise<CartItem[]> {
          return cart.items.filter((item: CartItem) => /order/i.test(item.handle!) && /protect/i.test(item.handle!));
        }
        ```

### **Step 3: Define Platform-Specific Logic**

1. **Interact with Your Platform's Cart API**
    - Each platform has its API for cart operations. Customize the methods to work with your platform's API.
    - For Shopify, the API endpoints are **`/cart.js`** for fetching and **`/cart/update.js`** for updating.
2. **Conform to Interfaces**
    - Ensure the data returned from your API calls aligns with the **`Cart`** and **`CartItem`** interfaces.

### **Step 4: Handle Errors and Async Operations**

1. **Use `async/await`**
    - All network requests should be asynchronous. Use **`async/await`** to handle these operations.
2. **Implement Robust Error Handling**
    - Surround your API calls with **`try-catch`** blocks to handle errors.
    - Example:
        
        ```ts
        async getCart(): Promise<Cart> {
          try {
            const response = await fetch('/your-platform-cart-endpoint');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
          }
        }
        ```
        

## **Implementing `ProductProvider`**

When extending the functionality of our application to a new e-commerce platform, implementing the **`ProductProvider`** is a crucial step. This section will guide you through creating and setting up a **`ProductProvider`** for your specific platform, using the **`ShopifyProductProvider`** implementation as an example.

### **Step 1: Create a New Class**

1. **Extend the `ProductProvider` Abstract Class**
    - Create a new TypeScript file for your platform's product provider.
    - Define a class that extends **`ProductProvider`**.
    - Example:
        
        ```ts
        export default class YourPlatformProductProvider extends ProductProvider {
          constructor() {
            super('YourPlatformName');
          }
          // Implement the abstract method here
        }
        ```
        

### **Step 2: Implement the `getProtectionVariants()` Method**

1. **Fetch Product Details**
    - Implement **`getProtectionVariants()`** to interact with your platform's product API.
    - Example:
        
        ```ts
        async getProtectionVariants(): Promise<Array<Product>> {
          // Replace with your platform's API endpoint
          const response = await fetch('/your-platform-product-endpoint');
          const res = await response.json();
        
          // Map the response to the Product interface
          return res.map((item: any) => ({
            id: item.id,
            price: item.price
          }) as Product);
        }
        ```
        

### **Step 3: Platform-Specific API Interaction**

1. **Customize for Your Platform**
    - Tailor the method to fetch product details from your platform's specific API.
    - In the Shopify example, the endpoint is **`/products/protectmyorder.js`**.
2. **Map API Response to Interface**
    - Ensure that the data you fetch conforms to the **`Product`** interface structure.

### **Step 4: Error Handling**

1. **Robust Error Handling**
    - Use **`try-catch`** blocks to manage errors during API interactions.
    - Example:
        
        ```ts
        typescriptCopy code
        async getProtectionVariants(): Promise<Array<Product>> {
          try {
            const response = await fetch('/your-platform-product-endpoint');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Continue processing response
          } catch (error) {
            console.error('Error fetching product variants:', error);
            throw error; // or handle it as per your error handling strategy
          }
        }
        
        ```
