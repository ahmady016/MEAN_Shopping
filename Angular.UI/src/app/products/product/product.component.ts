import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProductsService } from "./../../products.service";
import { Product } from "../product";

@Component({
  selector: "product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"]
})
export class ProductComponent implements OnInit {
  productId: string;
  viewType: string;

  productForm: FormGroup;
  id: FormControl;
  name: FormControl;
  description: FormControl;
  quantity: FormControl;
  price: FormControl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProdSrv: ProductsService
  ) {}

  initForm(product?: Product) {
    this.id = new FormControl(
      { value: this.productId, disabled: true},
      Validators.required
    );
    this.name = new FormControl(
      { value: product? product.name : "", disabled: this.viewType == 'view'},
      Validators.required
    );
    this.description = new FormControl(
      { value: product? product.description : "", disabled: this.viewType == 'view'},
      Validators.required
    );
    this.quantity = new FormControl(
      { value: product? product.quantity : "", disabled: this.viewType == 'view'},
      Validators.required
    );
    this.price = new FormControl(
      { value: product? product.price : "", disabled: this.viewType == 'view'},
      Validators.required
    );

    this.productForm = new FormGroup({
      id: this.id,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      price: this.price
    });
  }

  ngOnInit() {
    this.viewType = this.route.snapshot.params.type;
    this.productId = this.route.snapshot.params.id;

    if (this.productId == '0') {
      this.initForm();
    } else {
      this.ProdSrv.find(this.productId);
      this.initForm(this.ProdSrv.product);
    }
  }

  save(e) {
    e.preventDefault();

    if (this.productForm.invalid)
      return;

    if (this.productId == '0')
      this.ProdSrv.add(this.productForm.value);
    else
      this.ProdSrv.update(this.productId, this.productForm.value);

    this.productForm.reset();
    this.router.navigate(["/products"]);
  }

  delete() {
    this.ProdSrv.delete(this.productId);
    this.router.navigate(["/products"]);
  }

  cancel() {
    this.router.navigate(["/products"]);
  }
}
