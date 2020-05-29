import { Component, OnInit } from '@angular/core';
import { AuditorService } from 'src/app/services/auditor.service';

@Component({
  selector: 'app-create-audit',
  templateUrl: './create-audit.component.html',
  styleUrls: ['./create-audit.component.sass']
})
export class CreateAuditComponent implements OnInit {

  closed = false;
  auditorsList: any = [];

  constructor(private auditorSrv: AuditorService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.closed = true;
    }, 5000);

    // Get auditors list
    this.GetAuditors();
  }

  GetAuditors() {
    this.auditorSrv.GetAuditors().subscribe(res => {
      this.auditorsList = res;
    }, err => {
      console.log(err);
    });
  }

}
