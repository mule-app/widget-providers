export interface CartItem {
  id: string;
  price: number;
  quantity?: number;
  title?: string;
  linePrice?: number;
  sku?: string;
  taxable?: boolean;
  handle?: string;
  requiresShipping?: boolean;
}

export interface Cart {
  totalPrice: number;
  totalDiscount?: number;
  totalWeight?: number;
  itemCount: number;
  requiresShipping?: boolean;
  currency: string;
  items: [CartItem];
}

export abstract class CartProvider {
  platform: string;
  constructor(platform: string) {
    this.platform = platform;
  }

  abstract getCart() : Promise<Cart>;

  abstract addProtectionItem(variantId: string, { attributes } : { attributes: any }) : Promise<void>;

  abstract removeProtectionItem({ attributes } : { attributes: any }) : Promise<void>;

  abstract getProtectionItems(cart: Cart): Promise<Array<CartItem>>;

  abstract setAttributes(attributes: { attributes: any }): Promise<void>;

  getPlatform() : string {
    return this.platform;
  }
}
