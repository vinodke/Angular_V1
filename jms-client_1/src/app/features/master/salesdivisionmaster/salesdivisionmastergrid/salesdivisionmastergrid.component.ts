import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { salesdivisionmasterservice } from '../../../../core/service/salesdivisionmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-salesdivisionmastergrid',
  templateUrl: './salesdivisionmastergrid.component.html',
  styleUrls: ['./salesdivisionmastergrid.component.scss']
})
export class SalesdivisionmastergridComponent implements OnInit {

  @Input() name:string='salesdivisionmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private salesdivisionmasterService: salesdivisionmasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.salesdivisionmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/salesdivisionmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.salesdivisionmasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/salesdivisionmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/salesdivisionmaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "salesdivisionmaster");
}

}
