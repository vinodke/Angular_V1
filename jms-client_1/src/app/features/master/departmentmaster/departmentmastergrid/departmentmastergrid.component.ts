import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { Subscription } from 'rxjs';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';

@Component({
  selector: 'org-fat-departmentmastergrid',
  templateUrl: './departmentmastergrid.component.html',
  styleUrls: ['./departmentmastergrid.component.scss']
})
export class DepartmentmastergridComponent implements OnInit {
  @Input() name:string='departmentmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  constructor(private router: Router,
    private departmentmasterService: DepartmentmasterService,
    private sidebarnavservice: SidebarnavService,
    private inactivateAlert: InactivateAlert) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
       
     }

  async ngOnInit() {
    this.subscription=this.departmentmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/departmentmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.departmentmasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/departmentmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/departmentmaster/view/' + this.selectedNodes.id);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, this.name);
  }

}
