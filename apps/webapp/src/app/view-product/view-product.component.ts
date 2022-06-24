import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  productId: string | null = null;
  product: any;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');

    console.log('product id here', this.productId);
    this.httpClient
      .get<any>(`http://localhost:4000/product/${this.productId}`)
      .subscribe((data) => {
        this.product = data;
      });
  }
}
