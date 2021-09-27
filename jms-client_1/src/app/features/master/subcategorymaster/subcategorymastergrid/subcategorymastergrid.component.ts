import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { subcategorymasterservice } from '../../../../core/service/subcategorymaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-subcategorymastergrid',
  templateUrl: './subcategorymastergrid.component.html',
  styleUrls: ['./subcategorymastergrid.component.scss']
})
export class SubcategorymastergridComponent implements OnInit {

  @Input() name:string='subcategorymaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private subcategoryMasterService: subcategorymasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.subcategoryMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/subcategorymaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.subcategoryMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/subcategorymaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/subcategorymaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "subcategorymaster");
}

}
