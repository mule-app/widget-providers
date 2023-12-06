export abstract class ProductProvider {
  platform: string;
  constructor(platform: string) {
    this.platform = platform;
  }

  abstract getProtectionVariants() : Promise<Array<Product>>;
}

export interface Product {
  id: string,
  price: number
}
