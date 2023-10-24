import { Component } from '@angular/core';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less']
})
export class MainLayoutComponent {

  isSideNavCollapsed = true;
  screenWidth = 0;



  ngOnInit(): void {
    // Initialize screenWidth with the current window's innerWidth.
    this.screenWidth = window.innerWidth;
    const storedCollapsedState = localStorage.getItem('sidenav-collapsed');
    if (storedCollapsedState !== null) {
      this.isSideNavCollapsed = storedCollapsedState === 'true';
    }
  }

  onToggleSidenav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
