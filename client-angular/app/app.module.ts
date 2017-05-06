import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule }	 from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AthleteEditorComponent }  from './athlete-editor.component';
import { ModalComponent } from './modal.component';
import { FloorDisplayComponent } from './floor-display.component';
import { DisplayComponent } from './display.component';

@NgModule({
  imports: [ 
  	BrowserModule, 
  	FormsModule,
  	HttpModule,
  	RouterModule.forRoot([
  	{
  		path : 'routine',
  		component : DisplayComponent
  	}

  		])
  ],
  declarations: [ AthleteEditorComponent, ModalComponent, FloorDisplayComponent, AppComponent, DisplayComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
