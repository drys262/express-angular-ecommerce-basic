import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css'],
})
export class UserCartComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'sku',
    'quantity',
    'actions',
  ];
  dataSource: Array<{
    id: string;
    userId: string;
    quantity: number;
    status: string;
    sku: string;
    price: string;
    name: string;
  }> = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get<any>('http://localhost:4000/user-cart')
      .subscribe((data) => {
        this.dataSource = data.map((value: any) => ({
          id: value.id,
          quantity: value.quantity,
          sku: value.product.sku,
          price: value.product.price,
          name: value.product.name,
        }));
      });
  }

  removeFromCart(row: any) {
    console.log('REMOVE FROM CART', row);
    this.httpClient
      .post<any>('http://localhost:4000/remove-to-cart', {
        cartId: row.id,
      })
      .subscribe((data) => {
        //
        this.dataSource = this.dataSource.filter((data) => data.id !== row.id);
      });
  }
}
