import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/environment';
import { Order } from './orders/order';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OrdersService {

  private _orderSaved: Subject<boolean> = new Subject<boolean>();
  public orderSaved$ = this._orderSaved.asObservable();

  public newOrder: Order = null;
  public activeOrder: Order = null;
  public orders: Order[] = [];

  constructor(private http: HttpClient) {}

  private _orderByDate() {
    this.orders.sort( (a,b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime() );
  }

  public getCustomerOrders(customerId:string) {
    this.http.get<Order[]>(`${env.apiUrl}/orders/${customerId}`)
             .subscribe(orders => {
               this.orders = orders;
               this._orderByDate();
               this.activeOrder = { ...orders[0] };
            });
  }

  public postOrder(customerId:string): void {
    this.newOrder.customer = customerId;
    this.http.post<Order>(`${env.apiUrl}/orders`, this.newOrder)
             .subscribe(newOrder => {
               this.orders.push(newOrder);
               this._orderByDate();
               this.activeOrder = { ...newOrder };
               this.newOrder = null;
               this._orderSaved.next(true);
            });
  }

}
