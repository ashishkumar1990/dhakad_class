import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})

export class SubCategoryComponent implements OnInit {

  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(private _router: Router) {
  }

  ngOnInit() {
  }
}
