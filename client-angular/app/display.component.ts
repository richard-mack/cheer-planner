import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Athlete } from './models/athlete';
import { Routine } from './models/routine';
import { RoutineSummary } from './models/routineSummary';

import { DataService } from './data.service';
import { AuthService } from './auth.service';


@Component({
	selector : 'display-component',
	template : `
		<header></header>
		<div style="position: absolute; height: 95%; width:100%; top:5%;">
			<floor-display *ngIf="routine && config && config.matDisplay && config.matDisplay.enabled" [routine]="routine" [currentCountNumber]="currentCountNumber" [config]="config.matDisplay"></floor-display>
			<numeric-input *ngIf="routine && config && config.numericInput && config.numericInput.enabled" [(currentCountNumber)]="currentCountNumber" [config]="config.numericInput"></numeric-input>
			<note-display *ngIf="routine && routine.notes && config && config.noteDisplay && config.noteDisplay.enabled" [(countNote)]="routine.notes[currentCountNumber]" [config]="config.noteDisplay"></note-display>
			<button
			*ngIf="routine && config && config.saveButton"
			(click)="onSaveClick()"
			[ngStyle]="{
				'position' : 'absolute',
				'left' : config.saveButton.left + 'px',
				'top' : config.saveButton.top + 'px',
				'height' : config.saveButton.height + 'px',
				'width' : config.saveButton.width + 'px'
			}"
			> Save </button>
		</div>
	`
})
export class DisplayComponent implements OnInit {
	constructor(private dataService: DataService, private authService : AuthService, route: ActivatedRoute) {
		this.routineID = route.snapshot.params['id'];
	}

	ngOnInit() : void {
		this.getData();
	}

	routineID : string;

	routine : Routine;
	config : object;
	currentCountNumber : number = 1;

	getData() : void {
		this.dataService.getRoutineData(this.routineID).then(routine => this.routine = routine);
		this.dataService.getAccountConfig().then(config => {
			console.log(config); this.config = config;
		});
	}

	onSaveClick() : void {
		this.dataService.saveRoutineData(this.routine)//.then(response => console.log(response));
	}
}
