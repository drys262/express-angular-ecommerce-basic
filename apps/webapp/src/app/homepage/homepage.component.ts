import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

type Product = { name: string; price: number; id: string; sku: string };

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  products: Array<Product> = [];
  searchText: string = '';

  constructor(private httpClient: HttpClient) {}

  getProducts() {
    this.httpClient
      .get<any>('http://localhost:4000/products')
      .subscribe((data) => {
        this.products = data;
      });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  onChangeSearch(event: any) {
    this.searchText = event.target.value;
    if (this.searchText === '') {
      this.getProducts();
    }
  }

  addToCart(product: any) {
    this.httpClient.post<any>('http://localhost:4000/add-to-cart', {
      productId: product.id,
      quantity: 1,
    }).subscribe(data => {
      //
    });
  }

  search(e: any) {
    e.preventDefault();
    this.httpClient
      .get<any>(`http://localhost:4000/search?q=${this.searchText}`)
      .subscribe((data) => {
        console.log('data search', data);
        this.products = this.products.filter((product) =>
          data.find((value: any) => value.id === product.id)
        );
      });
  }
}
