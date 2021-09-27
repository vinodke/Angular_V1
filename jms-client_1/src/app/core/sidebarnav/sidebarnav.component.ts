import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SideMenuItems } from '../../shared/model/SideMenuItems';
import { SidebarnavService } from '../service/sidebarnav.service';
declare var $: any;

@Component({
  selector: 'org-fat-sidebarnav',
  templateUrl: './sidebarnav.component.html',
  styleUrls: ['./sidebarnav.component.scss']
})
export class SidebarnavComponent implements OnInit {
  userName = localStorage.getItem('userName');
  appID = localStorage.getItem('appID');
  sidemenuItems: SideMenuItems[] = [];
  uniqueParentName: string[] = [];
  parentMenuItems: SideMenuItems[] = [];
  //temp: string[] = [];
  companyName = localStorage.getItem('companyID');
  rla!: string | string[];

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isReleaseAllowed: boolean = false;
  private currentTheme: string = 'default';

  constructor(private sidebarnavservice: SidebarnavService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isCreateAllowed = this.sidemenuItems.some(
          item => item.menuType === "CONTEXTMENU" && item.menuName === "CreateNew" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
        this.isEditAllowed = this.sidemenuItems.some(
          item => item.menuType === "CONTEXTMENU" && item.menuName === "Edit" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
        this.isViewAllowed = this.sidemenuItems.some(
          item => item.menuType === "CONTEXTMENU" && item.menuName === "View" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
        this.isDeleteAllowed = this.sidemenuItems.some(
          item => item.menuType === "CONTEXTMENU" && item.menuName === "Delete" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isReleaseAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Delete" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);

        localStorage.setItem('currentPage', event.url.replace('/', '').toLowerCase());
        localStorage.setItem("isCreateAllowed", this.isCreateAllowed.toString());
        localStorage.setItem("isEditAllowed", this.isEditAllowed.toString());
        localStorage.setItem("isViewAllowed", this.isViewAllowed.toString());
        localStorage.setItem("isDeleteAllowed", this.isDeleteAllowed.toString());
        localStorage.setItem("isReleaseAllowed", this.isReleaseAllowed.toString());
      }
    });
  }


  ngOnInit(): void {
    this.getNavItems();
  }

  getNavItems() {
    this.sidebarnavservice.getSideNavItems().subscribe(data => {
      this.sidemenuItems = data;
      console.log(this.sidemenuItems)
      this.parentMenuItems = this.sidemenuItems.filter(i => i.parentMenuName == null).
        sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1);
      console.log(this.parentMenuItems);
    });
  }

  getChildMenuItems(parentMenuName: string) {
    return this.sidemenuItems.filter(i => i.parentMenuName === parentMenuName)
      .sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1);
  }

  onSearchChange(searchValue: string) {
    //TODO: Search box is not proper, deleting the typed character is not working as expected
    if (!searchValue) {
      this.getNavItems();
    } // when nothing has typed
    this.sidemenuItems = this.sidemenuItems.filter(
      item => item.menuText.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    )
  }
}
