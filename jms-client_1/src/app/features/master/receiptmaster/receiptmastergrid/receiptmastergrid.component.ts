import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-receiptmastergrid',
  templateUrl: './receiptmastergrid.component.html',
  styleUrls: ['./receiptmastergrid.component.scss']
})
export class ReceiptmastergridComponent implements OnInit {
  @Input() name:string='receiptmaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  isReceiptApproved: boolean = false;

  constructor(private router: Router,
    private receiptMasterService: ReceiptMasterService) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
     }

  async ngOnInit() {
    
    this.subscription=this.receiptMasterService.selectedrowevent.subscribe((e) => {
      this.selectedNodes = e.data;
      this.isRowUnSelected = false;
      this.isReceiptApproved = e.data.receiptStatus == 50;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/receipt/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.receiptMasterService.refreshClickevent.next();
  }

  OnEditClick(){
    this.router.navigate(['receipt/edit', this.selectedNodes.receiptId]);
      //this.router.navigateByUrl('' + );
  }

  OnViewClick(){
    this.router.navigate(['receipt/view', this.selectedNodes.receiptId]);
    //this.router.navigateByUrl('/receipt/view/' + this.selectedNodes.receiptId);
}

OnApproveClick(){
  this.router.navigate(['assetverification/edit', this.selectedNodes.receiptId]);
}

}

