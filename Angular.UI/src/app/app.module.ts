import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { DateService } from './date.service';
import { ProductsService } from './products.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';

import { AppComponent } from './root/app.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [DateService ,ProductsService, CustomersService, OrdersService],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
