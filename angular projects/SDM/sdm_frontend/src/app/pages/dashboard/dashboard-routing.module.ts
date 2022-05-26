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
import { StatustrackerComponent } from './statustracker/statustracker.component'

// dashboard
import { UpdateScreenComponent } from './update-screen/update-screen.component'
import { AddScreenComponent } from './add-screen/add-screen.component'
import { LookUpMeetingComponent } from './meetings/look-up-meeting/look-up-meeting.component'
import { DemoComponent } from './demo/demo.component'
import { SubProjectsComponent } from './sub-projects/sub-projects.component'
import { ScopeComponent } from './scope/scope.component'
import { ProjectmeetingsComponent } from './meetings/projectmeetings/projectmeetings.component'

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
    path: 'statustracker',
    component: StatustrackerComponent,
    data: { title: 'statustracker' },
  },
  {
    path: 'scope',
    component: ScopeComponent,
    data: { title: 'scope' },
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
    path: 'projectmeetings',
    component: ProjectmeetingsComponent,
    data: { title: 'projectmeetings' },
  },
  {
    path: 'lookupmeeting',
    component: LookUpMeetingComponent,
    data: { title: 'lookupmeeting' },
  },

  {
    path: 'defects',
    component: DefectsComponent,
    data: { title: 'defects' },
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
    path: 'demo/:contactid',
    component: DemoComponent,
    data: { title: 'demo' },
  },
  {
    path: 'subProjects',
    component: SubProjectsComponent,
    data: { title: 'subProjects' },
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class DashboardRouterModule {}
