import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CustomersService } from "./customers.service";

@Component({
  selector: 'sign-out',
  template: `
    <span>Welcome, {{ CustSrv.customer.name }}</span>
    <button class="btn btn-outline-warning"
      (click)="$event.preventDefault();signOut();">
      SignOut
    </button>
  `
})

export class SignOutComponent {
  constructor(private CustSrv: CustomersService, private router: Router) { }
  signOut() {
    this.CustSrv.signOut();
    this.router.navigate(["/signin"]);
  }
}
