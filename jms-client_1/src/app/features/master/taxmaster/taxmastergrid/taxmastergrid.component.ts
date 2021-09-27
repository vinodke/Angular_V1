import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { companymasterservice } from '../../../../core/service/companymaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { taxmasterService } from '../../../../core/service/taxmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-taxmastergrid',
  templateUrl: './taxmastergrid.component.html',
  styleUrls: ['./taxmastergrid.component.scss']
})
export class TaxmastergridComponent implements OnInit {

  @Input() name:string='taxmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private taxmasterservice: taxmasterService,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.taxmasterservice.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/taxmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.taxmasterservice.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/taxmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/taxmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "taxmaster");
}

}
