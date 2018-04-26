import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from './../../customers.service';
import { OrdersService } from './../../orders.service';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  err: boolean = false;
  signInForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(private CustSrv: CustomersService,
              private OrdSrv: OrdersService,
              private router: Router) { }

  initForm() {
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required, Validators.minLength(8)]);
    this.signInForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
    this.initForm();
  }

  signIn(e) {
    e.preventDefault();
    if(this.signInForm.invalid)
      return;
    this.CustSrv.signIn(this.signInForm.value)
        .subscribe(loggedcustomer => {
          if (loggedcustomer) {
            this.CustSrv.customer = loggedcustomer
            if(this.OrdSrv.newOrder)
              this.OrdSrv.postOrder(loggedcustomer.id);
          }
          else
            this.err = true;
          this.router.navigate(["/products"]);
        });
    this.signInForm.reset();
  }

}
