import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { companymasterservice } from '../../../../core/service/companymaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-companymastergrid',
  templateUrl: './companymastergrid.component.html',
  styleUrls: ['./companymastergrid.component.scss']
})
export class CompanymastergridComponent implements OnInit {

  @Input() name:string='companymaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private companyMasterService: companymasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.companyMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/companymaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.companyMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/companymaster/edit/' + this.selectedNodes.companyName);
  }

  OnViewClick(){
    this.router.navigateByUrl('/companymaster/view/' + this.selectedNodes.companyName);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.companyName, "companymaster");
}

}
