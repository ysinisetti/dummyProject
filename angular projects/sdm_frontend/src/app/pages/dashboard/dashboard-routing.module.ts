import { AddLibrarianComponent } from './add-librarian/add-librarian.component'
import { LibrarianComponent } from './librarian/librarian.component'
import { CourseDetailsComponent } from './course-details/course-details.component'
import { EnablementComponent } from './enablement/enablement.component'
import { AddUpdateServiceRequestComponent } from './add-update-service-request/add-update-service-request.component'
import { UpdateIssuesComponent } from './update-issues/update-issues.component'
import { AddIssuesComponent } from './add-issues/add-issues.component'
import { StatustrackerComponent } from './statustracker/statustracker.component'
import { ScopeComponent } from './scope/scope.component'
import { ProjectDetailsComponent } from './all-projects/project-details/project-details.component'
import { AllProjectsComponent } from './all-projects/all-projects.component'
import { GovernanceComponent } from './governance/governance.component'
import { TimeSheetsComponent } from './time-sheets/time-sheets.component'
import { TasksComponent } from './tasks/tasks.component'
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component'
import { SlaComponent } from './sla/sla.component'
import { ResourcesComponent } from './resources/resources.component'
import { RisksComponent } from './risks/risks.component'
import { ChangesComponent } from './changes/changes.component'
import { ServiceManagementComponent } from './service-management/service-management.component'
import { DefectsComponent } from './defects/defects.component'
import { MeetingsComponent } from './meetings/meetings.component'
import { InfrastructuerComponent } from './infrastructuer/infrastructuer.component'
import { DocumentsComponent } from './documents/documents.component'
import { ReleasesComponent } from './releases/releases.component'
import { MileStonesComponent } from './mile-stones/mile-stones.component'
import { SearchUiPagenationComponent } from './search-ui-pagenation/search-ui-pagenation.component'
import { SearchServerPagenationComponent } from './search-server-pagenation/search-server-pagenation.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// dashboard
import { UpdateScreenComponent } from './update-screen/update-screen.component'
import { AddScreenComponent } from './add-screen/add-screen.component'
import { DemoComponent } from './demo/demo.component'
import { SubProjectsComponent } from './sub-projects/sub-projects.component'
import { AssemblyLineRoleComponent } from './assembly-line-role/assembly-line-role.component'

const routes: Routes = [
  {
    path: 'uipagenation',
    component: SearchUiPagenationComponent,
    data: { title: 'Dashboard uiPagenation' },
  },
  {
    path: 'serverPagenation',
    component: SearchServerPagenationComponent,
    data: { title: 'Dashboard server Pagenation' },
  },
  /////////////////////Add and Update Screens//////////////////
  {
    path: 'addScreen',
    component: AddScreenComponent,
    data: { title: 'Dashboard addScreen' },
  },
  {
    path: 'updateScreen',
    component: UpdateScreenComponent,
    data: { title: 'Dashboard updateScreen' },
  },
  {
    path: 'serviceAdd',
    component: AddUpdateServiceRequestComponent,
    data: { title: 'Dashboard addIssues' },
  },
  {
    path: 'serviceUpdate/:id',
    component: AddUpdateServiceRequestComponent,
    data: { title: 'Dashboard addIssues' },
  },
  ////////////////////////////////////////////////////////////

  {
    path: 'mileStones',
    component: MileStonesComponent,
    data: { title: 'mileStone' },
  },
  {
    path: 'releases',
    component: ReleasesComponent,
    data: { title: 'releases' },
  },

  {
    path: 'documents',
    component: DocumentsComponent,
    data: { title: 'document' },
  },
  {
    path: 'infrastructure',
    component: InfrastructuerComponent,
    data: { title: 'infrastructure' },
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    data: { title: 'meetings' },
  },
  {
    path: 'defects',
    component: DefectsComponent,
    data: { title: 'defects' },
  },
  {
    path: 'statustracker',
    component: StatustrackerComponent,
    data: { title: 'statustracker' },
  },
  {
    path: 'addIssues',
    component: AddIssuesComponent,
    data: { title: 'addIssues' },
  },
  {
    path: 'updateIssues/:id',
    component: UpdateIssuesComponent,
    data: { title: 'updateIssues' },
  },

  {
    path: 'serviceMgmt',
    component: ServiceManagementComponent,
    data: { title: 'serviceMngmt' },
  },
  {
    path: 'changes',
    component: ChangesComponent,
    data: { title: 'changes' },
  },
  {
    path: 'enablement',
    component: EnablementComponent,
    data: { title: 'enablement' },
  },
  {
    path: 'risks',
    component: RisksComponent,
    data: { title: 'risks' },
  },
  {
    path: 'resource',
    component: ResourcesComponent,
    data: { title: 'resource' },
  },
  {
    path: 'sla',
    component: SlaComponent,
    data: { title: 'sla' },
  },
  {
    path: 'escalation',
    component: EscalationMatrixComponent,
    data: { title: 'Dashboard updateScreen' },
  },
  {
    path: 'tasks',
    component: TasksComponent,
    data: { title: 'tasks' },
  },
  {
    path: 'timesheets',
    component: TimeSheetsComponent,
    data: { title: 'Dashboard updateScreen' },
  },
  {
    path: 'governance',
    component: GovernanceComponent,
    data: { title: 'governance' },
  },
  {
    path: 'allProjects',
    component: AllProjectsComponent,
    data: { title: 'allProjects' },
  },
  {
    path: 'projectDetails/:title',
    component: ProjectDetailsComponent,
    data: { title: 'projectDetails' },
  },
  {
    path: 'demo',
    component: DemoComponent,
    data: { title: 'demo' },
  },
  {
    path: 'subProjects',
    component: SubProjectsComponent,
    data: { title: 'subProjects' },
  },
  {
    path: 'scope',
    component: ScopeComponent,
    data: { title: 'scope' },
  },
  {
    path: 'courseDetails',
    component: CourseDetailsComponent,
    data: { title: 'courseDetails' },
  },
  {
    path: 'librarian',
    component: LibrarianComponent,
    data: { title: 'librarian' },
  },
  {
    path: 'LibrarianAssectDetails',
    component: AddLibrarianComponent,
    data: { title: 'LibrarianAssectDetails' },
  },
  {
    path: 'assembly',
    component: AssemblyLineRoleComponent,
    data: { title: 'assembly' },
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class DashboardRouterModule {}
