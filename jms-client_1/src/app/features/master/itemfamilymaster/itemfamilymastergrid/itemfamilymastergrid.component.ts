import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { itemfamilymasterservice } from '../../../../core/service/itemfamilymaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-itemfamilymastergrid',
  templateUrl: './itemfamilymastergrid.component.html',
  styleUrls: ['./itemfamilymastergrid.component.scss']
})
export class ItemfamilymastergridComponent implements OnInit {

  @Input() name:string='itemfamilymaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private itemFamilyMasterService: itemfamilymasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.itemFamilyMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/itemfamilymaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.itemFamilyMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/itemfamilymaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/itemfamilymaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "itemfamilymaster");
}
}
