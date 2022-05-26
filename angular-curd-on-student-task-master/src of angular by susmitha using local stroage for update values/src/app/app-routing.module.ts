import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';



const routes: Routes = [

  {
    path:'',
  redirectTo:"form",
  pathMatch:"full"
},

  {path:"form",
  component:FormComponent},

  {path:"add",
  component:AddComponent},

  {path:"list",
  component:ListComponent},
  
  {path:"delete",
  component:DeleteComponent},
  
  {path:"update/:id",
  component:UpdateComponent}
  
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
