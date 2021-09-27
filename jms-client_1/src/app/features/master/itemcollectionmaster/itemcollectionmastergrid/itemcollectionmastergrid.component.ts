import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { itemcollectionmasterservice } from '../../../../core/service/itemcollectionmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-itemcollectionmastergrid',
  templateUrl: './itemcollectionmastergrid.component.html',
  styleUrls: ['./itemcollectionmastergrid.component.scss']
})
export class ItemcollectionmastergridComponent implements OnInit {

  @Input() name:string='itemcollectionmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private itemCollectionMasterService: itemcollectionmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.itemCollectionMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/itemcollectionmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.itemCollectionMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/itemcollectionmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/itemcollectionmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "itemcollectionmaster");
}

}
