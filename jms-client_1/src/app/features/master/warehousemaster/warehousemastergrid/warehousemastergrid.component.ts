import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { companymasterservice } from '../../../../core/service/companymaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { warehousemasterservice } from '../../../../core/service/warehousemaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-warehousemastergrid',
  templateUrl: './warehousemastergrid.component.html',
  styleUrls: ['./warehousemastergrid.component.scss']
})
export class WarehousemastergridComponent implements OnInit {

  @Input() name:string='warehousemaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private warehouseMasterService: warehousemasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.warehouseMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/warehousemaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.warehouseMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/warehousemaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/warehousemaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "warehousemaster");
}

}
