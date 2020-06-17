import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryComponent } from './components/category/category.component';
import { SubCategoryComponent } from './components/subcategory/subcategory.component';
import { PackageComponent } from './components/package/package.component';
import {OperatorDashboardComponent} from './components/operatordashboard/operatordashboard.component';
import {SubjectComponent} from './components/subject/subject.component';
import {TopicComponent} from './components/topic/topic.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'subcategory', component: SubCategoryComponent },
  { path: 'package', component: PackageComponent },
  { path: 'operatordashboard', component: OperatorDashboardComponent },
  { path: 'subject', component: SubjectComponent },
  { path: 'topic', component: TopicComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
