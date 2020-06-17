import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operatordashboard',
  templateUrl: './operatordashboard.component.html',
  styleUrls: ['./operatordashboard.component.css']
})

export class OperatorDashboardComponent implements OnInit {

  // Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(private _router:Router) { }

  ngOnInit() {
  }

  onClickSubject(){
    this._router.navigate(['/subject']);
  }

  onClickTopic(){
    this._router.navigate(['/topic']);
  }
}
