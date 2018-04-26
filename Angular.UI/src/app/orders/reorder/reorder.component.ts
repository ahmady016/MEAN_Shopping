import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../../orders.service';
import { CustomersService } from '../../customers.service';
import { Order } from '../order';

@Component({
  selector: 'reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.css']
})
export class ReorderComponent implements OnInit {

  noCustomer: boolean = false;
  activeOrder: Order = null;

  constructor(public OrdSrv: OrdersService,
              private CustSrv: CustomersService,
              private router: Router) { }

  ngOnInit() {
    if (!this.CustSrv.customer)
      this.noCustomer = true;
    else
      this.OrdSrv.getCustomerOrders(this.CustSrv.customer.id);
  }

  setActiveOrder(order: Order) {
    this.OrdSrv.activeOrder = {...order};
  }

}
