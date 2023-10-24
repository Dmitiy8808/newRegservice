import { Component, Input } from '@angular/core';
import { userItems } from './header-data';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  userItems = userItems;

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'head-md-screen'
    }
    return styleClass;
  }
}
