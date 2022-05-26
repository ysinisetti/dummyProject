const rootUrl1 = 'https://www.miraclesoft.com/HubbleServices/hubbleresources/generalServices/'
const rootUrl2 = 'http://172.17.0.179:9090/sdm_api/'
//const rootUrl2 = 'uat-hubble-api.miraclesoft.com/sdm_api/'
//const rootUrl2 = 'http://192.168.56.1:8089/'
export const apis = {
  login: rootUrl1 + 'generalEmployeeDetails',

  //Releases
  getAllReleases: rootUrl2 + 'projectreleases-s',
  postReleases: rootUrl2 + 'projectreleases',
  updateReleases: rootUrl2 + 'projectreleases-u',
  deleteReleases: rootUrl2 + 'projectreleases-d',
  status1: rootUrl2 + 'rstatus',
  getListOfTasks: rootUrl2 + 'alltasks/',
  displayTasks :rootUrl2 + 'getreleasetask',

  //Infrastructure
  getAllInfras: rootUrl2 + 'projectinfrastructure-s',
  postInfras: rootUrl2 + 'projectinfrastructure',
  updateInfras: rootUrl2 + 'projectinfrastructure-u',
  deleteInfras: rootUrl2 + 'projectinfrastructure-d',
  infraType: rootUrl2 + 'infratype',
  Location: rootUrl2 + 'location',
  environment: rootUrl2 + 'environment',
  os: rootUrl2 + 'operatingsystem',

  //AllProjects
  allProjects: rootUrl2 + 'projects-s',
  postNewProject: rootUrl2 + 'projects',
  updateProject: rootUrl2 + 'projects-u',
  deleteProject: rootUrl2 + 'projects-d',
  getMyProjects: rootUrl2 + 'project',
  projectType: rootUrl2 + 'projecttype',
  practice: rootUrl2 + 'practise',
  copyProject: rootUrl2 + 'insertCopy',
  duplicateCheck: rootUrl2 + 'copyproject',
  customerName: rootUrl2 + 'customername',


  //Scope
  scope: rootUrl2 + 'projectscope-hierarchy',
  scopeAdd: rootUrl2 + 'ProjectEpics',
  storyType: rootUrl2 + 'storytype',
  status: rootUrl2 + 'status',
  priority: rootUrl2 + 'priority',
  getOnlyEpics: rootUrl2 + 'projectepicbyprojid/',

  //Epic
  // newEpic: rootUrl2 + 'projectepics',
  // updateEpic: rootUrl2 + 'projectepics-u',
  // deleteEpic: rootUrl2 + 'projectepics-d',
  // getAllEpics: rootUrl2 + 'projectepics',
    //Epic
    newEpic: rootUrl2 + 'projectepics',
    updateEpic: rootUrl2 + 'projectepics-u',
    deleteEpic: rootUrl2 + 'projectepics-d',
    getAllEpics: rootUrl2 + 'projectepics',
    postStory: rootUrl2 + 'projectepicstory',

  //Story
  // newStory: rootUrl2 + 'projectepicstory',
  updateStory: rootUrl2 + 'projectepicstory-u',
  deleteStory: rootUrl2 + 'projectepicstory-d',
  getAllStories: rootUrl2 + 'projectepicstories',
  storyCount : rootUrl2 + 'storycount',

  //myTasks
  getMytasks: rootUrl2 + 'projecttasks-mytasks',
  updateMyTask: rootUrl2 + 'projecttasks-u',
  deleteMyTask: rootUrl2 + 'projecttasks-d',
  newTask: rootUrl2 + 'projecttasks',
  taskstatus: rootUrl2 + 'tstatus',
  allResources: rootUrl2 + 'projectresources/',

  // status: rootUrl2 + 'status',
  // priority: rootUrl2 + 'priority',

  //TODO List
  getTodo: rootUrl2 + 'todolists-s',
  updateTodo: rootUrl2 + 'todolists-u',
  deleteTodo: rootUrl2 + 'todolists-d',
  newTodo: rootUrl2 + 'todolists',

  // deleteServiceManagement: rootUrl2 + 'projectservicemanagement-d',

  ////////////Documents

  doc: rootUrl2 + 'projectdocuments-s',
  doc1: rootUrl2 + 'projectdocuments-u',
  doc2: rootUrl2 + 'projectdocuments-d',
  doc3: rootUrl2 + 'projectdocuments',
  downloadDocument: rootUrl2 + 'downloadAttachment',
  postDocument: rootUrl2 + 'uploadmultiple',
  documenttype: rootUrl2 + 'doctype',
  allDocuments: rootUrl2 + 'projectdocuments',
  requiredDocuments: rootUrl2 + 'projectdocuments/',

  ////////Sub Project//////
  subprojects: rootUrl2 + 'project-hierarchy',
  deleteSubproject: rootUrl2 + 'projecttasks-d',
  updateSubproject: rootUrl2 + 'projecttasks-u',
  AddSubproject: rootUrl2 + 'projecttasks',
  getAllDependencies: rootUrl2 + 'alltasks/',
  gettasktype: rootUrl2 + 'tasktype',
  subprojects1:rootUrl2 + 'project-hierarchy1',
  getsubProjectList:rootUrl2 + 'project-tasks',
  // allResources: rootUrl2 + 'projectresouces',

  /////Isssues////////
  addIssue: rootUrl2 + 'projectissues',
  getIssues: rootUrl2 + 'projectissues-s',
  updateIssue: rootUrl2 + 'projectissues-u',
  getWithId: rootUrl2 + 'projectissue/',
  issueDropDown: rootUrl2 + 'projectuxoptions',
  deleteIssues: rootUrl2 + 'projectissues-d',
  issuesPriority: rootUrl2 + 'projectuxoptionip',
  issuesSeverity: rootUrl2 + 'projectuxoptionsi',
  issuepriority: rootUrl2 + 'projectuxoptionip',
  issueseverity: rootUrl2 + 'projectuxoptionsi',
  getAllTasks: rootUrl2 + 'projecttasks',
  pieChartData: rootUrl2 + 'projectissues-uxbucket',
  enviruonmentDropDown: rootUrl2 + 'environment',
  // pieChartData1:rootUrl2+'',
  pieChartData2: rootUrl2 + 'projectissues-uxstatus',
  pieChartData3: rootUrl2 + 'projectissues-uxpriority',
  pieChartData4: rootUrl2 + 'projectissues-uxseverity',
  pieChartData5: rootUrl2 + 'projectissues-uxcategory',
  pieChartData6: rootUrl2 + 'projectissues-uxtype',
  linecharts: rootUrl2 + 'projectissues-linechart',
  //Service Management

  getServiceManagement: rootUrl2 + 'servicemanagement-s',
  postServiceManagement: rootUrl2 + 'servicemanagement',
  updateServiceManagement: rootUrl2 + 'servicemanagement-u',
  getByIdServiceManagment: rootUrl2 + 'servicemanagement/',
  deleteServiceManagement: rootUrl2 + 'servicemanagement-d',
  bucketData: rootUrl2 + 'servicemanagement-uxbucket',
  dataBySeverity: rootUrl2 + 'servicemanagement-uxseverity',
  dataByStatus: rootUrl2 + 'servicemanagement-uxstatus',
  dataByPriority: rootUrl2 + 'servicemanagement-uxpriority',
  dataByType: rootUrl2 + 'servicemanagement-uxtype',
  dataByResolution: rootUrl2 + 'servicemanagement-uxresolution',
  dataByApproval: rootUrl2 + 'servicemanagement-uxapproval',
  dataBycategory: rootUrl2 + 'servicemanagement-uxcategory',
  dataByLineChart: rootUrl2 + 'servicemanagement-linechart',

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
  uploadFile: rootUrl2 + 'uploadMultipleMileStone',



  downloadFile: rootUrl2 + 'downloadMileStone',


  /////////sla

  slaGet: rootUrl2 + 'projectsladata',
  slaPost: rootUrl2 + 'projectsla',
  slaPut: rootUrl2 + 'projectsla-u',
  slaDelete: rootUrl2 + 'projectsla-d',
  slaDropDown: rootUrl2 + 'slatarget',
  todoGet: rootUrl2 + 'projectTasks',
  todoPost: rootUrl2 + 'projectTask',
  allReleases: rootUrl2 + 'ProjectReleases',
  /////////Escalation
  escalationUpdate: rootUrl2 + 'projectdomainmatrix-u',
  escalationDelete: rootUrl2 + 'projectdomain-d',
  escalationAdd: rootUrl2 + 'projectdomainescalation',
  escalationGet: rootUrl2 + 'projectdomainmatrix',
  employeeDropDown: rootUrl2 + 'allemployeenames',
  employeeDetails: rootUrl2 + 'employeedetails',
  issueDetails: rootUrl2 + 'issuestitle',
  serviceDetails: rootUrl2 + 'servicestitle',
  changeDetails: rootUrl2 + 'changestitle',
  escalationMail: rootUrl2 +'sendescalationmail',
  //////////Meeting
  createMeetingPost: rootUrl2 + 'meetings',
  getMeeting: rootUrl2 + 'meetings-a',
  editMeetingPost: rootUrl2 + 'meetings-u',
  forwardMeetingPost: rootUrl2 + 'meetings-f?mails=',
  cancelMeeting: rootUrl2 + 'meetings-c',
  getMeeting1: rootUrl2 + 'meetings',
  updateMeetingPost: rootUrl2 + 'meetings-au',
  copyMeetingPost: rootUrl2 + 'meetings',
  statusDropdown: rootUrl2 + 'mstatus',
  durationDropDown: rootUrl2 + 'durationmins',
  timeZoneDropDown: rootUrl2 + 'timezone',
  resourceDropDown: rootUrl2 + 'projectresources/',
  assignToDropDown: rootUrl2 + 'assignedto',



  ///////////////////Status Tracker Apis//////////////
  statusReport: rootUrl2 + 'statustrackers-s',
  statusUpdate: rootUrl2 + 'statustracker-u',
  statusDelete: rootUrl2 + 'statustracker-d',
  statusDuration: rootUrl2 + 'statustrackerscalculated',
  durationHrsDropdown: rootUrl2 + 'durationhrs',
  durationMinsDropdown: rootUrl2 + 'durationmins',
  projectNameDropdown: rootUrl2 + 'trackprojectbylogin/jdasari',
  fileUpload: rootUrl2 + 'uploadMultipleTrackers',

  statustracker: rootUrl2 + 'getandinsert',
  statusAdd:rootUrl2 +'statustracker',
  statusEdit: rootUrl2 +'statustracker-u',
  timevalidation:rootUrl2 +'timeBlockedOrAvailable',
  activityDropdown: rootUrl2 + 'activitytype',
  statusTypeDropdown:rootUrl2 +'sstatus',
  statusreportDelete: rootUrl2 +'statustracker-d',

  statusreport: rootUrl2 + 'statusreport-s',
 statustrackerAdd: rootUrl2 +'statusreport',
statustrackerEdit: rootUrl2 +'statusreport-u',
statustrackerDelete: rootUrl2 +'statusreport-d',
objectTypeDropdown:rootUrl2 +'objecttype',
statuspopup:rootUrl2 +'blockedOrAvailable',

  //Changes
  getChanges: rootUrl2 + 'changemanagements-s',
  updateChanges: rootUrl2 + 'changemanagement-u',
  postChanges: rootUrl2 + 'changemanagement',
  deleteChanges: rootUrl2 + 'changemanagement-d',
  getChangesById: rootUrl2 + 'changemanagement/',
  dataBucket: rootUrl2 + 'changemanagement-uxbucket',
  dataCategory: rootUrl2 + 'changemanagement-uxcategory',
  dataApproval: rootUrl2 + 'changemanagement-uxapproval',
  dataResolution: rootUrl2 + 'changemanagement-uxresolution',
  dataType: rootUrl2 + 'changemanagement-uxtype',
  datapPiority: rootUrl2 + 'changemanagement-uxpriority',
  dataStatus: rootUrl2 + 'changemanagement-uxstatus',
  dataSeverity: rootUrl2 + 'changemanagement-uxseverity',
  dataLineChart: rootUrl2 + 'changemanagement-linechart',

  //// Librarian /////
  downloadArtifact: rootUrl2 + 'downloadArtifact',
  updateArtifact: rootUrl2 + 'tbllibassetartifacts-u',
  uploadDocument: rootUrl2 + 'uploaddocument',
  postartifacts: rootUrl2 + 'tbllibassetartifacts',
  artifacttypeLookup: rootUrl2 + 'projectuxoptionaf',
  deleteArtifact: rootUrl2 + 'tbllibassetartifacts-d',
  uploadartifacts: rootUrl2 + 'uploadMultipleArtifacts',
  uploadfiles: rootUrl2 + 'uploadMultipleAssets',
  deleteAsset: rootUrl2 + 'tbllibraryassets-d',
  updateAsset: rootUrl2 + 'tbllibraryassets-u',
  assetbyid: rootUrl2 + 'tbllibraryasset',
  getArtifacts: rootUrl2 + 'tbllibassetartifacts',
  assetSkillSetLookUp: rootUrl2 + 'tblskills',
  assetTypeLookUp: rootUrl2 + 'projectuxoptionat',
  assetStatusLookup: rootUrl2 + 'projectuxoptionas',
  addAsset: rootUrl2 + 'tbllibraryassets',
  getallAssetsBySearch: rootUrl2 + 'tbllibraryassets-s',
  downloadAsset: rootUrl2 + 'downloadAsset',
  multipleDownload: rootUrl2 + 'downloadall',


  ////// Assembly Line Role API's////////////


  ////// Assembly Line Workers API's////////////
  getassemblyWorkers: rootUrl2 + 'tblassemblylineroles-g',
  assemblyWorkersAdd: rootUrl2 + 'tblassemblyworkers',
  assemblyWorkersUpdate: rootUrl2 + 'tblassemblyworkers-u',
  assemblyWorkersDelete: rootUrl2 + 'tblassemblyworkers-d',
  assembly: rootUrl2 + 'tblassemblylineroles-g',
  assemblyAdd: rootUrl2 + 'tblassemblyworkers',
  assemblyUpdate: rootUrl2 + 'tblassemblyworkers-u',
  assemblyDelete: rootUrl2 + 'tblassemblyworkers-d',
  statusDropDown: rootUrl2 + 'pstatus',
  skillsetDropdown: rootUrl2 + 'tblskills',
  contactTypeDropdown: rootUrl2 + 'projectuxoptionct',

  /////assembly skills/roles ////
  getassemblySkills: rootUrl2 + 'tblassemblylineskill-s',
  getassemblySkillsById: rootUrl2 + 'tblassemblylineskills',
  assemblySkillsAdd: rootUrl2 + 'tblassemblylineskills-i',
  assemblySkillDelete: rootUrl2 + 'tblassemblylineskills-d',
  assemblySkillUpdate: rootUrl2 + 'tblassemblylineskills-u',

  ////assembly line ////
  getAssemblyRoles: rootUrl2 + 'tblassemblylines',
  getAssemblyLines: rootUrl2 + 'tblassemblylines',
  assemblyLinesAdd: rootUrl2 + 'tblassemblylines-i',
  assemblyLinesUpdate: rootUrl2 + 'tblassemblylines-u',
  assemblyLinesDelete: rootUrl2 + 'tblassemblylines-d',
  getAssemblyLineTitle: rootUrl2 + 'tblassemblyline-s',
  getAssemblyLineById: rootUrl2 + 'tblassemblyline',
  //////Resources//
  resource: rootUrl2 + 'projectcontacts-s',
  resourceAdd: rootUrl2 + 'projectcontacts',
  resourceUpdate: rootUrl2 + 'projectcontacts-u',
  resourceDelete: rootUrl2 + 'projectcontacts-d',
  resourceDropdown: rootUrl2 + 'resourcetype',
  getResource: rootUrl2 + 'projectresources',
  roleDropDown: rootUrl2 + 'resourceroles',
  ////////////Enablement/////////////////
  getEnablement: rootUrl2 + 'tblcourses-s',
skillsetdrop: rootUrl2 + 'projectuxoptionro',
addEnablement: rootUrl2 + 'tblcourses',
coursedrop: rootUrl2 + 'projectuxoptionuct',
searchTable: rootUrl2 + 'tblcourses-s',
deleteEnablement: rootUrl2 + 'tblcourses-d',
uploadenablemnt: rootUrl2 + 'tblcourses-u',
  ////////////schedule///////////////
  schedulesearch: rootUrl2 + 'crsschedules-s',
  tableData: rootUrl2 + 'crsschedules-s',
scheduleInsert: rootUrl2 + 'crsschedule',
scheduleUpdate:  rootUrl2 + 'crsschedule-u',
scheduleDelete: rootUrl2 + 'crsschedule-d',
schedulelocationdrop: rootUrl2 + 'projectuxoptionlt',
  ///////////////////// coursedetails///////////
coursedetailstabledata: rootUrl2 + 'crsmodules-g',
addcourseform: rootUrl2 + 'crsmodules',
courseeditmodule: rootUrl2 + 'crsmodules-u',
coursedeletemodule: rootUrl2 + 'crsmodules-d',
//COURSEDETAILS
//-->modules
getAllmodules : rootUrl2 + 'tblmodules-s',
addCoursemodule : rootUrl2 + 'tblmodules',
updateCourseModule : rootUrl2 + 'tblmodules-u',
deleteModule : rootUrl2 + 'tblmodules-d',
getSchedule : rootUrl2 + 'tblcrsschedules',
addSchedule : rootUrl2 + 'tblcrsschedule',
updateSchedule : rootUrl2 + 'tblcrsschedule-u',
deleteSchedule : rootUrl2 + 'tblcrsschedule-d',
//-->Sections
getSectionsById : rootUrl2 + 'modsections-m',
getAllSections : rootUrl2 + 'modsections',
addSection : rootUrl2 + 'modsections',
updateSection : rootUrl2 + 'modsections-u',
deleteSection : rootUrl2 + 'modsections-d',
getSections : rootUrl2 + 'modsections-g',
///////////////My Reviews///////////////
addReview:rootUrl2+'reviews-i',
reviewGet:rootUrl2+'review',
attributedropdown:rootUrl2+'attributes',
scopedropdown:rootUrl2+'reviewscope',
contextdropdown:rootUrl2+'reviewcontext',
outcomedropdown:rootUrl2+'reviewoutcome',
getResourceInfo:rootUrl2+'review-resource',
getIndividualRating:rootUrl2+'review-individualratings',
getOverallRating:rootUrl2+'review-overallratings',
getTechnical:rootUrl2+'review-technical',
getAnalytical:rootUrl2+'review-analytical',
getCommunication:rootUrl2+'review-communication',
getTesting:rootUrl2+'review-testing',
getDocumentation:rootUrl2+'review-documentation',
  /////////////////enroll/////////////////
enrolltabledata: rootUrl2 + 'tblcrsattendees',
addenrollform: rootUrl2 + 'tblcrsattendees',
updateEnroll: rootUrl2 + 'tblcrsattendees-u',
deleteEnroll: rootUrl2 + 'tblcrsattendees-d',
searchEnroll: rootUrl2 + 'tblcrsattendee-s',
statusEnrollList: rootUrl2 +'projectuxoptioncs',
// updateenrollform: rootUrl2 + 'tblcrsattendees-u',
// deleteenroll: rootUrl2 + 'tblcrsattendees-d',
// searchenroll: rootUrl2 + 'tblcrsattendee-s',
///////////////My Shedule///////////////

mysheduleGetData: rootUrl2 + 'crsschedules-myschedule',
mysheduleSearch: rootUrl2 + 'crsschedules-myschedule',

/////////////////Exam List////////////////////
  addTopic : rootUrl2 + 'ecerttopic',
  updateTopic : rootUrl2 + 'ecerttopic-u',
  getExamList: rootUrl2 + 'examlist',
  updateExamList: rootUrl2 + 'ecertdomain-u',
  postExamList: rootUrl2 + 'ecertdomain',
  deleteExamList: rootUrl2 + 'ecertdomain-d',
  domainNames: rootUrl2 + 'domainlist-a',
  newDomainDropdown : rootUrl2 + 'ecertdomainname',

  /////---> Author
  getResources : rootUrl2 +'getallresources',
  getAllAuthors: rootUrl2 + 'ecerttopicauthors',
  updateAuthor: rootUrl2 + 'ecerttopicauthor-u',
  PostAuthor: rootUrl2 + 'ecerttopicauthor',
  deleteAuthor: rootUrl2 + 'ecerttopicauthor-d',
  /////----> SubTopics
  getSubtopics: rootUrl2 + 'ecertsubtopics',
  postSubTopic: rootUrl2 + 'ecertsubtopic',
  updateSubTopic: rootUrl2 + 'ecertsubtopic-u',
  deleteSubTopic: rootUrl2 + 'ecertsubtopic-d ',
  /////----> Questions
  getAllQuestions: rootUrl2 + 'ecertquestions-s',
  postQuestion: rootUrl2 + 'ecertquestion',
  updateQuestion: rootUrl2 + 'ecertquestion-u',
  deleteQuestion: rootUrl2 + 'ecertquestion-d',
  getSubTopics: rootUrl2 + 'subtopicdropdown',
  ////---> Generate Keys

  getKeyList: rootUrl2 + 'ecertValidatorKeyss',
  practiceDropdown: rootUrl2 + 'domainlist',
  addKeys: rootUrl2 + 'ecertValidatorKeys',
  topicDropdown: rootUrl2 + 'topiclist',
  generateExcel: rootUrl2 + 'getKeys',

  ////---> E certification

  practiceDD:rootUrl2 + 'domainlist',
  topic:rootUrl2 + 'topiclist',
  keyValidator:rootUrl2+'keyvalidator',
  questions : rootUrl2 + 'ecertexam',
  submitAnswers : rootUrl2 + 'ecertexamresult',

  ///////---> Review Questions

getResults: rootUrl2 + 'tblecertresultslist',
ExamReview: rootUrl2 + 'reviewexam',

/////////////////////Account/////////////////

getAccountData: rootUrl2 + 'tblaccounts',
accountInsert: rootUrl2 + 'tblaccount-i',
accountUpdate: rootUrl2 + 'tblaccount-u',
accountDelete: rootUrl2 + 'tblaccount-d',

//////////////////// Contacts ////////////

getContactData: rootUrl2 + 'contacts-s',
contactInsert: rootUrl2 + 'contacts-i',
contactUpdate: rootUrl2 + 'contacts-u',
contactDelete: rootUrl2 + 'contacts-d',
}
