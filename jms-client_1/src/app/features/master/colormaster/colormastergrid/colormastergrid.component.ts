import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { colormasterservice } from '../../../../core/service/colormaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-colormastergrid',
  templateUrl: './colormastergrid.component.html',
  styleUrls: ['./colormastergrid.component.scss']
})
export class ColormastergridComponent implements OnInit {

  @Input() name:string='colormaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;

  constructor(private router: Router,
    private colormasterService: colormasterservice,
    private inactivateAlert: InactivateAlert,
    private sidebarnavservice: SidebarnavService) { 
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
      this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
      this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
      this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
    }

  async ngOnInit() {
    this.subscription=this.colormasterService.selectedrowevent.subscribe((e) => {
      console.log(e)
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/colormaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.colormasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/colormaster/edit/' + this.selectedNodes.id);
  }

  OnViewClick(){
    this.router.navigateByUrl('/colormaster/view/' + this.selectedNodes.id);
}

OnDeleteClick() {
  this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.id, "colormaster");
}

}
