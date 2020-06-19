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
import {OperatorPackageComponent} from './components/operatorPackage/operatorPackage.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/category', component: CategoryComponent },
  { path: 'admin/subcategory', component: SubCategoryComponent },
  { path: 'admin/package', component: PackageComponent },
  { path: 'operator/dashboard', component: OperatorDashboardComponent },
  { path: 'operator/subject', component: SubjectComponent },
  { path: 'operator/topic', component: TopicComponent },
  { path: 'operator/package', component: OperatorPackageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
