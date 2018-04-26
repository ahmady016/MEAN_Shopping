import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from './../environments/environment';
import { Customer, CustomerLogin } from './customers/customer';

@Injectable()
export class CustomersService {

  public customer: Customer = null;

  constructor(private http: HttpClient) {}

  public signIn(login: CustomerLogin) {
    return this.http.get<Customer>(`${env.apiUrl}/customers/${login.email}/${login.password}`);
  }

  public signUp(customer: Customer) {
    return this.http.post<Customer>(`${env.apiUrl}/customers/`, customer);
  }

  public signOut() {
    this.customer = null;
  }

  public update(id:string, customer: Customer): void {
    customer.id = id;
    this.http.put<Customer>(`${env.apiUrl}/customers/${id}`, customer)
            .subscribe(updatedCustomer => this.customer = updatedCustomer);
  }

}
