import { Product } from "./product.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

const productUrl = '/api/products'
@Injectable()
export class Repository {
  product: Product;
  products: Product[];
  constructor(private http: HttpClient) {
    // this.product = JSON.parse(document.querySelector("#data").textContent);
    //this.getProduct(1);
    this.getProducts(true);
  }

  getProduct(id: number) {
    this.http.get<Product>("/api/products/" + id)
      .subscribe(p => this.product = p);
  }

  getProducts(related = false) {
    this.http.get<Product[]>(`${productUrl}?related=${related}`)
      .subscribe(items => this.products = items);
  }

}
