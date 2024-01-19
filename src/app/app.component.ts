import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { CountryModalComponent } from './country-modal/country-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  countries: any[] = [];
  paginatedCountries: any[] = [];
  currentPage = 1;
  rowsPerPage = 25;
  searchInput = '';
  sortOrder = 'asc';
  selectedCountry: any;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('https://restcountries.com/v3.1/all').subscribe((data: any) => {
      this.countries = data;
      this.paginateCountries();
    });
  }

  paginateCountries(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedCountries = this.countries.slice(startIndex, endIndex);
  }

  searchCountries(): void {
    const searchLowerCase = this.searchInput.toLowerCase();
  
    this.paginatedCountries = this.countries
      .filter((country: any) => country.name.official.toLowerCase().includes(searchLowerCase))
      .slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
  }
  sortCountries(): void {
    this.paginateCountries(); // Reset pagination
    this.paginatedCountries.sort((a, b) => {
      const nameA = a.name.official.toLowerCase();
      const nameB = b.name.official.toLowerCase();
      return (this.sortOrder === 'asc') ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  get totalPages(): number {
    return Math.ceil(this.countries.length / this.rowsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateCountries();
    }
  }

  openCountryModal(country: any): void {
    const dialogRef = this.dialog.open(CountryModalComponent, {
      width: '50%', // Adjust the width based on your design
      data: country // Pass the country data to the modal component
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
