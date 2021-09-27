import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { itemgroupmasterservice } from '../../../../core/service/itemgroupmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-itemgroupmastergrid',
  templateUrl: './itemgroupmastergrid.component.html',
  styleUrls: ['./itemgroupmastergrid.component.scss']
})
export class ItemgroupmastergridComponent implements OnInit {

  @Input() name:string='itemgroupmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private itemGroupmasterService: itemgroupmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.itemGroupmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/itemgroupmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.itemGroupmasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/itemgroupmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/itemgroupmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "itemgroupmaster");
}

}
