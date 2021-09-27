import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuditmasterService } from '../../../../core/service/auditmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'org-fat-auditmastergrid',
  templateUrl: './auditmastergrid.component.html',
  styleUrls: ['./auditmastergrid.component.css'],
})
export class AuditmastergridComponent implements OnInit {
  @Input() name: string = 'auditmaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isReleaseAllowed: boolean = false;
  isVerifyAllowed: boolean = false;
  released: boolean = false
  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any; 

  constructor(
    private router: Router,
    private auditMasterService: AuditmasterService,
    private datePipe: DatePipe,
    private inactivateAlert: InactivateAlert,private formBuilder: FormBuilder
  ) {
    this.isCreateAllowed = localStorage.getItem('isCreateAllowed') == 'true';
    this.isEditAllowed = localStorage.getItem('isEditAllowed') == 'true';
    this.isViewAllowed = localStorage.getItem('isViewAllowed') == 'true';
    this.isDeleteAllowed = localStorage.getItem('isDeleteAllowed') == 'true';
    this.isReleaseAllowed = true;
    this.isVerifyAllowed = true;

   
  }

  async ngOnInit() {
    console.log('grid')
    this.subscription = this.auditMasterService.selectedrowevent.subscribe(
      (e) => {
        this.isRowUnSelected = false;
        this.selectedNodes = e.data;
      }
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  getLocationMaster() {
    
  }
  btnNewClick() {
    this.router.navigateByUrl('/auditmaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.auditMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl(
      '/auditmaster/edit/' + this.selectedNodes.auditID
    );
  }

  OnViewClick() {
    this.router.navigateByUrl(
      '/auditmaster/view/' + this.selectedNodes.auditID
    );
  }

  OnVerifyClick() {
    this.router.navigateByUrl(
      '/auditmaster/verify/' + this.selectedNodes.auditID
    );
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(
      this.selectedNodes.auditID,
      this.name
    );
  }
  dateFormatForForm(date: any, format?: string) {
    return this.datePipe.transform(date, format ? format : 'yyyy-MM-dd');
  };
 
  OnReleaseClick() {
    this.inactivateAlert.ReleaseConfirmBox({
      auditID: this.selectedNodes.auditID,
      warehouseID: this.selectedNodes.warehouseID,
      releaseDate: this.dateFormatForForm(new Date()),
      releasedBy: localStorage.getItem('userName'),
      status: this.selectedNodes.status,
    }, this.name)

  }
  

  getRowData(data: any) {
    if (data[0].status === 30) {
      this.released = false;
   
      console.log(data[0].status);
    }
    else {
      this.released = true;
      console.log(data[0].status)
    }
  }
 

}
