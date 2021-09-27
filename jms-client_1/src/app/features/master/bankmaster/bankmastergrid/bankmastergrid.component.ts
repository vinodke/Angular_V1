import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { bankmasterservice } from '../../../../core/service/bankmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-bankmastergrid',
  templateUrl: './bankmastergrid.component.html',
  styleUrls: ['./bankmastergrid.component.scss']
})
export class BankmastergridComponent implements OnInit {

  @Input() name:string='bankmaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  
  constructor(private router: Router,
    private bankMasterService: bankmasterservice,
    private inactivateAlert: InactivateAlert) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
     }

  async ngOnInit() {
    
    this.subscription=this.bankMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/bankmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.bankMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/bankmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/bankmaster/view/' + this.selectedNodes.id);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, this.name);
  }

}
