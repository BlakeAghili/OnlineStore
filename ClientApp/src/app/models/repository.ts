import { Product } from "./product.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class Repository {
  product: Product;
  constructor(private http: HttpClient) {
    // this.product = JSON.parse(document.querySelector("#data").textContent);
    this.getProduct(1);
  }

  getProduct(id: number) {
    this.http.get<Product>("/api/products/" + id).subscribe(p => this.product = p);
  }
}
