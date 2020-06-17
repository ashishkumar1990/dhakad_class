import { Component, OnInit,ViewChild  } from '@angular/core';
import { Router } from '@angular/router'
import {Login} from './log-in';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private _router:Router, private toastr: ToastrService) { }

  ngOnInit() {
  }


  userLogin() {
    let userName=(this.login.userName.trim()).toLocaleLowerCase();
    let password=(this.login.password.trim()).toLocaleLowerCase();
    if(userName==="admin"  && password ==='admin'){
      this._router.navigate(['admin/dashboard']);
      this.toastr.success("Login Successfully as "+this.login.userName);
    }
    if(userName==="operator"  && password ==='operator'){
      this._router.navigate(['/operator/dashboard']);
      this.toastr.success("Login Successfully as "+this.login.userName);
    }else{
      this.toastr.error("Invalid Credentials");
    }
  }

}
