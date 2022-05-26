import { apis } from './../../../../../api'
import { DataService } from './../../../../../data.service'
import { Router } from '@angular/router'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
import * as UserActions from 'src/app/store/user/actions'
import * as SettingsActions from 'src/app/store/settings/actions'
import { NzNotificationService } from 'ng-zorro-antd/notification'

@Component({
  selector: 'cui-system-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup
  logo: String
  authProvider: string = 'firebase'
  loading: boolean = false
  year = new Date().getFullYear()
  userName: any
  loginForm: FormGroup
  showclosedEyeIcon: any
  saveSpinner: boolean
  showNotification: boolean
  notificationMessage: any
  password1: any
  passwordVisible = false
  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    private dataService: DataService,
    private notification: NzNotificationService,
  ) {
    this.form = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.logo = state.logo
      this.authProvider = state.authProvider
    })
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.loading = state.loading
    })
  }

  get email() {
    return this.form.controls.email
  }
  get password() {
    return this.form.controls.password
  }
  login() {}

  eyeIconClicked() {}
  closeNotification() {}
  submitForm(): void {
    if (this.form.invalid) {
      const controls = this.form.controls
      // this.userAddForm.get('requirementsEndtDate').markAsUntouched();
      Object.keys(controls).forEach(key => {
        controls[key].markAsTouched()
      })
    } else {
      const obj = {
        LoginId: this.form.get('email').value,
        Password: this.form.get('password').value,
        Authorization: 'YWRtaW46YWRtaW4=',
      }
      this.dataService.post(apis.login, obj).subscribe((res: any) => {
        console.log(res)
        if (res.ResultString === 'InValidCredentiales') {
          this.notification.create('warning', `InValidCredentiales`, 'Please try again')
        } else {
          sessionStorage.setItem('loginData', JSON.stringify(res))
          sessionStorage.setItem('logPermission', 'true')
          this.router.navigate(['/dashboard/allProjects'])
        }
      })
    }
  }

  setProvider(authProvider) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        authProvider,
      }),
    )
  }
}
