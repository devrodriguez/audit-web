import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  closed = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.closed = true;
    }, 5000);
  }

}
