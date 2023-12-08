import { Cart, CartProvider, CartItem } from '../cart';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('Shopify:CartProvider');


export class ShopifyCartProvider extends CartProvider {
  async getProtectionItems(cart: Cart): Promise<CartItem[]> {
    return cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));
  }

  async getCart() : Promise<Cart> {
    try {
      const response = await fetch('/cart.js?provider=mule', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      return {
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
          title: i.title
        } as CartItem))
      };
    } catch (error) {
      debug('Could not fetch cart! %o', error);

      throw error;
    }
  }

  async addProtectionItem(variantId: string, { attributes = null } : { attributes: any }) : Promise<void> {
    const cart: Cart = await this.getCart();

    // Filter out the items that match the criteria ('order' and 'protect' in their handle).
    const items = cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));

    // Prepare the body of the request by setting the quantity of the selected items to 0.
    const body = JSON.stringify({
      updates: {
        // Remove the old protection variants
        ...items.reduce((acc: any, value: CartItem) => {
          acc[value.id] = 0;
          return acc;
        }, {}),

        // Add the new protection variant
        [variantId]: 1
      },
      attributes
    });

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
    return response.json();
  }

  async removeProtectionItem({ attributes = null } : { attributes: any }) : Promise<void> {
    const cart: Cart = await this.getCart();

    // Filter out the items that match the criteria ('order' and 'protect' in their handle).
    const items = cart.items.filter((i: CartItem) => /order/i.test(i.handle!) && /protect/i.test(i.handle!));

    // If there are no items to remove, exit the function early.
    if (!items.length) {
      return;
    }

    // Prepare the body of the request by setting the quantity of the selected items to 0.
    const body = JSON.stringify({
      // Remove all the protection variants from the cart
      updates: items.reduce((acc: any, value: CartItem) => {
        acc[value.id] = 0;
        return acc;
      }, {}),
      attributes
    });

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
    return response.json();
  }
}
