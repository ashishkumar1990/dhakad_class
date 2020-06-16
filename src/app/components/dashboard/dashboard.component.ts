import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(private _router:Router) { }

  ngOnInit() {
  }

  onClickCategory(){
    this._router.navigate(['/category']);
  }

  onClickSubCategory(){
    this._router.navigate(['/subcategory']);
  }

  onClickPackage(){
    this._router.navigate(['/package']);
  }
}
