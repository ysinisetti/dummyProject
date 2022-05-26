import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatepageComponent } from './createpage/createpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UpdatepageComponent } from './updatepage/updatepage.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  },
  {path: 'home', component: HomepageComponent},
  {path:'createpage', component :CreatepageComponent},
  {path:'updatepage',component:UpdatepageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
