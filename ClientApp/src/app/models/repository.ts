import { Product } from "./product.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Filter} from "./configClasses.repository";

const productsUrl = '/api/products'
@Injectable()
export class Repository {
  product: Product;
  products: Product[];
  filter: Filter = new Filter();
  constructor(private http: HttpClient) {
    // this.product = JSON.parse(document.querySelector("#data").textContent);
    //this.getProduct(1);
    this.filter.category = 'soccer';
    this.filter.related = true;
    this.getProducts();
  }

  getProduct(id: number) {
    this.http.get<Product>("/api/products/" + id)
      .subscribe(p => this.product = p);
  }

  getProducts() {
    let url = `${productsUrl}?related=${this.filter.related}`;
    if (this.filter.category) {
      url +=  `&category=${this.filter.category}`;
    }
    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }
    this.http.get<Product[]>(url).subscribe(prods => this.products = prods);
  }
}
