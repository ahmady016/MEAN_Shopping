import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductsService } from './../../products.service';
import { Product } from './../product';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public cols: string[] = [
    "id",
    "name",
    "description",
    "quantity",
    "price",
    "Actions"
  ];

  constructor(public ProdSrv:ProductsService) { }

  ngOnInit() {
    this.ProdSrv.find();
  }

}
