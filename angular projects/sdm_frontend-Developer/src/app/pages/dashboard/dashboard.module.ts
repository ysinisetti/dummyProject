import { TimeConversion } from './../../timer';
import { MyreviewsComponent } from './myreviews/myreviews.component';
import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { DashboardRouterModule } from './dashboard-routing.module'
import { WidgetsComponentsModule } from 'src/app/components/kit/widgets/widgets-components.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ChartistModule } from 'ng-chartist'
import { NgApexchartsModule } from 'ng-apexcharts'
// dashboard
import { SearchUiPagenationComponent } from './search-ui-pagenation/search-ui-pagenation.component'
import { SearchServerPagenationComponent } from './search-server-pagenation/search-server-pagenation.component'
import { AddScreenComponent } from './add-screen/add-screen.component'
import { UpdateScreenComponent } from './update-screen/update-screen.component'
import { PhoneDirective } from './phone.directive'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { MileStonesComponent } from './mile-stones/mile-stones.component'
import { ReleasesComponent } from './releases/releases.component'
import { ScopeComponent } from './scope/scope.component'
import { DocumentsComponent } from './documents/documents.component'
import { InfrastructuerComponent } from './infrastructuer/infrastructuer.component'
import { MeetingsComponent } from './meetings/meetings.component'
import { DefectsComponent } from './defects/defects.component'
import { ServiceManagementComponent } from './service-management/service-management.component'
import { ChangesComponent } from './changes/changes.component'
import { RisksComponent } from './risks/risks.component'
import { ResourcesComponent } from './resources/resources.component'
import { SlaComponent } from './sla/sla.component'
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component'
import { TasksComponent } from './tasks/tasks.component'
import { TimeSheetsComponent } from './time-sheets/time-sheets.component'
import { GovernanceComponent } from './governance/governance.component'
import { AllProjectsComponent } from './all-projects/all-projects.component'
import { ProjectDetailsComponent } from './all-projects/project-details/project-details.component'
import { DemoComponent } from './demo/demo.component'
// import { SubProjectsComponent } from './sub-projects/sub-projects.component'

import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { StatustrackerComponent } from './statustracker/statustracker.component'
import { AddIssuesComponent } from './add-issues/add-issues.component'
import { AddUpdateServiceRequestComponent } from './add-update-service-request/add-update-service-request.component'
import { UpdateIssuesComponent } from './update-issues/update-issues.component'
import { AddLibrarianComponent } from './add-librarian/add-librarian.component'
import { CourseDetailsComponent } from './course-details/course-details.component'
import { EnablementComponent } from './enablement/enablement.component'
import { LibrarianComponent } from './librarian/librarian.component'
import { ChartsModule } from 'ng2-charts'
import { AddUpdateChangesComponent } from './add-update-changes/add-update-changes.component';
import { AssemblyLineRolesComponent } from './assembly-line-roles/assembly-line-roles.component';
import { LibrarianArtifactComponent } from './librarian-artifact/librarian-artifact.component';
import { EditenablementComponent } from './editenablement/editenablement.component';
import { StatusreportComponent } from './statusreport/statusreport.component'
import { SubProjectsComponent } from './sub-projects/sub-projects.component';
import { AssemblylineskillsComponent } from './assemblylineskills/assemblylineskills.component';
import { AssemblylineComponent } from './assemblyline/assemblyline.component';
import { AssemblyLineWorkersComponent } from './assembly-line-workers/assembly-line-workers.component';
import { ExamListComponent } from './ExaminationSection/exam-list/exam-list.component';
import { AuthorSubTopicComponent } from './ExaminationSection/author-sub-topic/author-sub-topic.component';
import { QuestionsComponent } from './ExaminationSection/questions/questions.component';
import { PriorityComponent } from './priority/priority.component';
import { CreateKeysComponent } from './ExaminationSection/create-keys/create-keys.component';
import { ECertificationComponent } from './ExaminationSection/e-certification/e-certification.component';
import { ReviewExamComponent } from './ExaminationSection/review-exam/review-exam.component';
import { AddReviewComponent } from './myreviews/add-review/add-review.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ContactsComponent } from './contacts/contacts.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
// const COMPONENTS = [
//   DashboardAlphaComponent,
//   DashboardBetaComponent,
//   DashboardCryptoComponent,
//   DashboardGammaComponent,
// ]

@NgModule({
  imports: [
    SharedModule,
    DashboardRouterModule,
    WidgetsComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ChartistModule,
    NgApexchartsModule,
    ChartsModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
  ],
  declarations: [
    SearchUiPagenationComponent,
    SearchServerPagenationComponent,
    AddScreenComponent,
    UpdateScreenComponent,
    PhoneDirective,
    MileStonesComponent,
    ReleasesComponent,
    ScopeComponent,
    DocumentsComponent,
    InfrastructuerComponent,
    MeetingsComponent,
    DefectsComponent,
    ServiceManagementComponent,
    ChangesComponent,
    RisksComponent,
    ResourcesComponent,
    SlaComponent,
    EscalationMatrixComponent,
    TasksComponent,
    TimeSheetsComponent,
    GovernanceComponent,
    AllProjectsComponent,
    ProjectDetailsComponent,
    MyreviewsComponent,
    DemoComponent,
    TimeConversion,
    // SubProjectsComponent,
    StatustrackerComponent,
    AddIssuesComponent,
    AddUpdateServiceRequestComponent,
    UpdateIssuesComponent,
    AddLibrarianComponent,
    CourseDetailsComponent,
    EnablementComponent,
    LibrarianComponent,
    // AssemblyLineRoleComponent,
    AddUpdateChangesComponent,
    AssemblyLineRolesComponent,
    LibrarianArtifactComponent,
    EditenablementComponent,
    StatusreportComponent,
    SubProjectsComponent,
    AssemblylineskillsComponent,
    AssemblylineComponent,
    AssemblyLineWorkersComponent,
    ExamListComponent,
    AuthorSubTopicComponent,
    QuestionsComponent,
    PriorityComponent,
    CreateKeysComponent,
    ECertificationComponent,
    ReviewExamComponent,
    AddReviewComponent,
    AccountsComponent,
    ContactsComponent,
  ],
})
export class DashboardModule {}
