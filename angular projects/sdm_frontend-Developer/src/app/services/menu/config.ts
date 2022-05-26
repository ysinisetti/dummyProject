import { DataService } from './../../data.service'
export const getMenuData: any[] = [

{
title: 'Projects',
key: 'projects',
url: '/dashboard/allProjects',
icon: 'fa fa-list',
},

{
  title: 'Accounts',
  key: 'Accounts',
  url: '/dashboard/accounts',
  icon: 'fa fa-list',
  },
{
title: 'Status Tracker',
key: 'Status Tracker',
icon: 'fa fa-bar-chart',
url: '/dashboard/statustracker',
},
{
title: 'Resource Analysis',
key: 'My ResourceAnalysis',
icon: 'fa fa-user-circle-o',
url: '/dashboard/serverPagenation',
},
{
  title: 'Assembly Line Role',
  key: 'Assembly Line Role',
  icon: 'fa fa-cogs',
  url: '/dashboard/assemblyLines',
  },

{
title: 'Enablement',
key: 'My Enablement',
icon: 'fa fa-lightbulb-o',
url: '/dashboard/enablement',
},
{
title: 'Librarian',
key: 'My Librarian',
icon: 'fa fa-book',
url: '/dashboard/librarian',
},
{
title: 'Subject Matter Expert',
key: 'My SME',
icon: 'fa fa-graduation-cap',
url: '/dashboard/serverPagenation',
},
{
title: 'My Priority ',
key: 'Assembly Line Role',
icon: 'fa fa-diamond',
url: '/dashboard/priority',
},
{
title: 'My Reviews',
key: 'My Reviews',
icon: 'fa fa-check-circle-o',
url: '/dashboard/reviews',
},
{
title: 'My TimeSheets',
key: 'My TimeSheets',
icon: 'fa fa-clock-o',
url: '/dashboard/serverPagenation',
},

{
title: 'My Calender',
key: 'calender',
icon: 'fa fa-calendar',
url: '/dashboard/myCalender',
},
{
title: 'Examination Section',
key: 'ExaminationSection',
icon: 'fa fa-table',
// url: '/dashboard/examList',
children: [
{
title: 'Exam List',
key: 'ExaminationSection',
icon:'fa fa-align-justify',
url: '/dashboard/examList',
},
{
title: 'Generate Keys',
key: 'uiPagenation',
icon:'fa fa-key',
url: '/dashboard/CreateKeys',
}, {
title: 'E Certification',
key: 'ServerPagenation',
icon:'fa fa-certificate',
url: '/dashboard/ECertification',
}, {
title: 'Review Exam',
key: 'addScreen',
icon:'fa fa-check',
url: '/dashboard/ReviewExam',
},
],
},
]
