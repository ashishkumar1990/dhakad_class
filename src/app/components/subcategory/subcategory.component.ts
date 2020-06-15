import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as _ from 'underscore';

export interface PeriodicElement {
  name: string;
  position: number;
  image: string;
}
let ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen',image:""},
  {position: 2, name: 'Helium', image: ""},
  {position: 3, name: 'Lithium', image: ""},
  {position: 4, name: 'Beryllium', image: ""},
  {position: 5, name: 'Boron', image: "", },
  {position: 6, name: 'Carbon', image: ""},
  {position: 7, name: 'Nitrogen', image: ""},
  {position: 8, name: 'Oxygen', image: ""},
  {position: 9, name: 'Fluorine', image: ""},
  {position: 10, name: 'Neon', image: ""},
];


@Component({
  selector: 'app-sub-category',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})

export class SubCategoryComponent implements OnInit {

  displayedColumns: string[] = ['position','image', 'name', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(private _router: Router) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  removeSubCategory(id){
    let newData=_.filter(ELEMENT_DATA, function (data) {
      return data.position !== id;
    });
    console.log(newData);

    this.dataSource =new MatTableDataSource<PeriodicElement>(newData);
    this.dataSource.paginator = this.paginator;
  }

  addSubCategory(name){
    // console.log(newData);
    ELEMENT_DATA.push({position: 11, name: 'NewSubCategory',image:""});
    this.dataSource =new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

}
