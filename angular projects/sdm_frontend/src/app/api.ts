const rootUrl = 'http://172.17.12.86:8080/sseepservices/'
const rootUrl1 = 'https://www.miraclesoft.com/HubbleServices/hubbleresources/generalServices/'
// const rootUrl2 = 'http://172.17.0.179:9090/sdm_api/'
const rootUrl2 = 'http://localhost:8089/'
// const rootUrl2 = 'http://172.17.13.73:8089/'
const dropdownURL = 'http://172.17.13.73:8089/'
export const apis = {
  login: rootUrl1 + 'generalEmployeeDetails',

  //Releases
  getAllReleases: rootUrl2 + 'projectreleases-s',
  postReleases: rootUrl2 + 'projectreleases',
  updateReleases: rootUrl2 + 'projectreleases-u',
  deleteReleases: rootUrl2 + 'projectreleases-d',

  //Infrastructure
  getAllInfras: rootUrl2 + 'projectinfrastructure-s',
  postInfras: rootUrl2 + 'projectinfrastructure',
  updateInfras: rootUrl2 + 'projectinfrastructure-u',
  deleteInfras: rootUrl2 + 'projectinfrastructure-d',

  //AllProjects
  allProjects: rootUrl2 + 'projects-s',
  postNewProject: rootUrl2 + 'projects',
  updateProject: rootUrl2 + 'projects-u',
  deleteProject: rootUrl2 + 'projects-d',
  getMyProjects: rootUrl2 + 'project',

  //Scope
  scope: rootUrl2 + 'projectscope-hierarchy',
  scopeAdd: rootUrl2 + 'ProjectEpics',

  //Epic
  newEpic: rootUrl2 + 'projectepics',
  updateEpic: rootUrl2 + 'projectepics-u',
  deleteEpic: rootUrl2 + 'projectepics-d',
  getAllEpics: rootUrl2 + 'projectepics',

  //Story
  newStory: rootUrl2 + 'projectepicstory',
  updateStory: rootUrl2 + 'projectepicstory-u',
  deleteStory: rootUrl2 + 'projectepicstory-d',
  getAllStories: rootUrl2 + 'projectepicstories',

  //myTasks
  getMytasks: rootUrl2 + 'projecttasks-mytasks',
  updateMyTask: rootUrl2 + 'projecttasks-u',
  deleteMyTask: rootUrl2 + 'projecttasks-d',
  newTask: rootUrl2 + 'projecttasks',

  //TODO List
  getTodo: rootUrl2 + 'todolists-s',
  updateTodo: rootUrl2 + 'todolists-u',
  deleteTodo: rootUrl2 + 'todolists-d',
  newTodo: rootUrl2 + 'todolists',

  deleteServiceManagement: rootUrl2 + 'projectservicemanagement-d',

  ////////////Documents

  doc: rootUrl2 + 'projectdocuments-s',
  doc1: rootUrl2 + 'projectdocuments-u',
  doc2: rootUrl2 + 'projectdocuments-d',
  doc3: rootUrl2 + 'projectdocuments',
  downloadDocument: rootUrl2 + 'downloadAttachment',
  postDocument: rootUrl2 + 'uploadmultiple',
  documenttype: rootUrl2 + 'doctype',
  ////////Sub Project
  subprojects: rootUrl2 + 'project-hierarchy',
  deleteSubproject: rootUrl2 + 'projecttasks-d',
  updateSubproject: rootUrl2 + 'projecttasks-u',
  AddSubproject: rootUrl2 + 'projecttasks',

  //////Resources//
  resource: rootUrl2 + 'projectcontacts-s',
  resourceAdd: rootUrl2 + 'projectcontacts',
  resourceUpdate: rootUrl2 + 'projectcontacts-u',
  resourceDelete: rootUrl2 + 'projectcontacts-d',
  resourceDropdown: rootUrl2 + 'resourcetype',
  /////Isssues////////
  addIssue: rootUrl2 + 'projectissues',
  getIssues: rootUrl2 + 'projectissues-s',
  updateIssue: rootUrl2 + 'projectissues-u',
  getWithId: rootUrl2 + 'projectissue/',
  issueDropDown: rootUrl2 + 'projectuxoptions',
  deleteIssues: rootUrl2 + 'projectissues-d',
  //Service Management

  getServiceManagement: rootUrl2 + 'servicemanagement-s',
  postServiceManagement: rootUrl2 + 'servicemanagement',
  updateServiceManagement: rootUrl2 + 'servicemanagement-u',
  getByIdServiceManagment: rootUrl2 + 'servicemanagement/',

  ////Issues
  issuesPost: rootUrl2 + 'ProjectIssues',
  issueGet: rootUrl2 + 'projectissues',
  issuePut: rootUrl2 + 'ProjectIssuesU',
  issueDelete: rootUrl2 + 'ProjectIssuesD',

  //////Milestones
  deliverables: rootUrl2 + 'project-milestonehierarchy',
  updateMilestones: rootUrl2 + 'projecttasks-u',
  addDeliverables: rootUrl2 + 'projecttasks',
  delDelete: rootUrl2 + 'projecttasks-d',

  /////////sla

  slaGet: rootUrl2 + 'projectsladata',
  slaPost: rootUrl2 + 'projectsla',
  slaPut: rootUrl2 + 'projectsla-u',
  slaDelete: rootUrl2 + 'projectsla-d',

  todoGet: rootUrl2 + 'projectTasks',
  todoPost: rootUrl2 + 'projectTask',
  allReleases: rootUrl2 + 'ProjectReleases',

  //   /////StatusReport/////
  // statusReport: rootUrl2 + 'statustrackers',
  // statusAdd: rootUrl2 +'statustracker',
  // statusUpdate: rootUrl2 +'statustracker-u',
  // statusDelete: rootUrl2 +'statustracker-d',
  //////////Escalation
  escalationUpdate: rootUrl2 + 'projectdomainmatrix-u',
  escalationDelete: rootUrl2 + 'projectdomain-d',
  escalationAdd: rootUrl2 + 'projectdomainescalation',
  escalationGet: rootUrl2 + 'projectdomainmatrix',
 ////Meetings
 createMeetingPost: rootUrl2 + 'meetings',
 getMeeting: rootUrl2 + 'meetings-a',
 editMeetingPost: rootUrl2 + 'meetings-u',
 forwardMeetingPost: rootUrl2 + 'meetings-f?mails=',
 cancelMeeting: rootUrl2 +'meetings-c',
 getMeeting1: rootUrl2+'meetings',
 updateMeetingPost : rootUrl2 + 'meetings-au',
 copyMeetingPost : rootUrl2 + 'meetings',
 statusDropDown : rootUrl2 + 'mstatus',
 durationDropDown : rootUrl2 + 'durationMins',
 timeZoneDropDown : rootUrl2 + 'timeZone',

  ///////////////////Status Tracker Apis//////////////

  statusReport: rootUrl2 + 'statustrackers-s',
  statusAdd: rootUrl2 + 'statustracker',
  statusUpdate: rootUrl2 + 'statustracker-u',
  statusDelete: rootUrl2 + 'statustracker-d',
  statusDuration: rootUrl2 + 'statustrackerscalculated',
  activityDropdown: rootUrl2 + 'activitytype',
  durationHrsDropdown: rootUrl2 + 'durationhrs',
  durationMinsDropdown: rootUrl2 + 'durationmins',
}
