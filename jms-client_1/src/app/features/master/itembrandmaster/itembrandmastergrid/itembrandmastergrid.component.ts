import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { itembrandmasterservice } from '../../../../core/service/itembrandmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-itembrandmastergrid',
  templateUrl: './itembrandmastergrid.component.html',
  styleUrls: ['./itembrandmastergrid.component.scss']
})
export class ItembrandmastergridComponent implements OnInit {

  @Input() name:string='itembrandmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private itemBrandMasterService: itembrandmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.itemBrandMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/itembrandmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.itemBrandMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/itembrandmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/itembrandmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "itembrandmaster");
}

}
