import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import * as _ from "underscore";
import {FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
const  _serverUrl = 'http://34.93.43.250:3000/';


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
  categories=[];


  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getCategories();
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

  getCategories ()  {
    let  getAllCategoryUrl="admin/categories?";
    return this._http.get<any>(_serverUrl+getAllCategoryUrl).subscribe(
      (res) =>{
        this.categories=res.data;
        // let categories= _.map(res.data,function (category,index) {
        //   category.position=(index+1);
        //   category.imagePath="http://34.93.43.250:3000/uploads/"+category.image;
        //   return category;
        // });
        // this.dataSource =new MatTableDataSource(categories);
        // this.dataSource.paginator = this.paginator;
        this.toastr.success('categories loaded successfully.')

      } ,
      (err) => console.log(err)
    );

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
