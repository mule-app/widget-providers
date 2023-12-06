import { Product, ProductProvider } from 'product';

export default class ShopifyProductProvider extends ProductProvider {
  async getProtectionVariants() : Promise<Array<Product>> {
    try {
      // Configuring the fetch request
      const response = await fetch('/products/protectmyorder.js?provider=mule', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parsing and returning the JSON response
      const product = await response.json();

      return product.variants.map((i: any) => ({ id: i.id, price: i.price } as Product));
    } catch (error) {
      // Handle any errors
      console.error('There was an error getting protection variants!', error);
      // You might want to re-throw the error or handle it appropriately
      throw error;
    }
  }
}
