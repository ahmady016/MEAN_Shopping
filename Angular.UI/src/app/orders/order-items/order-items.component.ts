import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../orders.service';
import { CustomersService } from '../../customers.service';
import { ProductsService } from './../../products.service';
import { OrderItem } from '../order';
import { Product } from '../../products/product';

@Component({
  selector: 'order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {

  // to identify product quantity error
  errId: string = "";
  // hold the max quantity
  maxQuantity: number = 0;
  //hold the changed product
  product: Product  = null;
  // hold the orderItem
  orderItem: OrderItem = null;
  // hold cols names
  cols: string[] = [
    "Name",
    "Price",
    "Quantity",
    "total",
    "Delete"
  ];
  // saved messaged
  orderSaved: boolean = false;

  constructor(private OrdSrv: OrdersService,
              private CustSrv: CustomersService,
              private ProdSrv: ProductsService) { }

  ngOnInit() {
    this.ProdSrv.find();
  }

  private _setTotal() {
    this.OrdSrv.activeOrder.total = this.OrdSrv.activeOrder.items.reduce( (total, item) => total+= item.subTotal ,0);
  }

  private _setSubTotal(item: OrderItem) {
    item.subTotal = item.price * item.quantity;
    this._setTotal();
  }

  public checkQuantity(item: OrderItem, maxQuantity?: number) {
    // empty the err id
    this.errId = "";
    // set the max quantity to provided one if not present get the max quantity form item id
    this.maxQuantity = (!maxQuantity)
      ? (this.ProdSrv.products.find(product => product.id === item.id)).quantity
      : maxQuantity;
    // if the wanted quantity greater than the product quantity
    // return errId to be productId
    if(item.quantity > this.maxQuantity)
      return this.errId = item.id;
    this._setSubTotal(item);
  }

  public changeItem(item: OrderItem, id: string) {
    // product changed then change the item id, name, description, price
    this.product = this.ProdSrv.products.find(product => product.id === id);
    item.id = this.product.id;
    item.name = this.product.name;
    item.price = this.product.price;
    item.description = this.product.description;
    // check quantity with max quantity to set err OR set totals
    this.checkQuantity(item, this.product.quantity);
  }

  public removeItem(id:string) {
    this.OrdSrv.activeOrder.items = this.OrdSrv.activeOrder.items.filter(item => item.id !== id);
    this._setTotal();
  }

  public newItem() {
    this.OrdSrv.activeOrder.items.push({
        id: "0",
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        subTotal: 0
      });
  }

  public emptyItems() {
    return this.OrdSrv.activeOrder.items.some(item => item.id === "0" || item.quantity === 0)
  }

  public postOrder() {
    // build the new Order
    this.OrdSrv.newOrder = {
      items: this.OrdSrv.activeOrder.items,
      total: this.OrdSrv.activeOrder.total
    };
    // - post the Order
    this.OrdSrv.postOrder(this.CustSrv.customer.id)
    // clear the items after the newOrder cleared
    let interval = setInterval( () => {
      if(this.OrdSrv.newOrder)
        return;
      this.orderSaved = true;
      clearInterval(interval);
    },1000);
    // hide the saved message after 5 seconds
    setTimeout(() => {
      this.orderSaved = false;
    },5000);
  }

}
