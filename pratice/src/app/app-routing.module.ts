import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostRequestComponent } from './post-request/post-request.component';
import { ApprovedPostsComponent } from './approved-posts/approved-posts.component';
import { RejectedPostsComponent } from './rejected-posts/rejected-posts.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderFixingComponent } from './stylings/header-fixing/header-fixing.component';
import { AlertsComponent } from './alerts/alerts.component';
import { CreateAlertsComponent } from './create-alerts/create-alerts.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { ExtraTableDataComponent } from './extra-table-data/extra-table-data.component';


const routes: Routes = [
{
  path:'',component:LoginComponent, pathMatch : 'full'
},
{
  path :'Registration',component:RegistrationComponent
},

{
  path:'CreateAlerts',component:CreateAlertsComponent
},
{
  path:'extratable',component:ExtraTableDataComponent
},

{
  path :'forgot',component:ForgotpasswordComponent
},
{
  path :'new',component:NewpasswordComponent
},
{
  path: 'user', component: HeaderFixingComponent, children: [
    {
      path:'createPost',component:CreatePostComponent
    },
    {
      path : 'home',component:HomeComponent
    },
    {
      path:'requestPost',component:PostRequestComponent
    },
    {
      path:'approvedposts',component:ApprovedPostsComponent
    },
    {
      path:'rejectedPosts',component:RejectedPostsComponent
    },
    {
      path:'myPosts',component:MyPostsComponent
    },
    {
      path:'Alerts',component:AlertsComponent
    },
   

  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
