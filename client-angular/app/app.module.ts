import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule }	 from '@angular/http';

import { AthleteEditorComponent }  from './app.component';


@NgModule({
  imports: [ 
  	BrowserModule, 
  	FormsModule,
  	HttpModule
  ],
  declarations: [ AthleteEditorComponent ],
  bootstrap:    [ AthleteEditorComponent ]
})
export class AppModule { }
