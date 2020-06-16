import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import * as _ from "underscore";
import {FormBuilder, FormGroup} from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  image: string;
}
let ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', image: ""},
  {position: 2, name: 'Helium', image: ""},
  {position: 3, name: 'Lithium', image: ""},
  {position: 4, name: 'Beryllium', image: ""},
  {position: 5, name: 'Boron', image: "",},
  {position: 6, name: 'Carbon', image: ""},
  {position: 7, name: 'Nitrogen', image: ""},
  {position: 8, name: 'Oxygen', image: ""},
  {position: 9, name: 'Fluorine', image: ""},
  {position: 10, name: 'Neon', image: ""},
];


@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})

export class PackageComponent implements OnInit {

  imageURL: string;
  uploadForm: FormGroup;
  displayedColumns: string[] = ['position', 'image', 'name', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(public fb: FormBuilder) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  removePackage(id) {
    let newData = _.filter(ELEMENT_DATA, function (data) {
      return data.position !== id;
    });
    console.log(newData);

    this.dataSource = new MatTableDataSource<PeriodicElement>(newData);
    this.dataSource.paginator = this.paginator;
  }

  addPackage(name) {
    // console.log(newData);
    ELEMENT_DATA.push({position: 11, name: 'NewPackage', image: ""});
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }


  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  // Submit Form
  submit() {
    console.log(this.uploadForm.value);
  }
}
