import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'cui-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  badgeCount: number = 7
  name: string = ''
  role: string = ''
  email: string = ''
  phone: string = ''
  logData: any
  img: any

  constructor(private store: Store<any>) {
    // if (JSON.parse(sessionStorage.getItem('loginData')) === null) {
    //   this.name = ''
    //   this.role = ''
    //   this.email = ''
    // } else {
      this.logData = JSON.parse(sessionStorage.getItem('loginData'))
      console.log(this.logData)
      this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
      this.role = ''
      this.email = this.logData === null || this.logData === undefined ? '' : this.logData.Email1
      this.img = this.logData === null || this.logData === undefined ? '' : this.logData.Image
    // }
    // this.store.pipe(select(Reducers.getUser)).subscribe(state => {
    //   this.name = state.name
    //   this.role = state.role
    //   this.email = state.email
    // })
    }

  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    sessionStorage.clear()
    this.store.dispatch(new UserActions.Logout())
  }
}
