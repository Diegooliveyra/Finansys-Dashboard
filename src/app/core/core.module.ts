import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import {InMemoryDatabase} from '../in-memory-database';
import { NavBarComponent } from './components/nav-bar/nav-bar.component'


@NgModule({
  declarations: [NavBarComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavBarComponent,
  ]
})
export class CoreModule { }
