import { FormGroup, FormBuilder } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  tableData = [
    {
      listName: 'Scope',
      url: 'scope',
      details: '',
      src: 'https://image.flaticon.com/icons/png/512/103/103666.png',
    },
    {
      listName: 'Project View',
      url: 'subProjects',
      details: '4 Sub Projects',
      src:
        'https://png.pngtree.com/png-vector/20190701/ourlarge/pngtree-sitemap-icon-for-your-project-png-image_1533725.jpg',
    },
    {
      listName: 'Todo List',
      url: 'tasks',
      details: 'Task to be done in this week',
      src: 'https://cdn2.iconfinder.com/data/icons/business-office-icons/256/To-do_List-512.png',
    },
    {
      listName: 'MileStone',
      url: 'mileStones',
      details: '2 milestones',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS_eLO05uUpft0_horS1Ebnc_Hkw3o-AjLzFw&usqp=CAU',
    },
    {
      listName: 'Resources',
      url: 'resource',
      details: 'Names: Ram, Raju',
      src: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/team-connection-5-517207.png',
    },
    {
      listName: 'Meeting',
      url: 'projectmeetings',
      details: 'Upcoming meetings',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSgKF3cZfVcDgSWQBZW24wkFUoYbq_A22kZOg&usqp=CAU',
    },
    {
      listName: 'Documents',
      url: 'documents',
      details: 'Total number of documents : 20',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQheesixNZTgn_tOaMGD2jdXxN9BNbP1YFWdw&usqp=CAU',
    },
    {
      listName: 'Infrastructure',
      url: 'infrastructure',
      details: 'SDM database down',
      src:
        'https://www.pinclipart.com/picdir/middle/236-2365421_infrastructure-icon-pictures-to-pin-on-pinterest-thepinsta.png',
    },
    {
      listName: 'SLA',
      url: 'sla',
      details: 'Number of agreements : 5',
      src: 'https://www.optima.co.ke/web/image/product.template/29/image',
    },
    {
      listName: 'Issues',
      url: 'defects',
      details: '2 high priority defects',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTxYe3rQ7cDPeysO6MBBuKuNXFKsicnrp5L9g&usqp=CAU',
    },
    {
      listName: 'Releases',
      url: 'releases',
      details: 'Upcoming release date : 20-12-2020',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRWBrQoVDmiY7qDKXShPoCos5weNslJ3NOI2g&usqp=CAU',
    },
    {
      listName: 'Escalation Matrix',
      url: 'escalation',
      details: 'One needs attention',
      src:
        'https://cdn3.iconfinder.com/data/icons/business-line-color-vol-4/70/growth__analysis__increase__chart__graph-512.png',
    },

    {
      listName: 'Services Mgmt',
      url: 'serviceMgmt',
      details: 'Enhancements in pipeline',
      src: 'https://www.clipartkey.com/mpngs/m/104-1041616_service-management-icon-png.png',
    },
    {
      listName: 'Governance',
      url: 'governance',
      details: 'One needs attention',
      src:
        'https://carnivalsustainability.com/wp-content/uploads/2017/06/Icon_board-of-directors.png',
    },
    {
      listName: 'Changes',
      url: 'changes',
      details: 'Tasks to be tracked',
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQimEZB4prhp8RSA6ZcBZpfR8bYa4j_wkLfQg&usqp=CAU',
    },
    {
      listName: 'Risks',
      url: 'risks',
      details: '2 risks identified',
      src: 'https://icon-library.com/images/risk-icon/risk-icon-3.jpg',
    },
  ]
  selectedProject: any
  projectTitle: string

  desc(path) {
    this.router.navigateByUrl('/dashboard/' + path)
    console.log('/dashboard/' + path)
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.selectedProject = this.route.params.subscribe(params => {
      this.projectTitle = params['title']
      console.log('title', this.projectTitle)
    })
  }
  onCurrentPageDataChange(data) {
    console.log(data)
  }
}
