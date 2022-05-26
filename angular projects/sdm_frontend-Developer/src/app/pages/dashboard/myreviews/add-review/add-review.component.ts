import { Component, OnInit } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { apis } from 'src/app/api';
@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
  providers: [DatePipe]
})
export class AddReviewComponent implements OnInit {
  addReview: FormGroup;
  Duration: any;
  loginId: any;
  resourceRole: any;
  prjStartdate: any;
  prjEnddate: any;
  ProjectType: any;
  reviewerName: any;
  resourceName: any;
  ProjectName: any;
  CustomerName: any;
  review: any;
  projectType: any;
  skillSet: any;
  scope: any;
  context: any;
  outcome: any;  
  constructor(private fb: FormBuilder, private datePipe: DatePipe, 
    private notification: NzNotificationService, private router: Router, 
    private dataservice: DataService) { }

  ngOnInit(): void {
    this.loginId = JSON.parse(sessionStorage.getItem('loginData')).FName
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.reviewerName = JSON.parse(sessionStorage.getItem('loginData')).FName + ' ' + JSON.parse(sessionStorage.getItem('loginData')).MName + ' ' + JSON.parse(sessionStorage.getItem('loginData')).LName
    this.resourceName = JSON.parse(sessionStorage.getItem('toBeRated')).resourceName
    this.prjStartdate = JSON.parse(sessionStorage.getItem('projectDetails')).StartDate
    this.prjEnddate = JSON.parse(sessionStorage.getItem('projectDetails')).EndDate
    this.Duration = JSON.parse(sessionStorage.getItem('projectDetails')).Duration
    this.addReview = this.fb.group({
      dateofReview: [{ value: this.datePipe.transform(new Date(), 'yyyy-MM-dd') }, Validators.required],
      ReviewerName: [{ value: this.reviewerName }, Validators.required],
      ReviewerRole: [null],
      Resource: [{ value: this.resourceName }, Validators.required],
      role: [{ value: this.resourceRole }, Validators.required],
      Attribute: [null, Validators.required],
      message: [null, Validators.required],
      ratings: [null],
      scope: [null],
      context: [null],
      outcome: [null],
      growth: [null],
      strength: [null],
      focusareas: [null],
      technical: [null],
      analytical: [null],
      documentation: [null],
      communication: [null],
      testing: [null],
      comment: [null],
      prjStartDate: [{ value: this.prjStartdate }, Validators.required],
      prjEndDate: [{ value: this.prjEnddate }, Validators.required],
      duration: [{ value: this.Duration }, Validators.required],
      typeProject: [null, Validators.required],
    });
    this.addReview.controls.Resource.patchValue(this.resourceName)
    this.addReview.controls.dateofReview.patchValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this.addReview.controls.ReviewerName.patchValue(this.reviewerName)
    this.addReview.controls.role.patchValue(this.resourceRole)
    this.addReview.controls.prjStartDate.patchValue(this.prjStartdate)
    this.addReview.controls.prjEndDate.patchValue(this.prjEnddate)
    this.addReview.controls.duration.patchValue(this.Duration)
    this.addReview.controls.typeProject.patchValue(this.ProjectType)
    console.log(JSON.parse(sessionStorage.getItem('loginData')))
    console.log(JSON.parse(sessionStorage.getItem('toBeRated')))
    //Attribute Drop Down
    this.dataservice.get(apis.attributedropdown).subscribe((res: any) => {
      this.attributes = res
      console.log('skillSet dropdown', this.skillSet)
    })
    //Role Played Drop down
    this.dataservice.get(apis.skillsetDropdown).subscribe((res: any) => {
      this.skillSet = res
      console.log('skillSet dropdown', this.skillSet)
    })
    //Project Type Drop Down
    this.dataservice.get(apis.projectType).subscribe((res: any) => {
      this.projectType = res
      console.log('pType', res)
    })
    //Scope Drop Down
    this.dataservice.get(apis.scopedropdown).subscribe((res: any) => {
      this.scope = res
      console.log('pType', res)
    })
    //Context Drop down
    this.dataservice.get(apis.contextdropdown).subscribe((res: any) => {
      this.context = res
      console.log('pType', res)
    })
    //Outcome Drop down
    this.dataservice.get(apis.outcomedropdown).subscribe((res: any) => {
      this.outcome = res
      console.log('pType', res)
    })
  }

