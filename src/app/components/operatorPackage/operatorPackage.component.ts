import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import * as _ from "underscore";
import {FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


const  _serverUrl = 'http://34.93.43.250:3000/';


@Component({
  selector: 'app-operatorPackage',
  templateUrl: './operatorPackage.component.html',
  styleUrls: ['./operatorPackage.component.css']
})

export class OperatorPackageComponent implements OnInit {

  uploadForm: FormGroup;
  displayedColumns: string[] = ['position', 'image', 'name', 'category','subCategory','duration','validity','mrp','offerAmount','actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  categories=[];
  subCategories=[];
  enablePackage:boolean;
  mode:string;
  id:"";
  sections:[];
  subjects:[];
  selectedSubjects:[];
  topics:[];
  selectedTopics:[];
  selectedYoutubeVideos:[];
  selectedServerVideos:[];
  videos:[];
  enableOtherSections:boolean;
  enableVideoSections:boolean;
  enableYoutubeSections:boolean;
  enableServerSections:boolean;


  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(public fb: FormBuilder,private _http: HttpClient,private toastr: ToastrService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      name: [''],
      section_id: [''],
      selectedSubject_id: [''],
      youtube:[''],
      server:['']
    });
  }

  ngOnInit() {
    this.getCategories();
    this.mode = 'create';
    this.enablePackage=false;
    this.loadPackages();
    this.dataSource.paginator = this.paginator;
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
    // if (this.mode === 'create') {
    //   this.createPackage();
    // } else {
    //   this.updatePackage();
    // }

  }

  loadSubjects ()  {
    let  getAllSubjectUrl="organiser/subjects?";
    return this._http.get<any>(_serverUrl+getAllSubjectUrl).subscribe(
      (res) =>{
        this.subjects = _.filter(res.data, function (subject) {
          return !subject.parent_id;
        });


      } ,
      (err) => console.log(err)
    );

  }

  getPackageById (id)  {
    let  getCategoryUrl="admin/packages/"+id;
    return this._http.get<any>(_serverUrl+getCategoryUrl).subscribe(
      (res) =>{
       let packageData=res.data;
        this.mode="update";
        this.id=id;
        this.enablePackage=true;
        this.uploadForm.controls['name'].disable();
        this.uploadForm.patchValue({
          name: res.data.name
        });
        this.uploadForm.get('name').updateValueAndValidity();
        this.sections=packageData.section;
        this.loadSubjects();
        this.loadVideos();
        this.toastr.success('Package loaded successfully.')
      } ,
      (err) => console.log(err)
    );

  }

  loadVideos ()  {
    let  getVideosUrl="videos/test";
    return this._http.get<any>(_serverUrl+getVideosUrl).subscribe(
      (res) =>{
        this.videos=res.data;
      } ,
      (err) => console.log(err)
    );

  }

  changeSubjects(event){
    this.selectedSubjects=event.value;
    this.topics=[];
    this.selectedTopics=[];
  }

  changeTopics(event){
    this.selectedTopics=event.value;
  }

  changeYoutubeVideos(event){
    this.selectedYoutubeVideos=event.value;
  }

  changeServerVideos(event){
    this.selectedServerVideos=event.value;
  }

  changeSection(event){
    let sectionId=event.value;
    let section=_.find(this.sections,function (section) {
      return section._id===sectionId;
    });
    if (section.name === 'All Videos') {
      this.enableVideoSections = true;
    } else {
      this.partialReset();
      this.enableVideoSections = false;
    }

  }

  onChangeYoutube(event){
    if(event.checked){
      this.enableYoutubeSections=true;
    }else{
      this.selectedYoutubeVideos=[];
      this.enableYoutubeSections=false;
    }


  }
  onChangeServer(event){
    if(event.checked){
      this.enableServerSections=true;
    }else{
      this.selectedYoutubeVideos=[];
      this.enableServerSections=false;
    }


  }


  loadTopics (subjectId)  {
    let  getAllTopicUrl="organiser/topics";
    return this._http.get<any>(_serverUrl+getAllTopicUrl).subscribe(
      (res) =>{
        this.topics = _.filter(res.data, function (topics) {
          return topics.subject_id===subjectId;
        });
      } ,
      (err) => console.log(err)
    );

  }


  allowPackageForm(){
    this.enablePackage=true;
  }

  linkSubjects(){
    let  linkSubjectToPackageUrl="organiser/packages/linkSubject";
    let data=this.uploadForm.value;
    let subjectIds=_.pluck(this.selectedSubjects,'_id');
    let payload={
      "packageId" : this.id,
      "sectionId" : data.section_id,
      "subjectIds" :subjectIds
    };
    return this._http.post<any>(_serverUrl+linkSubjectToPackageUrl,payload).subscribe(
      (res) =>{
        this.toastr.success('Link Subject successfully.');
        this.enableOtherSections=true;
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

  linkTopicAndOthers() {
    let formData = this.uploadForm.value;
    let toipics = [];
    _.each(this.selectedTopics, (topic) => {
      let topicData = {
        id: topic._id,
        videos: []
      };
      if (this.selectedYoutubeVideos.length > 0) {
        _.each(this.selectedYoutubeVideos, (video) => {
          let videoData = {
            'video_id': 'TahxTy',
            'video_type': 'server',
            'heading': video.heading,
            'tagline': video.tagline,
            'thumbnail': video.thumbnail
          };
          topicData.videos.push(videoData);

        });
      }
      if (this.selectedServerVideos.length > 0) {
        _.each(this.selectedServerVideos, (video) => {
          let videoData = {
            'video_id': 'TahxTy',
            'video_type': 'youtube',
            'heading': video.heading,
            'tagline': video.tagline,
            'thumbnail': video.thumbnail
          };
          topicData.videos.push(videoData);

        });
      }
      toipics.push(topicData);
    });

    let payload = {
      'packageId': this.id,
      'sectionId': formData.section_id,
      'subjectId': formData.selectedSubject_id,
      'topics': toipics
    };
    console.log(payload);
    let linkOthersToPackageUrl="organiser/packages/linkTopic";
    return this._http.post<any>(_serverUrl+linkOthersToPackageUrl,payload).subscribe(
      (res) =>{
        this.toastr.success('Link topic and video successfully.');
        this.partialReset();
      } ,
      (err) => console.log(err)
    );
  }


partialReset(){
  this.topics=[];
  this.selectedTopics=[];
  this.topics=[];
  this.selectedTopics=[];
  this.selectedYoutubeVideos=[];
  this.enableYoutubeSections=false;
  this.enableServerSections=false;
  this.selectedServerVideos=[];
  this.uploadForm.patchValue({
    selectedSubject_id:""
  });
  this.uploadForm.get('selectedSubject_id').updateValueAndValidity();
  this.uploadForm.patchValue({
    youtube:""
  });
  this.uploadForm.get('youtube').updateValueAndValidity();
  this.uploadForm.patchValue({
    server:""
  });
  this.uploadForm.get('server').updateValueAndValidity();
}
  reset() {
    this.uploadForm.reset();
    this.enablePackage=false;
    this.id='';
    this.mode='create';
  }

}
