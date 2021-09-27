import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { regionmasterservice } from '../../../../core/service/regionmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-regionmastergrid',
  templateUrl: './regionmastergrid.component.html',
  styleUrls: ['./regionmastergrid.component.scss']
})
export class RegionmastergridComponent implements OnInit {

  @Input() name:string='regionmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private regionMasterService: regionmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.regionMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/regionmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.regionMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/regionmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/regionmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "regionmaster");
}

}
