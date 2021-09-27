import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { karatmasterservice } from '../../../../core/service/karatmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-karatmastergrid',
  templateUrl: './karatmastergrid.component.html',
  styleUrls: ['./karatmastergrid.component.scss']
})
export class KaratmastergridComponent implements OnInit {

  @Input() name:string='karatmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private karatMasterService: karatmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.karatMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/karatmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.karatMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/karatmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/karatmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "karatmaster");
}

}
