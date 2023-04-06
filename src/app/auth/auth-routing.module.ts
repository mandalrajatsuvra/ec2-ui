import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
const routes: Routes = [

      // path: '',
      // children: [
      //   {path: 'start' , component: BootstrapComponent},
      //   {path: 'signup', component: SignupComponent},
      //   {path: '', redirectTo: 'start', pathMatch: 'full'}
      // ]

      { path: 'start' , component: BootstrapComponent},
      { path: '', redirectTo: 'start' , pathMatch: 'full'},
      {path: 'signup' ,component: SignupComponent}

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
