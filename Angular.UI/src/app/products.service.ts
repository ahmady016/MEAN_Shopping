import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Product, deletedProduct } from './products/product';
import { env } from './../environments/environment';

@Injectable()
export class ProductsService {

  public product: Product = null;
  public products: Product[] = null;

  constructor(private http: HttpClient) {}

  public find(id?: string): void {
    if (id && this.products){
      this.product = this.products.find(product => product.id === id);
    } else if (id && !this.products) {
      this.http.get<Product>(`${env.apiUrl}/products/${id}`)
                .subscribe(product => this.product = product);
    } else if (!id && !this.products) {
      this.http.get<Product[]>(`${env.apiUrl}/products`)
                .subscribe(products => this.products = products);
    }
  }

  public add(product: Product): void {
    this.http.post<Product>(`${env.apiUrl}/products/`, product)
             .subscribe(newProduct => this.products.push(newProduct));
  }

  public update(id:string, product: Product): void {
    product.id = id;
    this.http.put<Product>(`${env.apiUrl}/products/${id}`, product)
            .subscribe(updatedProduct => this.products = this.products.map(product => {
              if(product.id === updatedProduct.id)
                return updatedProduct;
              return product;
            }));
  }

  public delete(id): void {
    if (confirm('Are you sure you want to delete this item ?')) {
      this.http.delete<deletedProduct>(`${env.apiUrl}/products/${id}`)
          .subscribe(deletedProduct => this.products = this.products.filter(product => product.id !== deletedProduct.deletedProductId));
    }
  }
}
