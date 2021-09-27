import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { uommasterservice } from '../../../../core/service/uommaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-uommastergrid',
  templateUrl: './uommastergrid.component.html',
  styleUrls: ['./uommastergrid.component.scss']
})
export class UommastergridComponent implements OnInit {

  @Input() name:string='uommaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private uommasterService: uommasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.uommasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/uommaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.uommasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/uommaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/uommaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "uommaster");
}

}
