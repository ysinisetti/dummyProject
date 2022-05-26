import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayStoreComponent } from './play-store/play-store.component';
import { HeaderSidebarFixingComponent } from './styling/header-sidebar-fixing/header-sidebar-fixing.component';
import { HeaderComponent } from './styling/header/header.component';


const routes: Routes = [
  {
  path: '', component: HeaderSidebarFixingComponent, children: [
    {
      path:'',component:PlayStoreComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
