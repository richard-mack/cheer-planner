import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule }	 from '@angular/http';

import { AppComponent } from './app.component';
import { AthleteEditorComponent }  from './athlete-editor.component';
import { ModalComponent } from './modal.component';
import { FloorDisplayComponent } from './floor-display.component';

@NgModule({
  imports: [ 
  	BrowserModule, 
  	FormsModule,
  	HttpModule
  ],
  declarations: [ AthleteEditorComponent, ModalComponent, FloorDisplayComponent, AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
