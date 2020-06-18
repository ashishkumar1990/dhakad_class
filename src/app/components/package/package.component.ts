import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import * as _ from "underscore";
import {FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


const  _serverUrl = 'http://34.93.43.250:3000/';


@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})

export class PackageComponent implements OnInit {

  imageURL: string;
  uploadForm: FormGroup;
  displayedColumns: string[] = ['position', 'image', 'name', 'category','subCategory','duration','validity','mrp','offerAmount','actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  categories=[];
  subCategories=[];
  enablePackage:boolean;
  mode:string;
  id:"";
  lifeTimeValidity:boolean;


  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      image: [null],
      name: [''],
      category_id: [''],
      subCategory_id: [''],
      duration: [''],
      mrp: [''],
      offer_amount: [''],
      tagline: [''],
      description: [''],
      validity:['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getCategories();
    this.mode = 'create';
    this.enablePackage=false;
    this.loadPackages();
  }

  loadPackages ()  {
    let  getAllPackageUrl="admin/packages?";
    return this._http.get<any>(_serverUrl+getAllPackageUrl).subscribe(
      (res) =>{
        let allCategories=this.categories;
        let allSubCategories=this.subCategories;
        let packages= _.map(res.data,function (packageData,index) {
          let categoryData= _.find(allCategories ,function (category) {
            return category._id===packageData.category_id;
          });
          packageData.category='';
          if(categoryData){
            packageData.category=categoryData.name;
          }
          let subCategoryData= _.find(allSubCategories ,function (subCategory) {
            return subCategory._id===packageData.subCategory_id;
          });
          packageData.subCategory='';
          if(subCategoryData){
            packageData.subCategory=subCategoryData.name;
          }
          packageData.position=(index+1);
          packageData.imagePath="http://34.93.43.250:3000/uploads/"+packageData.image;
          return packageData;
        });
        this.dataSource =new MatTableDataSource(packages);
        this.dataSource.paginator = this.paginator;
        this.toastr.success('packages loaded successfully.')

      } ,
      (err) => console.log(err)
    );

  }
  // Submit Form
  submit() {
    if (this.mode === 'create') {
      this.createPackage();
    } else {
      this.updatePackage();
    }

  }
  createPackage(){
    let  addCategoryUrl="admin/packages";
    let data=this.uploadForm.value;
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name',data.name);
    formData.append('category_id', data.category_id);
    formData.append('subCategory_id', data.subCategory_id);
    formData.append('mrp', data.mrp.toString());
    formData.append('offer_amount', data.offer_amount.toString());
    formData.append('tagline', data.tagline);
    formData.append('description', data.description);
    if(data.validity){
      formData.append('validity', data.validity);
      formData.append('duration', "");
    }else{
      formData.append('validity', "");
      formData.append('duration', data.duration);
    }

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(_serverUrl+addCategoryUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Package added successfully');
          this.reset();
          this.loadPackages();
        }

      } ,
      (err) => console.log(err)
    );
  }

  updatePackage(){
    let  addCategoryUrl="admin/packages/"+this.id;
    let data=this.uploadForm.value;
    const formData = new FormData();
    if( data.image){
      formData.append('image', data.image);
    }
    formData.append('name',data.name);
    formData.append('category_id', data.category_id);
    formData.append('subCategory_id', data.subCategory_id);

    formData.append('mrp', data.mrp);
    formData.append('offer_amount', data.offer_amount);
    formData.append('tagline', data.tagline);
    formData.append('description', data.description);
    if(data.validity){
      formData.append('validity', data.validity);
      formData.append('duration', "");
    }else{
      formData.append('validity', "");
      formData.append('duration', data.duration);
    }


    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put<any>(_serverUrl+addCategoryUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Category added successfully');
          this.reset();
          this.loadPackages();
        }

      } ,
      (err) => console.log(err)
    );
  }


  getCategories ()  {
    let  getAllCategoryUrl="admin/categories?";
    return this._http.get<any>(_serverUrl+getAllCategoryUrl).subscribe(
      (res) =>{
        let allCategories=res.data;
        this.subCategories = _.filter(allCategories, function (category) {
          return category.parent_id;
        });
        this.categories = _.filter(allCategories, function (category) {
          return !category.parent_id;
        });

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
    }
    reader.readAsDataURL(file);
  }

  getPackageById (id)  {
    let  getCategoryUrl="admin/packages/"+id;
    return this._http.get<any>(_serverUrl+getCategoryUrl).subscribe(
      (res) =>{
        this.mode="update";
        this.id=id;
        this.enablePackage=true;
        this.uploadForm.patchValue({
          name: res.data.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.uploadForm.patchValue({
          category_id: res.data.category_id
        });
        this.uploadForm.get('category_id').updateValueAndValidity();
        this.uploadForm.patchValue({
          category_id: res.data.category_id
        });
        this.uploadForm.get('category_id').updateValueAndValidity();
        this.uploadForm.patchValue({
          subCategory_id: res.data.subCategory_id
        });
        this.uploadForm.get('subCategory_id').updateValueAndValidity();
        if(res.data.validity){
          this.lifeTimeValidity=true;
          this.uploadForm.patchValue({
            validity: res.data.validity
          });
          this.uploadForm.get('validity').updateValueAndValidity();
          this.uploadForm.controls['duration'].disable();
        }else{
          this.uploadForm.patchValue({
            duration: res.data.duration
          });
          this.uploadForm.get('duration').updateValueAndValidity();
        }

        this.uploadForm.patchValue({
          mrp: res.data.mrp
        });
        this.uploadForm.get('mrp').updateValueAndValidity();
        this.uploadForm.patchValue({
          offer_amount: res.data.offer_amount
        });
        this.uploadForm.get('offer_amount').updateValueAndValidity();
        this.uploadForm.patchValue({
          tagline: res.data.tagline
        });
        this.uploadForm.get('tagline').updateValueAndValidity();
        this.uploadForm.patchValue({
          description: res.data.description
        });
        this.uploadForm.get('description').updateValueAndValidity();
        this.imageURL="http://34.93.43.250:3000/uploads/"+res.data.image;
        this.toastr.success('Package loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  removeCategory(id){
    let  deleteAllCategoryUrl="admin/packages/"+id;
    return this._http.delete<any>(_serverUrl+deleteAllCategoryUrl).subscribe(
      (res) =>{
        this.toastr.success('Package removed successfully.');
        this.loadPackages();
      } ,
      (err) => console.log(err)
    );

  }

  allowPackageForm(){
    this.enablePackage=true;
  }
  onValidityChange(event){
    console.log(event);
    if(event.checked){
      this.uploadForm.patchValue({
        validity: "lifetime"
      });
      this.uploadForm.get('validity').updateValueAndValidity();
      this.uploadForm.patchValue({
        duration: ""
      });
      this.uploadForm.get('duration').updateValueAndValidity();
      this.uploadForm.controls['duration'].disable();
    }else{
      this.uploadForm.patchValue({
        validity: ""
      });
      this.uploadForm.get('validity').updateValueAndValidity();
      this.uploadForm.controls['duration'].enable();
      this.lifeTimeValidity=false;
    }
  }



  reset() {
    this.uploadForm.reset();
    this.imageURL="";
    this.enablePackage=false;
    this.id="";
    this.id='';
    this.mode='create';
  }

}
