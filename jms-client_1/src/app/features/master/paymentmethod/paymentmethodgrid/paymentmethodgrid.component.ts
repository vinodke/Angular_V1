import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { companymasterservice } from '../../../../core/service/companymaster.service';
import { paymentmethodService } from '../../../../core/service/paymentmethod.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { taxmasterService } from '../../../../core/service/taxmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-paymentmethodgrid',
  templateUrl: './paymentmethodgrid.component.html',
  styleUrls: ['./paymentmethodgrid.component.scss']
})
export class PaymentmethodgridComponent implements OnInit {

  @Input() name:string='paymentmethod';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private paymentmethodservice: paymentmethodService,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.paymentmethodservice.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/paymentmethod/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.paymentmethodservice.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/paymentmethod/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/paymentmethod/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "paymentmethod");
}
}
