import { Component, ElementRef, OnInit, HostListener, ViewChild } from '@angular/core';
import { AdminService } from './admin.service';
import { AgentDataParams } from 'src/app/shared/models/agentDataParams';
import { Agent } from 'src/app/shared/models/agent';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { RequestDetailComponent } from '../request-detail/request-detail.component';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  @ViewChild(CdkMenuTrigger) filterMenuTrigger?: CdkMenuTrigger;
  @ViewChild('dropdownRef') dropdownRef?: ElementRef;
  agents: Agent[] = [];
  agentDataParams: AgentDataParams;
  totalpages: number = 0;
  totalrecords: number = 0;
  filterForm!: FormGroup
  searchForm!: FormGroup;
  inputSearchValue?: string;
  isInnInSearchValue: boolean = false;
  isLoginInSearchValue: boolean = false;
  isAgentNameInSearchValue: boolean = false;

  showOptions: boolean = false;
  options: string[] = ['Да', 'Нет'];
  itemsPerPage = '';
  private searchSubscription?: Subscription;


  constructor(private adminService: AdminService, private _eref: ElementRef, private overlayService: OverlayService) {
    this.agentDataParams = adminService.getAgentDataParams();
  }


  ngOnInit() {
    this.getAgents();
    this.filterForm = new FormGroup({
      "Login": new FormControl(null),
      "PersonFio": new FormControl(null),
      "AgentName": new FormControl(null),
      "Inn": new FormControl(null),
      "Kpp": new FormControl(null),
      "IsIdentCenter": new FormControl(null)
    });
    this.searchForm = new FormGroup({
      searchInput: new FormControl(null),
    });

    this.searchSubscription = this.searchForm.get('searchInput')!.valueChanges
      .pipe(
        debounceTime(500), // Adjust time for debounce as needed
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.inputSearchValue = value;
        this.updateAgentDataParams(this.inputSearchValue!);
        this.getAgents();
      });
  }

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    this.searchSubscription!.unsubscribe();
  }


  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    // If the click is outside the dropdown element, hide the dropdown
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target) &&
        !this._eref.nativeElement.contains(event.target)) {
      this.showOptions = false;
    }
  }

  // onInputChange() {
  //   this.inputSearchValue = this.searchForm.get('searchInput')!.value;
  //   console.log(this.inputSearchValue);
  //   this.updateAgentDataParams(this.inputSearchValue!);
  //   this.getAgents();
  // }

  // onInputChange(event: Event) {
  //   console.log('inputSearchValue change')
  //   const input = event.target as HTMLInputElement; // Type assertion
  //   const value = input.value;
  //   this.inputSearchValue = value;
  //   this.updateAgentDataParams(value);
  //   this.getAgents();; // Trigger API call
  // }

  clearInputSearchValue() {
    this.searchForm.reset({ searchInput: '' });
    this.inputSearchValue = '';// Resets only the searchInput control
    // Additional logic after clearing the input...
  }

  updateAgentDataParams(value: string) {
    if (/^\d+$/.test(value)) { // If input contains only digits
      if (!this.filterForm.get('Inn')?.value) {
        this.agentDataParams.Login = null;
        this.agentDataParams.AgentName = null;
        this.agentDataParams.Inn = value;
        this.isInnInSearchValue = true;
      }
    } else if (/^[A-Za-z0-9@.]+$/.test(value)) { // If input contains only Latin letters
      if (!this.filterForm.get('Login')?.value) {
        this.agentDataParams.AgentName = null;
        this.agentDataParams.Inn = null;
        this.agentDataParams.Login = value;
        this.isLoginInSearchValue = true;
      }
    } else if (/^[А-Яа-яёЁ\s«»"-]+$/.test(value)) { // If input contains only Russian letters
      if (!this.filterForm.get('Login')?.value) {
        this.agentDataParams.Inn = null;
        this.agentDataParams.Login = null;
        this.agentDataParams.AgentName = value;
        this.isAgentNameInSearchValue = true;
      }
    } else {
      if (!this.filterForm.get('Inn')?.value) {
        this.agentDataParams.Inn = null;
      }
      if (!this.filterForm.get('Login')?.value) {
        this.agentDataParams.Login = null;
      }
      if (!this.filterForm.get('AgentName')?.value) {
        this.agentDataParams.AgentName = null;
      }
    }

    this.adminService.setAgentDataParams(this.agentDataParams);

  }

  // dropdown start
  toggleDropdown(): void {
    this.showOptions = !this.showOptions;
  }

  selectOption(option: any): void {

    this.filterForm.get('IsIdentCenter')?.setValue(option);
    this.showOptions = false;
  }

  // dropdown end

  applyFilter() {
    this.isInnInSearchValue = false;
    this.isLoginInSearchValue = false;
    this.isAgentNameInSearchValue = false;
    this.createAgentDataParamsFromForm();
    this.closeFilterMenu();
  }

  closeFilterMenu() {
    if (this.filterMenuTrigger) {
      this.filterMenuTrigger.close();
    }
  }

  // get login() {return this.filterForm.get('login'); }
  // get fio() {return this.filterForm.get('fio'); }

  clearSearch(controlName: string): void {
    this.filterForm.get(controlName)?.reset();
  }

  get isDisabled(): boolean {
    const controls = this.filterForm.controls;
    return Object.keys(controls).every(
      key => !controls[key].value
    );
  }

  getAgents(): void {
    this.adminService.getAgentsData().subscribe({
      next: responce => {
        this.agents = responce.rows;
        this.agentDataParams.page = responce.page;
        this.agentDataParams.Page = responce.page;
        this.totalpages = responce.totalpages;
        this.totalrecords = responce.totalrecords;
        console.log(this.totalpages);
      },
      error: error => console.log(error)

    })


    console.log(this.agents);
  }


  onScroll(event: any): void {
    const thead = event.target.previousElementSibling;
    if (event.target.scrollTop > 0) {
      thead.classList.add('box-shadow');
      thead.classList.remove('no-shadow');
    } else {
      thead.classList.remove('box-shadow');
      thead.classList.add('no-shadow');
    }

  }

  onPageChanged(event: any) {
    const params = this.adminService.getAgentDataParams();
    if (this.agentDataParams.page !== event.page) {
      this.agentDataParams.page = event;
      this.agentDataParams.Page = event;
      this.adminService.setAgentDataParams(params);
      this.agentDataParams = params;
      this.getAgents();
    }
  }

  onItemsPerPageChanged(newItemsPerPage: number) {
    const params = this.adminService.getAgentDataParams();
    this.agentDataParams.rows = newItemsPerPage;
    this.agentDataParams.Rows = newItemsPerPage;
    this.agentDataParams.page = 1;
    this.agentDataParams.Page = 1;
    this.adminService.setAgentDataParams(params);
    this.agentDataParams = params;
    this.getAgents();
  }


  createAgentDataParamsFromForm(): void {
    const params = this.adminService.getAgentDataParams();

    Object.keys(this.filterForm.controls).forEach(controlName => {
      if (this.filterForm.contains(controlName)) {
        (params as any)[controlName] = this.filterForm.get(controlName)?.value ?? (params as any)[controlName];
      }
    });

    this.agentDataParams.page = 1;
    this.agentDataParams.Page = 1;  // Make sure you need both 'page' and 'Page'
    this.adminService.setAgentDataParams(params);
    this.agentDataParams = params;
    this.getAgents();
  }

  clearProperty(property: keyof AgentDataParams) {

    if (this.filterForm.get(property)) {
      this.filterForm!.get(property)!.reset();
    }
    const params = this.adminService.getAgentDataParams();
    (this.agentDataParams as any)[property] = null;
    this.adminService.setAgentDataParams(params);
    this.agentDataParams = params;
    this.getAgents();

  }


  openOverlay() {
    const overlayRef = this.overlayService.openOverlay(RequestDetailComponent);

    // // Optional: close the overlay when user clicks on the backdrop
    // overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }


}
