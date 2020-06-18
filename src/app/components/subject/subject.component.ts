import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
const  _serverUrl = 'http://34.93.43.250:3000/';


let Subjects= [];

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})


export class SubjectComponent implements OnInit {
  displayedColumns: string[] = ['position','image', 'name', 'actions'];
  dataSource = new MatTableDataSource(Subjects);
  imageURL: string;
  enableSubject:boolean;
  mode:string;
  id:"";

  uploadForm: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      image: [null],
      name: ['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.enableSubject=false;
    this.loadSubjects();
    this.mode='create';

  }

  loadSubjects ()  {
      let  getAllSubjectUrl="organiser/subjects?";
      return this._http.get<any>(_serverUrl+getAllSubjectUrl).subscribe(
        (res) =>{
          let subjects = _.filter(res.data, function (subject) {
            return !subject.parent_id;
          });

          subjects= _.map(subjects,function (subject,index) {
            subject.position=(index+1);
            subject.imagePath="http://34.93.43.250:3000/uploads/"+subject.image;
            return subject;
          });
          this.dataSource =new MatTableDataSource(subjects);
          this.dataSource.paginator = this.paginator;
          this.toastr.success('subjects loaded successfully.')

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


  allowSubjectForm(){
    this.enableSubject=true;

  }

  // Submit Form
  submit() {
    if (this.mode === 'create') {
      this.createSubject();
    } else {
      this.updateSubject();
    }

  }
  createSubject(){
    let  addSubjectUrl="organiser/subjects";
    let data=this.uploadForm.value;
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name',data.name);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(_serverUrl+addSubjectUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Subject added successfully');
          this.reset();
          this.loadSubjects();
        }

      } ,
      (err) => console.log(err)
    );
  }

  updateSubject(){
    let  addSubjectUrl="organiser/subjects/"+this.id;
    let data=this.uploadForm.value;
    const formData = new FormData();
    if( data.image){
      formData.append('image', data.image);
    }
    formData.append('name',data.name);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put<any>(_serverUrl+addSubjectUrl, formData,{headers:headers}).subscribe(
      (res) =>{
        if (res.message === 'Something went wrong') {
          this.toastr.error('Something went wrong.')
        } else {
          this.toastr.success('Subject added successfully');
          this.reset();
          this.loadSubjects();
        }

      } ,
      (err) => console.log(err)
    );
  }

  getSubjectById (id)  {
    let  getSubjectUrl="organiser/subjects/"+id;
    return this._http.get<any>(_serverUrl+getSubjectUrl).subscribe(
      (res) =>{
        this.mode="update";
        this.id=id;
        this.enableSubject=true;
        this.uploadForm.patchValue({
          name: res.data.name
        });
        this.uploadForm.get('name').updateValueAndValidity();

        this.imageURL="http://34.93.43.250:3000/uploads/"+res.data.image;
        this.toastr.success('subject loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  removeSubject(id){
    let  deleteAllSubjectUrl="organiser/subjects/"+id;
    return this._http.delete<any>(_serverUrl+deleteAllSubjectUrl).subscribe(
      (res) =>{
        this.toastr.success('subject removed successfully.');
      this.loadSubjects();
      } ,
      (err) => console.log(err)
    );

  }

  reset() {
    this.uploadForm.reset();
    this.imageURL="";
    this.enableSubject=false;
    this.mode='create';
  }

}