  attributes = []
  
  //To add a review for selected resource
  addReviewData() {
    const resourcename = this.addReview.controls.Resource.value
    const role = this.addReview.controls.role.value
    const projecttype = this.addReview.controls.typeProject.value
    const startdate = this.addReview.controls.prjStartDate.value
    const enddate = this.addReview.controls.prjEndDate.value
    const duration = this.addReview.controls.duration.value
    const scope = this.addReview.controls.scope.value
    const context = this.addReview.controls.context.value
    const attribute = this.addReview.controls.Attribute.value.toString()
    const outcome = this.addReview.controls.outcome.value
    const focusareas = this.addReview.controls.focusareas.value
    const strength = this.addReview.controls.strength.value
    const growth = this.addReview.controls.growth.value
    const technical = this.addReview.controls.technical.value
    const analytical = this.addReview.controls.analytical.value
    const communication = this.addReview.controls.communication.value
    const testing = this.addReview.controls.testing.value
    const documentation = this.addReview.controls.documentation.value
    const reviewerrole = this.addReview.controls.ReviewerRole.value
    const reviewername = this.addReview.controls.ReviewerName.value
    const dateofreview = this.addReview.controls.dateofReview.value
    const comment = this.addReview.controls.comment.value
    const projectname = this.ProjectName
    const reqbody = {
      resourceName: resourcename === null || resourcename === undefined ? '' : resourcename,
      outcome: outcome === null || outcome === undefined ? '' : outcome,
      rolePlayed: role === null || role === undefined ? '' : role,
      projectType: projecttype === null || projecttype === undefined ? '' : projecttype,
      startDate: startdate === null || startdate === undefined ? '' : new Date(startdate).toISOString().substring(0, 10),
      endDate: enddate === null || enddate === undefined ? '' : new Date(enddate).toISOString().substring(0, 10),
      duration: duration === null || duration === undefined ? '' : duration,
      scope: scope === null || scope === undefined ? '' : scope,
      context: context === null || context === undefined ? '' : context,
      attribute: attribute === null || attribute === undefined ? '' : attribute,
      focusAreasToImprove: focusareas === null || focusareas === undefined ? '' : focusareas,
      strengths: strength === null || strength === undefined ? '' : strength,
      growthAreas: growth === null || growth === undefined ? '' : growth,
      technical: technical === null || technical === undefined ? '' : technical,
      analytical: analytical === null || analytical === undefined ? '' : analytical,
      communication: communication === null || communication === undefined ? '' : communication,
      documentation: documentation === null || documentation === undefined ? '' : documentation,
      testing: testing === null || testing === undefined ? '' : testing,
      reviewerRole: reviewerrole === null || reviewerrole === undefined ? '' : reviewerrole,
      reviewer: reviewername === null || reviewername === undefined ? '' : reviewername,
      dateOfReview: dateofreview === null || dateofreview === undefined ? '' : new Date(dateofreview).toISOString().substring(0, 10),
      comments: comment === null || comment === undefined ? '' : comment,
      modifiedDate: '',
      projectName: projectname === null || projectname === undefined ? '' : projectname,
      createdBy: this.loginId,
      modifiedBy: this.loginId
    }
    console.log('request body', reqbody)
    this.dataservice.post(apis.addReview, reqbody).subscribe((res: any) => {
      this.review = res
      console.log(this.review)
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
      } else {
        this.notification.create('error', 'Failed to Add', 'Your data is failed to add')
      }
    })
    for (const i in this.addReview.controls) {
      console.log(this.addReview.controls[i])
    }
    this.addReview.reset()
  }
 
  resource() {                // routing back to resource screen
    this.router.navigate(['/dashboard/resource'])
  }
  proj() {                   // routing back to project details
    this.router.navigate(['/dashboard/allProjects'])
  }
  dashboard() {              // routing back to dashboard
    this.router.navigate(['/dashboard/projectDetails/ProjectName'])
  }
}
