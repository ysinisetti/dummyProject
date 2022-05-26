import { FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { Component, OnInit, HostListener } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.scss'],
})
export class RisksComponent implements OnInit {
 // editCache: { [key: string]: { edit: boolean; data: ItemData } } = {} // edit to dirtyFlag
 listOfData = [
  // tslint:disable-next-line:max-line-length
  { no: '11', id: '1', task: 'DMaas Project', startDate: 'Sep 5, 2020', endDate: 'Jan 15, 2021', duration: '132', rowId: '1', depends: '1', resources: 'Abc', level: 0, dirty: false },
  // tslint:disable-next-line:max-line-length
  { no: '12', id: '2', task: 'Omega', startDate: 'Oct 8, 2020', endDate: 'Apr 7, 2021', duration: '181', rowId: '2', depends: '2', resources: 'Xyz', level: 1, dirty: false },
  // tslint:disable-next-line:max-line-length
  { no: '14', id: '3', task: 'EDI B2B Platform upgrade', startDate: 'Oct 25, 2020', endDate: 'Oct 28, 2020', duration: '3', rowId: '3', depends: '3', resources: 'Aaa', level: 2, dirty: false },
  // tslint:disable-next-line:max-line-length
  { no: '17', id: '4', task: 'Hubble', startDate: 'Sep 14, 2020', endDate: 'Oct 19, 2020', duration: '35', rowId: '4', depends: '4', resources: 'Bbb', level: 3, dirty: false },
  // tslint:disable-next-line:max-line-length
  { no: '19', id: '5', task: 'Miracel Cafe Application', startDate: 'Oct 15, 2020', endDate: 'Nov 20, 2020', duration: '36', rowId: '5', depends: '5', resources: 'Ccc', level: 4, dirty: false }
]
// listOfData = []
lastobj: any
currentRowId: number
recordCount: number
currentRowData: any
currentIndex: any
dataAfterDrag: any
level: any
currentLevel: any
disable: boolean = true
@HostListener('window:keydown', ['$event']) // Host listner is a decorator used to handle events
keyboardInput(event: any) { // We added a hostListener to the keyboardInput method by passing parameter
  console.log(event)
  if (event.key === 'Tab') {
    console.log(event)
    if (event.srcElement.name === 'resources') {
      console.log(+this.currentRowId, this.recordCount - 1)
      if (+this.currentIndex === (this.recordCount - 1)) {
        console.log('after checking condition to add record')
        this.addRecord()
        this.currentRowId++
        this.currentIndex++
      } else {
        console.log(this.currentRowData.address, event.target.value)
        // if (this.currentRowData.address !== event.target.value) {
        // this.currentRowData.address = event.target.value
        // this.currentRowData.dirty = true // commented on friday
        // this.listOfData[this.currentRowId].address = event.target.value
        console.log(this.listOfData)
        console.log(this.currentRowId, typeof this.currentRowId)
        this.listOfData = this.listOfData
        this.currentRowId++
        this.currentIndex++
        // this.recordCount++
      }
    }
  }
}

ngOnInit(): void {
  // const data = []
  // get data from the api for this project but for now populate with dummy data
  console.log('started ngOnInit', this.listOfData)
  // for (let i = 0; i < 3; i++) {
  //   data.push({
  //     id: `${i}`,
  //     projectName: `DMaas Project ${i}`,
  //     Customername: `Miracle Software Systems ${i}`,
  //     startDate: `Sep ${i}, 2020`,
  //     endDate: `nov ${i}, 2020`,
  //     duration: `15${i}`,
  //     rowId: `${i}`,
  //     dirty: false
  //   })
  // }
  // this.listOfData = data
  console.log(this.listOfData)
  this.currentRowId = -1 // changed  1 to -1 initial value is 0
  this.currentIndex = -1
  this.recordCount = this.listOfData.length
  console.log(this.listOfData.length)
  // this.lastobj = this.listOfData[this.listOfData.length - 1].address
  // this.backgroundstatus(this.listOfData)
}
backgroundstatus(bgData) {
  console.log(bgData)
  this.level = bgData.level * 20
  if (bgData.level === 1) {
    return 'level1'
  } else if (bgData.level === 2) {
    return 'level2'
  } else if (bgData.level === 3) {
    return 'level3'
  } else if (bgData.level === 4) {
    return 'level4'
  }
}
// Used to get the current row data
onTrClick(data, index): void { // data = rowData & index = rowIndex
  console.log(data, index)
  this.currentIndex = index
  this.currentRowData = data
  this.currentLevel = data.level
  this.currentRowId = data.rowId
}
// Used to add an empty record
addRecord() {
  const data = []
  console.log('adding a new record to data')
  data.push({
    id: null,
    no: null,
    task: null,
    Customername: null,
    startDate: null,
    endDate: undefined,
    duration: null,
    rowId: this.recordCount,
    dirty: false,
    depends: null,
    resources: null,
    level: 0

  })
  console.log(this.listOfData)
  console.log(...this.listOfData, ...data)
  this.listOfData = [...this.listOfData, ...data] // Merging or combining exixting & newly add data and assigning to a variable
  this.recordCount++
}
// Used for drag&drop
onDrop(evnt) { // Evnt contains existing and modified data with index values
  console.log(evnt)
  if (evnt.previousContainer === evnt.container) { // Comparing the existing & modified data
    console.log('ifCondition', evnt.previousContainer, evnt.container)
    this.dataAfterDrag = evnt.container.data // Assigning modified data to a variable
    moveItemInArray(evnt.container.data, evnt.previousIndex, evnt.currentIndex)
    this.listOfData = [...this.dataAfterDrag] // Used to recall the tableData
    console.log(this.listOfData)
  } else {
    console.log('else condition')
  }
}
decrement(data) {
  var cLevel = data.level - 1
  console.log('decrement', data, cLevel)
  if (data.level == cLevel) {
    console.log('if condition')
    this.disable = true
  } else {
    console.log('else cond')
    data.level--
  }
}
increment(data) {
  console.log('increment', data)
  data.level++
}
add() {
  console.log('add method')
}
}
interface ItemData {
id: number
name: string
age: number
contact: number
address: string
rowId: number
dirty: boolean
}
