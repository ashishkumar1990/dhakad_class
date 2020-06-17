import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as _ from 'underscore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


const  _serverUrl = 'http://34.93.43.250:3000/';

@Component({
  selector: 'app-sub-category',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})

export class SubCategoryComponent implements OnInit {

  displayedColumns: string[] = ['position','name', 'category', 'actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  categories=[];
  uploadForm: FormGroup;
  enableSubCategory:boolean;
  mode:string;
  id:string;

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
    this.mode='create';
  }

  loadSubCategories ()  {
    let  getAllSubCategoryUrl="admin/categories";
    return this._http.get<any>(_serverUrl+getAllSubCategoryUrl).subscribe(
      (res) =>{
        let subCategories = _.filter(res.data, function (category) {
          return category.parent_id;
        });
        let allCategories=this.categories;
        subCategories= _.map(subCategories,function (subCategory,index) {
         let categoryData= _.find(allCategories ,function (category) {
            return category._id===subCategory.parent_id;
          });
          subCategory.categoryName='';
         if(categoryData){
           subCategory.categoryName=categoryData.name;
         }
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
        this.categories = _.filter(res.data, function (category) {
          return !category.parent_id;
        });
      } ,
      (err) => console.log(err)
    );

  }

  allowCategoryForm(){
    this.enableSubCategory=true;
  }


  submit() {
    console.log(this.uploadForm.value);
    let  addSubCategoryUrl=this.mode==='update'?"admin/categories/"+this.id:"admin/categories";
    const formData = new FormData();
    formData.append('name', this.uploadForm.value.name);
    formData.append('parent_id', this.uploadForm.value.parent_id);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    if(this.mode==='update'){
      return this._http.put<any>(_serverUrl+addSubCategoryUrl, formData,{headers:headers}).subscribe(
        (res) =>{
          if (res.message === 'Something went wrong') {
            this.toastr.error('Something went wrong.')
          } else {
            this.toastr.success('Sub-Category updated successfully');
            this.loadSubCategories();
            this.enableSubCategory=false;
          }

        } ,
        (err) => console.log(err)
      );
    }else{
      return this._http.post<any>(_serverUrl+addSubCategoryUrl, formData,{headers:headers}).subscribe(
        (res) =>{
          if (res.message === 'Something went wrong') {
            this.toastr.error('Something went wrong.')
          } else {
            this.toastr.success('Sub-Category added successfully');
            this.loadSubCategories();
            this.enableSubCategory=false;
          }

        } ,
        (err) => console.log(err)
      );
    }

  }

  getSubCategoryById (id)  {
    let  getSubCategoryUrl="admin/categories/"+id;
    return this._http.get<any>(_serverUrl+getSubCategoryUrl).subscribe(
      (res) =>{
        this.mode='update';
        this.id=id;
       let  subCategoryData= res.data;
        this.enableSubCategory=true;
        this.uploadForm.patchValue({
          name: subCategoryData.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.uploadForm.patchValue({
          parent_id: subCategoryData.parent_id
        });
        this.uploadForm.get('parent_id').updateValueAndValidity();
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
