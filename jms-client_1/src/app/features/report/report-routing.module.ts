import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditReport } from 'src/app/shared/model/auditreport';
import { AuthGuard } from 'src/app/_helpers';
import { AuditreportComponent } from './auditreport/auditreport.component';

const routes: Routes = [
  { path: 'auditreport', component: AuditreportComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
