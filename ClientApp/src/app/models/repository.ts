import { Product } from './product.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Filter } from './configClasses.repository';
import { Supplier } from './supplier.model';

const productsUrl = '/api/products';
const suppliersUrl = '/api/suppliers';

type productsMetaData = {
  data: Product[],
  categories: string[]
};

@Injectable()
export class Repository {
  product: Product;
  products: Product[];
  suppliers: Supplier[] = [];
  filter: Filter = new Filter();
  categories: string[] = [];

  constructor(private http: HttpClient) {
    this.filter.related = true;
    this.getProducts();
  }

  getProduct(id: number) {
    this.http.get<Product>(`${productsUrl}/${id}`)
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

    url = url + '&metadata=true';

    this.http.get<productsMetaData>(url)
      .subscribe(items => {
        this.products = items.data;
        this.categories = items.categories;
      });
  }

  getSuppliers() {
    this.http.get<Supplier[]>(suppliersUrl)
      .subscribe(sups => this.suppliers = sups);
  }

  createProduct(prod: Product) {
    const data = {
      name: prod.name, category: prod.category,
      description: prod.description, price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.post<number>(productsUrl, data)
      .subscribe(id => {
        prod.productId = id;
        this.products.push(prod);
      });
  }

  createProductAndSupplier(prod: Product, supp: Supplier) {
    const data = {
      name: supp.name, city: supp.city, state: supp.state
    };

    this.http.post<number>(suppliersUrl, data)
      .subscribe(id => {
        supp.supplierId = id;
        prod.supplier = supp;
        this.suppliers.push(supp);
        if (prod != null) {
          this.createProduct(prod);
        }
      });
  }

  replaceProduct(prod: Product) {
    const data = {
      name: prod.name, category: prod.category,
      description: prod.description, price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };
    this.http.put(`${productsUrl}/${prod.productId}`, data)
      .subscribe(() => this.getProducts());
  }

  replaceSupplier(supp: Supplier) {
    const data = {
      name: supp.name, city: supp.city, state: supp.state
    };
    this.http.put(`${suppliersUrl}/${supp.supplierId}`, data)
      .subscribe(() => this.getProducts());
  }

  updateProduct(id: number, changes: Map<string, any>) {
    const patch = [];
    changes.forEach((value, key) =>
      patch.push({ op: 'replace', path: key, value }));
    this.http.patch(`${productsUrl}/${id}`, patch)
      .subscribe(() => this.getProducts());
  }

  deleteProduct(id: number) {
    this.http.delete(`${productsUrl}/${id}`)
      .subscribe(() => this.getProducts());
  }

  deleteSupplier(id: number) {
    this.http.delete(`${suppliersUrl}/${id}`)
      .subscribe(() => {
        this.getProducts();
        this.getSuppliers();
      });
  }
}
