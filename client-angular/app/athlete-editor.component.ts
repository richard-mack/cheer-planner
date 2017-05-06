import { Component, Input } from '@angular/core';
import { Athlete } from './athlete';

@Component({
  selector: 'athlete-editor',
  template: `
  <div cpModal *ngIf="athlete">
  	<label> Athlete Id: {{athlete.id}} </label> <br />
  	<input [(ngModel)]="athlete.firstName" placeholder="First Name"> <input [(ngModel)]="athlete.lastName" placeholder="Last Name">
  	<select [(ngModel)]="athlete.position">
  	<option value="Base">Base</option>
  	<option value="Crossover">Crossover</option>
  	<option value="Top">Top</option>
  	</select>
    <button (click)="onSaveClick()">Save</button>
  </div>
  `,
})
export class AthleteEditorComponent  { 
	title = 'chrplnr';
	@Input() athlete: Athlete; 
  onSaveClick() : void {
    console.log(this.athlete);
    this.athlete = null;
  }
}