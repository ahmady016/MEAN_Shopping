import { Component } from '@angular/core';
import { CustomersService } from './../customers.service';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Online Shopping';
  constructor(private CustSrv: CustomersService) {}
}
