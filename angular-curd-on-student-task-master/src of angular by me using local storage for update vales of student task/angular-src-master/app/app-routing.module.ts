import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';


const routes: Routes = [
  {
    path : '',
    redirectTo :'AddComponent',
    pathMatch: 'full' 
  },

  {
    path:'register form',
    component: AddComponent
  },
  {
    path:'list',
    component: ListComponent
  },
  {
    path:'update form',
    component: UpdateComponent
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
