import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule }	 from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { DataService } from './data.service';
import { DragService } from './dragdrop.service';

import { AppComponent } from './app.component';
import { AthleteEditorComponent }  from './athlete-editor.component';
import { ModalComponent } from './modal.component';
import { FloorDisplayComponent } from './floor-display.component';
import { DisplayComponent } from './display.component';
import { RoutineListComponent } from './routine-list.component';
import { LoginComponent } from './login.component';
import { ConfigComponent } from './config.component';
import { HeaderComponent } from './header.component';
import { NumericInputComponent } from './numeric-input.component';
import { NoteDisplayComponent } from './note-display.component';
import { PageNotFoundComponent } from './not-found.component';

import { DraggableDirective, DropTargetDirective } from './dragdrop.directive';



@NgModule({
  imports: [ 
  	BrowserModule, 
  	FormsModule,
  	HttpModule,
  	AppRoutingModule
  ],
  providers : [
    AuthService,
    AuthGuard,
    DataService,
    DragService
  ],
  declarations: [ 
    AthleteEditorComponent, 
    ModalComponent, 
    FloorDisplayComponent, 
    AppComponent, 
    DisplayComponent, 
    RoutineListComponent, 
    LoginComponent, 
    ConfigComponent, 
    HeaderComponent,
    NumericInputComponent,
    NoteDisplayComponent,
    PageNotFoundComponent,
    DraggableDirective,
    DropTargetDirective
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
