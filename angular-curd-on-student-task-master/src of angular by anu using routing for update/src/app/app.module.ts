import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatepageComponent } from './createpage/createpage.component';
import { UpdatepageComponent } from './updatepage/updatepage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UserService } from './Studentapi';
@NgModule({
  declarations: [
    AppComponent,
    CreatepageComponent,
    UpdatepageComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
