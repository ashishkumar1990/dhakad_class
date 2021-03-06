import { BrowserModule } from '@angular/platform-browser';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


/* Angular Flex Layout */
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { ToastrModule } from 'ngx-toastr';



/* Components */
import { LogInComponent } from './components/log-in/log-in.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {CategoryComponent} from './components/category/category.component';
import {SubCategoryComponent} from './components/subcategory/subcategory.component';
import {PackageComponent} from './components/package/package.component';
import {OperatorDashboardComponent} from './components/operatordashboard/operatordashboard.component';
import {SubjectComponent} from './components/subject/subject.component';
import {TopicComponent} from  './components/topic/topic.component';
import {OperatorPackageComponent} from  './components/operatorPackage/operatorPackage.component';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    DashboardComponent,
    CategoryComponent,
    SubCategoryComponent,
    PackageComponent,
    OperatorDashboardComponent,
    SubjectComponent,
    TopicComponent,
    OperatorPackageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    ColorPickerModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
