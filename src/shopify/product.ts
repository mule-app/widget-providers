import { Product, ProductProvider } from '../product';
import Debug from 'debug';

const debug = Debug('MuleWidget:Shopify:ProductProvider');

export class ShopifyProductProvider extends ProductProvider {
  async getProtectionVariants() : Promise<Array<Product>> {
    const productHandle = this.protection?.handle ?? 'protectmyorder';
    const logger = debug.extend('getProtectionVariants');

    try {
      logger(`Sending request to: /products/${productHandle}.js?provider=mule`);

      // Configuring the fetch request
      const response = await fetch(`/products/${productHandle}.js?provider=mule`, {
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
      logger('Response: %o', product);

      return product.variants.map((i: any) => ({ id: i.id, price: i.price } as Product));
    } catch (error) {
      // Handle any errors
      logger('There was an error getting protection variants! %o', error);
      // You might want to re-throw the error or handle it appropriately
      throw error;
    }
  }
}
