import { Component, OnInit } from '@angular/core';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.less']
})
export class RequestComponent implements OnInit {

  constructor(private requestService: RequestService) {}


  ngOnInit(): void {

    //  this.requestService.getUserAccessRights().subscribe(
    //   response => {
    //     console.log(response); // Handle the response as required
    //   },
    //   error => {
    //     console.error('Error:', error); // Handle error cases
    //   }
    // );
    // const postData = {
    //   "_search": false,
    //   "nd": 1696852949322,
    //   "rows": 25,
    //   "page": 1,
    //   "sidx": "CreationTime",
    //   "sord": "desc",
    //   "gridContext": {
    //     "currentPageIndex": 1,
    //     "pagesAmount": 0,
    //     "recordsAmount": 0,
    //     "innFilter": "",
    //     "kppFilter": "",
    //     "shortNameFilter": "",
    //     "registrationNumberFilter": "",
    //     "creationTimeFilter": "",
    //     "productTypeFilter": 0,
    //     "stepFilter": 0,
    //     "stepTreeFilter": "1_2_4_61_63_64",
    //     "regRequestTypeFilter": 0,
    //     "regRequestGuidFilter": "",
    //     "sortingColumn": "CreationTime",
    //     "sortingOrder": "desc"
    //   }
    // };

    const postData = {
      "_search": false,
      "nd": 1696853100375,
      "rows": 25,
      "page": 1,
      "sidx": "CreationTime",
      "sord": "desc",
      "gridContext": {
        "currentPageIndex": 1,
        "pagesAmount": 0,
        "recordsAmount": 0,
        "innFilter": "",
        "kppFilter": "",
        "shortNameFilter": "",
        "registrationNumberFilter": "",
        "creationTimeFilter": "",
        "productTypeFilter": 0,
        "stepFilter": 0,
        "stepTreeFilter": "",
        "regRequestTypeFilter": 0,
        "regRequestGuidFilter": "",
        "sortingColumn": "CreationTime",
        "sortingOrder": "desc"
      },
      "filters": ""
    };

    this.requestService.getRegRequestStateData(postData).subscribe(
      response => {
        console.log(response); // Handle the response as required
      },
      error => {
        console.error('Error:', error); // Handle error cases
      }
    );
  }



}
