import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { cashcountermasterservice } from '../../../../core/service/cashcountermaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';


@Component({
  selector: 'org-fat-cashcountermastergrid',
  templateUrl: './cashcountermastergrid.component.html',
  styleUrls: ['./cashcountermastergrid.component.scss']
})
export class CashcountermastergridComponent implements OnInit {

  @Input() name:string='cashcountermaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  
  constructor(private router: Router,
    private cashcountermasterService: cashcountermasterservice,
    private inactivateAlert: InactivateAlert) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
     }

  async ngOnInit() {
    
    this.subscription=this.cashcountermasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/cashcountermaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.cashcountermasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/cashcountermaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/cashcountermaster/view/' + this.selectedNodes.id);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, this.name);
  }


}
