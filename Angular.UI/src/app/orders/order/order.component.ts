import { Customer } from './../../customers/customer';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../products.service';
import { OrdersService } from './../../orders.service';
import { CustomersService } from './../../customers.service';
import { Product } from '../../products/product';
import { OrderItem } from '../../orders/order';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  // hold the total
  total: number = 0;
  // to identify product quantity error
  errId: string = "";
  //hold the found orderItem
  found: OrderItem  = null;
  // hold the orderItem
  orderItem: OrderItem = null;
  // hold orderItems
  orderItems: OrderItem[] = [];
  // hold cols names
  cols: string[] = [
    "Name",
    "Price",
    "Qnt",
    "total",
    "Del"
  ];
  // no customer
  notFound: boolean = false;
  // saved messaged
  orderSaved: boolean = false;

  constructor(private ProdSrv: ProductsService,
              private OrdSrv: OrdersService,
              private CustSrv: CustomersService) { }

  ngOnInit() {
    // get all products
    this.ProdSrv.find();
    // subscribe to orderSaved event to clear the items after the newOrder saved
    this.OrdSrv.orderSaved$.subscribe( res => {
      if(!res)
        return;
      // empty the orderItems table and the total
      this.orderItems = [];
      this.total = 0;
      // show the order saved message
      this.orderSaved = true;
      // hide the saved message after 5 seconds
      setTimeout(() => {
        this.orderSaved = false;
      },5000);
    });
  }

  private _calcTotals(item: OrderItem, quantity?: number) {
    // calc the subTotal
    item.subTotal = item.price * item.quantity;
    // cals the total [add the all subtotal or the new quantity]
    this.total += (quantity)
                  ? item.price * quantity
                  : item.subTotal
  }

  addItem(product: Product, quantity: number) {
    // empty the err id
    this.errId = "";
    // if the wanted quantity greater than the product quantity
    // return errId to be productId
    if(quantity > product.quantity)
      return this.errId = product.id;
    // if the product exists in orderItems get it
    this.found = this.orderItems.find(item => item.id === product.id);
    // if already exists
    if(this.found) {
      // if the sum is greater than product quantity return errId to be productId
      if( this.found.quantity+quantity > product.quantity)
        return this.errId = product.id;
      // add wanted quantity to prev quantity
      else {
        this.found.quantity += quantity;
        this._calcTotals(this.found, quantity);
      }
    }
    // if new product
    else {
      // get the order item
      this.orderItem = {
        ...product,
        quantity
      };
      this._calcTotals(this.orderItem);
      // add it to orderItems
      this.orderItems.push(this.orderItem);
    }
  }

  private _setTotal() {
    this.total = this.orderItems.reduce( (total, item) => total+= item.subTotal ,0);
  }

  removeItem(id:string) {
    this.orderItems = this.orderItems.filter(item => item.id !== id);
    this._setTotal();
  }

  postOrder() {
    // if no orderItems return
    if(!this.orderItems.length)
      return;
    // build the new Order
    this.OrdSrv.newOrder = {
      items: this.orderItems,
      total: this.total
    };
    // if logged customer
    (this.CustSrv.customer)
      // - post the Order
      ? this.OrdSrv.postOrder(this.CustSrv.customer.id)
      // - show the signin - signup links
      : this.notFound = true;
  }

}
