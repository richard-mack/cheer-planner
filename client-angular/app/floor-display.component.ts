import { Component, Input } from '@angular/core';
import { Athlete } from './athlete';

@Component({
	selector : 'floor-display',
	template: `
	<div>
		<label>Unused Athletes</label>
		<ul>
			<li *ngFor="let athlete of athletes" (click)="onAthleteClick(athlete)">{{athlete.id}}</li>
		</ul>
		<athlete-editor athlete="selectedAthlete"></athlete-editor>
	</div>
	`,
})
export class FloorDisplayComponent {
	routine: Routine;
	athletes = Athletes;
	selectedAthlete : Athlete;
	onAthleteClick(athlete : Athlete): void {
		this.selectedAthlete = athlete;
	}
}