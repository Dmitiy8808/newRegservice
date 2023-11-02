import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent {
  @Input() totalItems!: number;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() itemsPerPageChanged = new EventEmitter<number>();


  pages: number[] = [];
  lastPage: number = 1;
  showOptions: boolean = false;
  options: number[] = [5, 10, 20, 50];


  constructor(private _eref: ElementRef) { }


  ngOnInit(): void {
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculatePages();
    }
  }


  calculatePages() {
    this.pages = [];
    this.currentPage = 1;
    this.lastPage = Math.ceil(this.totalItems / this.itemsPerPage);
    for(let i=1; i<= this.lastPage; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);
  }


  toggleDropdown(): void {
    this.showOptions = !this.showOptions;
  }

  selectOption(option: number): void {
    this.itemsPerPage = option;
    this.showOptions = false;
    this.itemsPerPageChanged.emit(this.itemsPerPage);
    this.currentPage = 1;
    this.calculatePages();

  }

  onFilterPageChange() {
    this.pages = [];
    console.log('onFilterPageChange called');
    console.log('this.totalItems' + this.totalItems);

    this.pageChanged.emit(this.currentPage);

    this.currentPage = 1;
    this.calculatePages();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: { target: any; }) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.showOptions = false;
    }
  }



}



