import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../insurance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-customer-help',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-help.component.html',
  styleUrls: ['./customer-help.component.css']
})
export class CustomerHelpComponent implements OnInit {
  userId = Number(localStorage.getItem("userId") || 0);
  queries: any[] = [];
  newQuery = '';
  showMessage = '';
  hasTyped = false;

  constructor(private service: InsuranceService) {}

  ngOnInit() {
    this.loadQueries();
  }

  loadQueries() {
    this.service.getAssistanceQueries(this.userId).subscribe({
      next: (res) => this.queries = res,
      error: (err) => {
        console.error('Error loading queries:', err);
        this.showMessage = '❌ Failed to load queries.';
      }
    });
  }

  onInputChange() {
    this.hasTyped = true;
    const trimmedQuery = this.newQuery.trim();
    if (trimmedQuery.length < 30) {
      this.showMessage = '⚠️ Please describe your issue in at least 30 characters.';
    } else {
      this.showMessage = '';
    }
  }

  submitQuery() {
    const trimmedQuery = this.newQuery.trim();
    if (trimmedQuery.length < 30) {
      this.showMessage = '⚠️ Please describe your issue in at least 30 characters.';
      return;
    }

    console.log('Submitting query:', { userId: this.userId, issue: trimmedQuery });

    this.service.addQuery(this.userId, trimmedQuery).subscribe({
      next: () => {
        this.showMessage = '✅ Query submitted!';
        this.newQuery = '';
        this.hasTyped = false;
        this.loadQueries();
      },
      error: (err) => {
        console.error('Submission error:', err);
        this.showMessage = '❌ Failed to submit query. Please try again.';
      }
    });
  }
}
