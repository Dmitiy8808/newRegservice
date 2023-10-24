import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less'],
  animations: [
    fadeInOut
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSidenav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth
      });
    }
  }

  constructor(public router: Router) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;

    // Retrieve the collapsed state from local storage
    const storedCollapsedState = localStorage.getItem('sidenav-collapsed');
    if (storedCollapsedState !== null) {
      this.collapsed = storedCollapsedState === 'true';
    }

  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;

    // Store the new state in local storage
    localStorage.setItem('sidenav-collapsed', this.collapsed.toString());
    this.onToggleSidenav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth
    });
  }


  closeSidenav(): void {
    this.collapsed = false;

    // Store the state in local storage
    localStorage.setItem('sidenav-collapsed', 'false');
    this.onToggleSidenav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth
    });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }


}
