import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../services/insurance.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
 
  constructor(private service: InsuranceService, private router: Router) {}
 
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
 
    // Step 1: Fetch all insurance records for user
    this.service.getMyInsurances(this.userId).subscribe(existingInsurances => {
      const hasPending = existingInsurances.some(
        insurance => insurance.bookingId === null
      );
 
      // Step 2: Block if pending exists
      if (hasPending) {
        this.error = '⚠️ Insurance already selected. Please complete your booking.';
        this.success = '';
      } else {
        // Step 3: Submit new insurance
        console.log("sending data:",{
          useId:this.userId,
          coverageType:this.selected
        });
        this.service.submitInsurance(this.userId, this.selected).subscribe(() => {
          this.success = '✅ Insurance selected successfully!';
          this.error = '';
          setTimeout(() => this.router.navigate(['/booking']), 2000);
        });
      }
    });
  }  
}
 