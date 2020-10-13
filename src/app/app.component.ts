import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { GLOBAL } from './app.const';
import { IEnrolee } from './app.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ntt-data';
  enrolleesList: IEnrolee[] = [];
  cloneEnrolleesList: IEnrolee[] = [];
  enableEdit = true;
  status = {
    active: true,
    inactive: true
  };
  selected: IEnrolee;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.getEnrollees();
  }

  getEnrollees() {
    this.appService.makeServerCall('enrollees', GLOBAL.GET).subscribe((response: IEnrolee[]) => {
      if (response) {
        this.enrolleesList = response;
        this.cloneEnrolleesList = JSON.parse(JSON.stringify(response));
      }
    });
  }


  onActiveChange(event) {
    this.status.active = event.target.checked;
    this.filterEnrolees();
  }

  onInActiveChange(event) {
    this.status.inactive = event.target.checked;
    this.filterEnrolees();
  }

  filterEnrolees() {
    let activeUsers = [];
    let inactiveusers = [];
    if (this.status.active && this.status.inactive) {
      this.enrolleesList = [...this.cloneEnrolleesList];
    } else if (!this.status.active && !this.status.inactive) {
      this.enrolleesList = [];
    } else {
      if (this.status.active) {
        activeUsers = this.cloneEnrolleesList.filter(e => e.active);
      }
      if (this.status.inactive) {
        inactiveusers = this.cloneEnrolleesList.filter(e => !e.active);
      }
      this.enrolleesList = [...activeUsers, ...inactiveusers];
    }
  }

  onEditRecord(i: number) {
    this.enableEdit = !this.enableEdit;
    this.selected = this.enrolleesList[i];
  }

  onUpdateRecord() {
    this.enableEdit = !this.enableEdit;
    const id = this.selected.id;
    this.appService.makeServerCall(`${'enrollees/'}${id}`, GLOBAL.PUT, this.selected).subscribe((response: IEnrolee) => {
      if (response) {
        const index = this.enrolleesList.findIndex(e => e.id === response.id);
        this.enrolleesList[index] = response;
      }
    });
  }

  onNameChange(event) {
    this.selected.name = event.target.value;
  }

  onStatusChange(event) {
    this.selected.active = event.target.checked;
  }
}
