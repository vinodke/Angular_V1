import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { itemMasterService } from '../../../../core/service/itemmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-itemmastergrid',
  templateUrl: './itemmastergrid.component.html',
  styleUrls: ['./itemmastergrid.component.scss']
})
export class ItemmastergridComponent implements OnInit {

  @Input() name:string='itemmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  

  rowData: any;

  constructor(private router: Router,
    private itemMasterService: itemMasterService,
    private inactivateAlert: InactivateAlert) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
     }

  ngOnInit() {
    this.subscription=this.itemMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    
  }

  btnNewClick() {
    this.router.navigateByUrl('/itemmaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.itemMasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/itemmaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/itemmaster/view/' + this.selectedNodes.id);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, this.name);
  }

}
