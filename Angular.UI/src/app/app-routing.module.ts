import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './products/product/product.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { SignInComponent } from './customers/sign-in/sign-in.component';
import { SignUpComponent } from './customers/sign-up/sign-up.component';
import { SignOutComponent } from './sign-out.component';
import { OrderComponent } from './orders/order/order.component';
import { ReorderComponent } from './orders/reorder/reorder.component';
import { OrderItemsComponent } from './orders/order-items/order-items.component';
import { PageNotFoundComponent } from './not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'order', component: OrderComponent },
  { path: 'reorder', component: ReorderComponent },
  { path: 'products/:type/:id', component: ProductComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    OrderComponent,
    ReorderComponent,
    OrderItemsComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductListComponent,
    ProductComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    OrderComponent,
    ReorderComponent,
    OrderItemsComponent,
    PageNotFoundComponent
  ]
})
export class AppRoutingModule { }
