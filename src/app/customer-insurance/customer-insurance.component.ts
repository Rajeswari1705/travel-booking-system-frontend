import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../services/insurance.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-customer-insurance',
  imports: [CommonModule],
  templateUrl: './customer-insurance.component.html',
  styleUrls: ['./customer-insurance.component.css']
})
export class CustomerInsuranceComponent implements OnInit {
  userId = Number(localStorage.getItem("userId"));
  insurances: any[] = [];

  constructor(private service: InsuranceService) {}

  ngOnInit() {
    this.service.getMyInsurances(this.userId).subscribe(res => {
      this.insurances = res;
    });
  }
}
