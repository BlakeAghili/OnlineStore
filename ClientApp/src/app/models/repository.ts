import { Product } from "./product.model";

export class Repository {

  constructor() {
    this.product = JSON.parse(document.querySelector("#data").textContent);
  }

  product: Product;
}
