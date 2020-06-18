import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as _ from 'underscore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


const  _serverUrl = 'http://34.93.43.250:3000/';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})

export class TopicComponent implements OnInit {

  displayedColumns: string[] = ['position','name', 'subject', 'actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  subjects=[];
  uploadForm: FormGroup;
  enableTopic:boolean;
  mode:string;
  id:string;

  // Roles: any = ['Admin', 'Author', 'Reader'];
  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      name: [''],
      subject_id:['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.enableTopic=false;
    this.getSubjects();
    this.loadTopics();
    this.mode='create';
  }

  loadTopics ()  {
    let  getAllTopicUrl="organiser/topics";
    return this._http.get<any>(_serverUrl+getAllTopicUrl).subscribe(
      (res) =>{
        let topics = _.filter(res.data, function (subject) {
          return subject.subject_id;
        });
        let allSubjects=this.subjects;
        topics= _.map(topics,function (topic,index) {
         let subjectData= _.find(allSubjects ,function (subject) {
            return subject._id===topic.subject_id;
          });
          topic.subjectName='';
         if(subjectData){
           topic.subjectName=subjectData.name;
         }
          topic.position=(index+1);
          return topic;
        });
        this.dataSource =new MatTableDataSource(topics);
        this.dataSource.paginator = this.paginator;
        this.toastr.success('topics loaded successfully.')

      } ,
      (err) => console.log(err)
    );

  }

  getSubjects ()  {
    let  getAllSubjectUrl="organiser/subjects?";
    return this._http.get<any>(_serverUrl+getAllSubjectUrl).subscribe(
      (res) =>{
        this.subjects = _.filter(res.data, function (subject) {
          return !subject.subject_id;
        });
      } ,
      (err) => console.log(err)
    );

  }

  allowTopicForm(){
    this.enableTopic=true;
  }


  submit() {
    console.log(this.uploadForm.value);
    let  addTopicUrl=this.mode==='update'?"organiser/topics/"+this.id:"organiser/topics";
    const formData = new FormData();
    let data={'name':this.uploadForm.value.name,"subject_id":this.uploadForm.value.subject_id};

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    if(this.mode==='update'){
      return this._http.put<any>(_serverUrl+addTopicUrl, data,{headers:headers}).subscribe(
        (res) =>{
          if (res.message === 'Something went wrong') {
            this.toastr.error('Something went wrong.')
          } else {
            this.toastr.success('Topic updated successfully');
            this.reset();
            this.loadTopics();
            this.enableTopic=false;
          }

        } ,
        (err) => console.log(err)
      );
    }else{
      return this._http.post<any>(_serverUrl+addTopicUrl, data,{headers:headers}).subscribe(
        (res) =>{
          if (res.message === 'Something went wrong') {
            this.toastr.error('Something went wrong.')
          } else {
            this.toastr.success('Topic added successfully');
            this.loadTopics();
            this.reset();
            this.enableTopic=false;
          }

        } ,
        (err) => console.log(err)
      );
    }

  }

  getTopicById (id)  {
    let  getTopicUrl="organiser/topics/"+id;
    return this._http.get<any>(_serverUrl+getTopicUrl).subscribe(
      (res) =>{
        this.mode='update';
        this.id=id;
       let  topicData= res.data;
        this.enableTopic=true;
        this.uploadForm.patchValue({
          name: topicData.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.uploadForm.patchValue({
          subject_id: topicData.subject_id
        });
        this.uploadForm.get('subject_id').updateValueAndValidity();
        this.toastr.success('topic loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  removeTopic(id){
    let  deleteAllTopicUrl="organiser/topics/"+id;
    return this._http.delete<any>(_serverUrl+deleteAllTopicUrl).subscribe(
      (res) =>{
        this.toastr.success('topic removed successfully.');
        this.loadTopics();
      } ,
      (err) => console.log(err)
    );

  }
  reset() {
    this.uploadForm.reset();
    this.enableTopic=false;
    this.mode='create';
    this.id="";
  }
}
