import { Component, OnInit,ViewChild  } from '@angular/core';
import { Router } from '@angular/router'
import {Login} from './log-in';
// import {ToastrService} from 'ngx-toastr';
// import {MessageService} from 'primeng/api';
import {NgForm}from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  login: Login = {
    "userName": "",
    "password": ""
  };
  // loading:string="";
  loginForm: NgForm;
  // @ViewChild('loginForm') currentForm: NgForm;
  constructor(private _router:Router) { }

  ngOnInit() {
  }


  userLogin() {
    if(this.login.userName==="admin"  && this.login.password ==='admin'){
      this._router.navigate(['/dashboard']);
    }
    // console.log("hi");
  }
}
