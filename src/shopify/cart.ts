import Debug from 'debug';
import { Cart, CartProvider, CartItem } from '../cart';

const debug = Debug('MuleWidget:Shopify:CartProvider');

export class ShopifyCartProvider extends CartProvider {
  async setAttributes(attributes: { attributes?: any } = {}): Promise<void> {
    const logger = debug.extend('setAttributes');

    logger('POST: /cart/update.js?provider=mule, body: %o', { attributes });
    const response = await fetch('/cart/update.js?provider=mule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes })
    });

    // Check if the response is not OK (status code not in the range 200-299).
    if (!response.ok) {
      // Throw an error with the status code to indicate the failure.
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response.
    const res = await response.json();
    logger('Response: %o', res);

    return res;
  }

  async getProtectionItems(cart: Cart): Promise<CartItem[]> {
    return cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));
  }

  async getCart() : Promise<Cart> {
    const logger = debug.extend('getCart');

    try {
      logger('GET: /cart.js?provider=mule');
      const response = await fetch('/cart.js?provider=mule', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      const cart = {
        totalPrice: res.total_price,
        currency: res.currency,
        itemCount: res.item_count,
        requiresShipping: res.requires_shipping,
        totalDiscount: res.total_discount,
        totalWeight: res.total_weight,
        items: res.items.map((i : any) => ({
          id: i.id,
          price: i.price,
          quantity: i.quantity,
          handle: i.handle,
          linePrice: i.line_price,
          requiresShipping: i.requires_shipping,
          sku: i.sku,
          taxable: i.taxable,
          title: i.title,
          productTitle: i.product_title
        } as CartItem))
      };

      logger('Cart: %o', cart);
      return cart;
    } catch (error) {
      logger('Could not fetch cart! %o', error);

      throw error;
    }
  }

  async addProtectionItem(variantId: string, { attributes = {} } : { attributes?: any } = {}) : Promise<void> {
    const logger = debug.extend('addProtectionItem');
    logger('Input: %o', { variantId, attributes });

    const cart: Cart = await this.getCart();
    logger('Cart: %o', cart);

    // Filter out the items that match the criteria ('order' and 'protect' in their handle).
    const items = cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));
    logger('ProtectionItems: %o', items);

    // Prepare the body of the request by setting the quantity of the selected items to 0.
    const body = JSON.stringify({
      updates: {
        // Remove the old protection variants
        ...items.reduce((acc: any, value: CartItem) => {
          acc[value.id] = 0;
          return acc;
        }, {}),

        // Add the new protection variant
        [variantId]: cart.items.length > items.length ? 1 : 0
      },
      attributes
    });

    logger('POST: /cart/update.js?provider=mule, body: %o', body);
    // Perform the fetch request to update the cart.
    const response = await fetch('/cart/update.js?provider=mule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    // Check if the response is not OK (status code not in the range 200-299).
    if (!response.ok) {
      // Throw an error with the status code to indicate the failure.
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response.
    const res = await response.json();
    logger('Response: %o', res);

    return res;
  }

  async removeProtectionItem({ attributes = {} } : { attributes?: any } = {}) : Promise<void> {
    const logger = debug.extend('addProtectionItem');
    logger('Input: %o', { attributes });

    const cart: Cart = await this.getCart();
    logger('Cart: %o', cart);

    // Filter out the items that match the criteria ('order' and 'protect' in their handle).
    const items = cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));
    logger('ProtectionItems: %o', items);

    // Prepare the body of the request by setting the quantity of the selected items to 0.
    const body = JSON.stringify({
      // Remove all the protection variants from the cart
      updates: items.reduce((acc: any, value: CartItem) => {
        acc[value.id] = 0;
        return acc;
      }, {}),
      attributes
    });

    logger('POST: /cart/update.js?provider=mule, body: %o', body);
    // Perform the fetch request to update the cart.
    const response = await fetch('/cart/update.js?provider=mule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    // Check if the response is not OK (status code not in the range 200-299).
    if (!response.ok) {
      // Throw an error with the status code to indicate the failure.
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response.
    const res = await response.json();
    logger('Response: %o', res);

    return res;
  }
}
