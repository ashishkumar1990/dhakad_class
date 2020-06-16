import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
const  _serverUrl = 'http://34.93.43.250:3000/';
import * as _ from 'underscore';


let Categories= [];

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})


export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['position','image', 'name', 'actions'];
  dataSource = new MatTableDataSource(Categories);
  imageURL: string;
  imageColor:string;
  textColor:string;
  enableCategory:boolean;

  uploadForm: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      image: [null],
      name: [''],
      text_bg: [''],
      image_bg: ['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.enableCategory=false;
    this.loadCategories();

  }

  loadCategories ()  {
      let  getAllCategoryUrl="admin/categories?";
      return this._http.get<any>(_serverUrl+getAllCategoryUrl).subscribe(
        (res) =>{
         let categories= _.map(res.data,function (category,index) {
            category.position=(index+1);
            category.imagePath="http://34.93.43.250:3000/uploads/"+category.image;
            return category;
          });
          this.dataSource =new MatTableDataSource(categories);
          this.dataSource.paginator = this.paginator;
          this.toastr.success('categories loaded successfully.')

        } ,
        (err) => console.log(err)
      );

  }
  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      image: file
    });
    this.uploadForm.get('image').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  allowCategoryForm(){
    this.enableCategory=true;
    this.uploadForm.get('image_bg').disable();
    this.uploadForm.get('text_bg').disable();
    this.uploadForm.patchValue({
      text_bg: "#ffffff"
    });
    this.uploadForm.get('text_bg').updateValueAndValidity();
    this.uploadForm.patchValue({
      image_bg: "#ffffff"
    });
    this.uploadForm.get('image_bg').updateValueAndValidity();
  }

  // Submit Form
  submit() {
    console.log(this.uploadForm.value);
    let  addCategoryUrl="admin/categories";
    const formData = new FormData();
    formData.append('image', this.uploadForm.value.image);
    formData.append('name', this.uploadForm.value.name);
    formData.append('text_bg', this.uploadForm.value.text_bg);
    formData.append('image_bg', this.uploadForm.value.text_bg);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(_serverUrl+addCategoryUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Category added successfully');
          this.enableCategory=false;
          this.loadCategories();
        }

      } ,
      (err) => console.log(err)
    );
  }
  onChangeColor(type,$event) {
    if(type==="image"){
      this.uploadForm.patchValue({
        image_bg: $event
      });
      this.uploadForm.get('image_bg').updateValueAndValidity();
    }else{
      this.uploadForm.patchValue({
        text_bg: $event
      });
      this.uploadForm.get('text_bg').updateValueAndValidity();
    }
  }

  getCategoryById (id)  {
    let  getCategoryUrl="admin/categories/"+id;
    return this._http.get<any>(_serverUrl+getCategoryUrl).subscribe(
      (res) =>{
        this.enableCategory=true;
        this.uploadForm.patchValue({
          name: res.data.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.uploadForm.patchValue({
          text_bg: res.data.text_bg
        });
        this.uploadForm.get('text_bg').updateValueAndValidity();
        this.uploadForm.patchValue({
          image_bg: res.data.image_bg
        });
        this.uploadForm.get('image_bg').updateValueAndValidity();


        this.imageURL="http://34.93.43.250:3000/uploads/"+res.data.image;
        this.imageColor=res.data.image_bg;
        this.textColor=res.data.text_bg;
        this.toastr.success('category loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  removeCategory(id){
    let  deleteAllCategoryUrl="admin/categories/"+id;
    return this._http.delete<any>(_serverUrl+deleteAllCategoryUrl).subscribe(
      (res) =>{
        this.toastr.success('category removed successfully.');
      this.loadCategories();
      } ,
      (err) => console.log(err)
    );

  }

  reset() {
    this.uploadForm.value.name=[''];
    this.uploadForm.value.image=[null];
    this.uploadForm.value.image_bg=[''];
    this.uploadForm.value.text_bg=[''];
    this.imageURL="";
    this.enableCategory=false;
  }

}
