import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { CategoryService } from "./../../categories/shared/category.service";
import { Category } from "./../../categories/shared/category.model";

import { EntryService } from "../../entries/shared/entry.service";
import { Entry } from "../../entries/shared/entry.model";

import currencyFormatter from "currency-formatter";
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  months = [
    { month: "janeiro", value: 1 },
    { month: "fevereiro", value: 2 },
    { month: "março", value: 3 },
    { month: "abril", value: 4 },
    { month: "maio", value: 5 },
    { month: "junho", value: 6 },
    { month: "julio", value: 7 },
    { month: "agosto", value: 8 },
    { month: "setembro", value: 9 },
    { month: "outubro", value: 10 },
    { month: "novembro", value: 11 },
    { month: "dezembro", value: 12 },
  ];

  years = [
    { year: 2016 },
    { year: 2017 },
    { year: 2018 },
    { year: 2019 },
    { year: 2020 },
    { year: 2021 },
    { year: 2022 },
  ];

  expanseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild("month") month: ElementRef = null;
  @ViewChild("year") year: ElementRef = null;

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) {}

  ngOnInit() {
    this.categoryService
      .getAll()
      .subscribe((category) => (this.categories = category));
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert("È necessario selecionar o ano e o mês");
    } else {
      this.entryService
        .getByMonthAndYear(month, year)
        .subscribe((entries) => this.setValues(entries));
    }
  }

  setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expanseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach((entry) => {
      if (entry.type === "revenue")
        revenueTotal += currencyFormatter.unformat(entry.amount, {
          code: "BRL",
        });
      else
        expanseTotal += currencyFormatter.unformat(entry.amount, {
          code: "BRL",
        });
    });

    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: "BRL" });
    this.expanseTotal = currencyFormatter.format(expanseTotal, { code: "BRL" });
    this.balance = currencyFormatter.format(revenueTotal - expanseTotal, {
      code: "BRL",
    });
  }

  private setChartData() {
    this.revenueChartData = this.getChartData(
      "revenue",
      "Gráfico de Receitas",
      "#9CCC65"
    );
    this.expenseChartData = this.getChartData(
      "expense",
      "Gráfico de Despesas",
      "#ff5565"
    );
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];

    this.categories.forEach((category) => {
      const filteredEntries = this.entries.filter((entry) => {
        return entry.categoryId === category.id && entry.type === entryType;
      });

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) => {
          return (
            total + currencyFormatter.unformat(entry.amount, { code: "BRL" })
          );
        }, 0);
        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount,
        });
      }
    });

    return {
      labels: chartData.map((item) => item.categoryName),
      datasets: [
        {
          label: title,
          backgroundColor: color,
          data: chartData.map((item) => item.totalAmount),
        },
      ],
    };
  }
}
