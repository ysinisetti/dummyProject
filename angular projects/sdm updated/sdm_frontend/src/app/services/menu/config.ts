import { DataService } from './../../data.service'
export const getMenuData: any[] = [
  //  {
  //     category: true,
  //     title: 'Projects',
  //   },
  {
    title: 'Projects',
    key: 'projects',
    url: '/dashboard/allProjects',
    icon: 'fa fa-file-code-o',
    // roles: ['admin'], // set user roles with access to this route
    // count: 4,
    // children: [
    //    {
    //     title: 'MileStones',
    //     key: 'MileStones',
    //     icon: 'fa fa-flag-checkered',
    //     url: '/dashboard/mileStones',
    //   },
    //   {
    //     title: 'Releases',
    //     key: 'Releases',
    //     icon: 'fa fa-rocket',
    //     url: '/dashboard/releases',
    //   },
    //   {
    //     title: 'Scope',
    //     key: 'Scope',
    //     icon: 'fa fa-crosshairs',
    //     url: '/dashboard/scope',
    //   },
    //   {
    //     title: 'Documents',
    //     key: 'Documents',
    //     icon: 'fa fa-briefcase',
    //     url: '/dashboard/documents',
    //   },
    //   {
    //     title: 'Infrastructure',
    //     key: 'Infrastructure',
    //     icon: 'fa fa-building-o',
    //     url: '/dashboard/infrastructure',
    //   },
    //   {
    //     title: 'Meetings',
    //     key: 'Meetings',
    //     icon: 'fa fa-wpforms',
    //     url: '/dashboard/meetings',
    //   },
    //   {
    //     title: 'Defects',
    //     key: 'Defects',
    //     icon: 'fa fa-times-circle-o',
    //     url: '/dashboard/defects',
    //   },
    //   {
    //     title: 'Services Mgmt',
    //     key: 'Services Mgmt',
    //     icon: 'fa fa-cog',
    //     url: '/dashboard/serviceMgmt',
    //   },
    //   {
    //     title: 'Changes',
    //     key: 'Changes',
    //     icon: 'fa fa-recycle',
    //     url: '/dashboard/changes',
    //   },
    //   {
    //     title: 'Risks',
    //     key: 'Risks',
    //     icon: 'fa fa-warning',
    //     url: '/dashboard/risks',
    //   },
    //   {
    //     title: 'Resources',
    //     key: 'Resources',
    //     icon: 'fa fa-users',
    //     url: '/dashboard/resource',
    //   },
    //   {
    //     title: 'SLA',
    //     key: 'SLA',
    //     icon: 'fa fa-list-alt',
    //     url: '/dashboard/sla',
    //   },
    //   {
    //     title: 'Escalation Matrix',
    //     key: 'Escalation Matrix',
    //     icon: 'fa fa-line-chart',
    //     url: '/dashboard/escalation',
    //   },
    //   {
    //     title: 'Tasks',
    //     key: 'Tasks',
    //     icon: 'fa fa-pencil-square-o',
    //     url: '/dashboard/tasks',
    //   },
    //   {
    //     title: 'TimeSheets',
    //     key: 'TimeSheets',
    //     icon: 'fa fa-calendar',
    //     url: '/dashboard/timesheets',
    //   },
    //   {
    //     title: 'Governance',
    //     key: 'Governance',
    //     icon: 'fa fa-university',
    //     url: '/dashboard/governance',
    //   },
    // ],
  },
  // {
  //   title: 'Meetings',
  //   key: 'Meetings',
  //   icon: 'fa fa-fax',
  //   url: '/dashboard/meetings',
  // },
  {
    title: 'Status Tracker',
    key: 'Status Tracker',
    icon: 'fa fa-flask',
    url: '/dashboard/statustracker',
  },
  {
    title: 'Resource Analysis',
    key: 'My ResourceAnalysis',
    // icon: 'fe fe-calendar',
    url: '/dashboard/serverPagenation',
  },

  {
    title: 'Enablement',
    key: 'My Enablement',
    // icon: 'fe fe-calendar',
    url: '/dashboard/serverPagenation',
  },
  {
    title: 'Librarian',
    key: 'My Librarian',
    // icon: 'fe fe-calendar',
    url: '/dashboard/serverLibrarian',
  },
  {
    title: 'Assembly Line Role',
    key: 'assembly',

    url: '/dashboard/assembly',
  },
  {
    title: 'Subject Matter Expert',
    key: 'My SME',
    // icon: 'fe fe-calendar',
    url: '/dashboard/serverPagenation',
  },
  {
    title: 'My TimeSheets',
    key: 'My TimeSheets',
    icon: 'fe fe-calendar',
    url: '/dashboard/serverPagenation',
  },
  {
    title: 'My Tasks',
    key: 'My Tasks',
    icon: 'fa fa-pencil-square-o',
    url: '/dashboard/serverPagenation',
  },
  {
    title: 'My Calender',
    key: 'calender',
    icon: 'fe fe-calendar',
    url: '/dashboard/serverPagenation',
  },
  // {
  //   title: 'Sample Pages',
  //   key: 'samplePages',
  //   icon: 'fa fa-folder-open-o',
  //   // roles: ['admin'], // set user roles with access to this route
  //   // count: 4,
  //   children: [
  //     {
  //       title: 'Search With UI Pagenation',
  //       key: 'uiPagenation',
  //       url: '/dashboard/uipagenation',
  //     },
  //     {
  //       title: 'Search With Server Side Pagenation',
  //       key: 'ServerPagenation',
  //       url: '/dashboard/serverPagenation',
  //     },
  //     {
  //       title: 'Add Screen',
  //       key: 'addScreen',
  //       url: '/dashboard/addScreen',
  //     },
  //     {
  //       title: 'Update Screen',
  //       key: 'updateScreen',
  //       url: '/dashboard/updateScreen',
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth Pages',
  //   key: 'auth',
  //   icon: 'fe fe-user',
  //   children: [
  //     {
  //       title: 'Login',
  //       key: 'authLogin',
  //       url: '/auth/login',
  //     },
  //   ],
  // },
  // {
  //   title: 'Form Examples',
  //   key: 'formExamples',
  //   icon: 'fe fe-menu',
  //   url: '/advanced/form-examples',
  // },
]
// export class SideMenu {
//   sideMenu = getMenuData
//   subMenu = []
//   constructor(private dataService: DataService) {
//     const projectData = [
//       {name: 'MileStones'}, {name: 'Releases',}, {name: 'Scope'}, {name: 'Documents'} , {name: 'Infrastructure'}
//     ]
//     for (let i = 0 ; i < projectData.length ; i++) {
// this.subMenu[i]['title'] = projectData[i].name
// this.subMenu[i]['key'] = projectData[i].name
// this.subMenu[i]['url'] = '/dashboard/uipagenation/:' + i
//     }
//    console.log(this.subMenu)
//   }
// }
