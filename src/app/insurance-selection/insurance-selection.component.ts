import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../services/insurance.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-insurance-selection',
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance-selection.component.html',
  styleUrls: ['./insurance-selection.component.css']
})
export class InsuranceSelectionComponent implements OnInit {
  userId = Number(localStorage.getItem("userId") || 0);
  selected = '';
  plans: any[] = [];
  error = '';
  success = '';

  constructor(private service: InsuranceService, private router: Router, private location:Location) {}

  ngOnInit() {
    this.service.getCoveragePlans().subscribe(data => this.plans = data);
  }

  onSelectionChange() {
    if (this.selected) {
      this.error = '';
    }
  }

  submit() {
    if (!this.selected) {
      this.error = '⚠️ Please select a coverage type.';
      this.success = '';
      return;
    }

    this.service.getMyInsurances(this.userId).subscribe(existingInsurances => {
      const pendingInsurance = existingInsurances.find(
        insurance => insurance.bookingId === null
      );

      if (pendingInsurance) {
        this.error = `⚠️ Insurance already selected with Insurance ID: ${pendingInsurance.insuranceId}. Please complete your booking.`;
        this.success = '';
      } else {
        this.service.submitInsurance(this.userId, this.selected).subscribe(newInsurance => {
          this.success = `✅ Insurance selected successfully with Insurance ID: ${newInsurance.insuranceId}!`;
          this.error = '';
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
