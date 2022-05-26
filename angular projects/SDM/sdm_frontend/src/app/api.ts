const rootUrl = 'http://172.17.12.86:8080/sseepservices/'
const rootUrl1 = 'https://www.miraclesoft.com/HubbleServices/hubbleresources/generalServices/'
//const rootUrl2 = 'http://172.17.13.81:8085/'
const rootUrl3 = 'http://172.17.0.170:9999/sdm_api/'

const rootUrl2 = 'http://localhost:8089/'
export const apis = {
  login: rootUrl1 + 'generalEmployeeDetails',
  todoGet: rootUrl2 + 'projecttasks',
  //todoPost: rootUrl2 + 'projectTask',
  //Releases
  getAllReleases: rootUrl2 + 'projectreleases',
  postReleases: rootUrl2 + 'projectreleases',
  updateReleases: rootUrl2 + 'projectreleases-u',
  deleteReleases: rootUrl2 + 'projectreleases-d',

  //Infrastructure
  getAllInfras: rootUrl2 + 'projectinfrastructures',
  postInfras: rootUrl2 + 'projectinfrastructure',
  updateInfras: rootUrl2 + 'projectinfrastructure-u',
  deleteInfras: rootUrl2 + 'projectinfrastructure-d',

  //AllProjects
 
allProjects: rootUrl2 + 'projects-s',
postNewProject: rootUrl2 + 'projects',
updateProject: rootUrl2 + 'projects-u',
deleteProject: rootUrl2 + 'projects-d',
getMyProjects: rootUrl2 + 'project',

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

  //Documents
  doc: rootUrl2 + 'projectdocuments',
  doc1: rootUrl2 + 'projectdocuments-u',
  doc2: rootUrl2 + 'projectdocuments-d',
  doc3: rootUrl2 + 'projectdocuments',
  postDocument: rootUrl2 + 'uploaddocument',

  ////////Sub Project
  subprojects: rootUrl2 + 'project-hierarchy',
  deleteSubproject: rootUrl2 + 'projecttasks-d',
  updateSubproject: rootUrl2 + 'projecttasks-u',
  AddSubproject: rootUrl2 + 'projecttasks',
  //////Resources//
  resource: rootUrl2 + 'projectcontacts',
  resourceAdd: rootUrl2 + 'projectcontacts',
  resourceUpdate: rootUrl2 + 'projectcontacts-u',
  resourceDelete: rootUrl2 + 'projectcontacts-d',

  ////Issues
  issuesPost: rootUrl2 + 'projectissues',
  issueGet: rootUrl2 + 'projectissues',
  issuePut: rootUrl2 + 'projectissues-u',
  issueDelete: rootUrl2 + 'projectissues-d',

  ////Meetings
  createMeetingPost: rootUrl2 + 'meetings',
  getMeeting: rootUrl2 + 'meetings-a',
  updateMeetingPost: rootUrl2 + 'meetings-u',
  forwardMeetingPost: rootUrl2 + 'meetings-f',

  ////Escalation
  escalationGet: rootUrl2 + 'projectdomainmatrix?projectid=',
  escalationUpdate: rootUrl2 + 'projectdomainmatrix-u',

  //Scope
  scope: rootUrl2 + 'projectscope-hierarchy/',
  scopeAdd: rootUrl2 + 'ProjectEpics',

  //////Milestones
 deliverables: rootUrl2 + 'project-milestonehierarchy',
 updateMilestones: rootUrl2 + 'projecttasks-u',
 addDeliverables: rootUrl2 + 'projecttasks',
 delDelete: rootUrl2 + 'projecttasks-d',

  //myTasks
  getMytasks: rootUrl2 + 'projecttasks-mytasks',
  updateMyTask: rootUrl2 + 'projecttasks-u',
  deleteMyTask: rootUrl2 + 'projecttasks-d',
  newTask: rootUrl2 + 'projecttasks',

  //TODO List
  getTodo: rootUrl2 + 'todolists',
  updateTodo: rootUrl2 + 'todolists-u',
  deleteTodo: rootUrl2 + 'todolists-d',
  newTodo: rootUrl2 + 'todolists',
}
