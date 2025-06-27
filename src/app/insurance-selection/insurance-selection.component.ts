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
  userId = Number(localStorage.getItem("userId"));
  selected = '';
  plans: any[] = [];
  error = '';
  success = '';

  constructor(private service: InsuranceService, private router: Router) {}

  ngOnInit() {
    this.service.getCoveragePlans().subscribe(data => this.plans = data);
  }

  // ✅ This method clears the error when a selection is made
  onSelectionChange() {
    if (this.selected) {
      this.error = '';
    }
  }

  submit() {
    if (!this.selected) {
      this.error = '⚠️ Please select a coverage type.';
      return;
    }

    this.service.submitInsurance(this.userId, this.selected).subscribe(() => {
      this.success = 'Insurance selected!';
      this.error = '';
      setTimeout(() => this.router.navigate(['/booking']), 2000);
    });
  }
}
