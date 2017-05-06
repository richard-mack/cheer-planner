import { Component, Input, OnInit } from '@angular/core';
import { Athlete } from './athlete';
import { Routine } from './routine';
import { DataService } from './data.service';


@Component({
	selector : 'display-component',
	providers : [DataService],
	template : `
		<floor-display [athletes]="athletes"></floor-display>
	`
})
export class DisplayComponent implements OnInit {
	constructor(private dataService: DataService) {}

	ngOnInit() : void {
		this.getData();
	}

	athletes : Athlete[];

	getData() : void {
		this.dataService.getRoutineData().then(routine => this.athletes = routine);
	}
}
