import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as _ from 'underscore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  position: number;
  image: string;
  enableSubCategory:boolean;
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

const  _serverUrl = 'http://34.93.43.250:3000/';

@Component({
  selector: 'app-sub-category',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})

export class SubCategoryComponent implements OnInit {

  displayedColumns: string[] = ['position','image', 'name', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  categories=[];
  uploadForm: FormGroup;

  // Roles: any = ['Admin', 'Author', 'Reader'];
  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      name: [''],
      parent_id:['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.enableSubCategory=false;
    this.getCategories();
    this.loadSubCategories();
  }

  loadSubCategories ()  {
    let  getAllSubCategoryUrl="admin/categories?parent=false";
    return this._http.get<any>(_serverUrl+getAllSubCategoryUrl).subscribe(
      (res) =>{
        let subCategories= _.map(res.data,function (subCategory,index) {
          subCategory.position=(index+1);
          return subCategory;
        });
        this.dataSource =new MatTableDataSource(subCategories);
        this.dataSource.paginator = this.paginator;
        this.toastr.success('sub categories loaded successfully.')

      } ,
      (err) => console.log(err)
    );

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

  allowCategoryForm(){
    this.enableSubCategory=true;
    this.uploadForm.get('name').disable();
    this.uploadForm.get('parent_id').disable();
  }


  submit() {
    console.log(this.uploadForm.value);
    let  addSubCategoryUrl="admin/categories";
    const formData = new FormData();
    formData.append('name', this.uploadForm.value.name);
    formData.append('parent_id', this.uploadForm.value.parent_id);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(_serverUrl+addSubCategoryUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Sub-Category added successfully');
          this.enableSubCategory=false;
        }

      } ,
      (err) => console.log(err)
    );
  }

  getSubCategoryById (id)  {
    let  getSubCategoryUrl="admin/categories/"+id;
    return this._http.get<any>(_serverUrl+getSubCategoryUrl).subscribe(
      (res) =>{
        this.enableSubCategory=true;
        this.uploadForm.patchValue({
          name: res.data.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.toastr.success('sub category loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  removeSubCategory(id){
    let  deleteAllSubCategoryUrl="admin/categories/"+id;
    return this._http.delete<any>(_serverUrl+deleteAllSubCategoryUrl).subscribe(
      (res) =>{
        this.toastr.success('sub category removed successfully.');
        this.loadSubCategories();
      } ,
      (err) => console.log(err)
    );

  }
  reset() {
    this.uploadForm.value.name=[''];
    this.uploadForm.value.parent_id=[''];
    this.enableSubCategory=false;
  }
}
