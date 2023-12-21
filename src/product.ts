export interface Product {
  id: string,
  price: number
}

export interface ProtectionProduct {
  id?: string,
  handle?: string
}

export abstract class ProductProvider {
  platform: string;
  protection?: ProtectionProduct;
  constructor(platform: string, protection?: ProtectionProduct) {
    this.platform = platform;
    this.protection = protection;
  }

  abstract getProtectionVariants() : Promise<Array<Product>>;
}
