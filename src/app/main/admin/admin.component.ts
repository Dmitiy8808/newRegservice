import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService) {}

  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  allItems: any[] = [];  // your data
  pagedItems: any[] = [];  // data for the current page

  ngOnInit() {
    this.adminService.getAgentsData().subscribe(data => {
      console.log(data);
      // Do something with the data
    });
    this.totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedItems();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedItems();
  }

  updatePagedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedItems = this.allItems.slice(start, end);
  }

}
