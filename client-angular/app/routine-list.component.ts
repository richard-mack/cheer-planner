import { Component, OnInit } from '@angular/core';
import { RoutineSummary } from './models/routineSummary';
import { DataService } from './data.service';


@Component({
	selector : 'routine-list',
	providers : [DataService],
	template : `
		<header></header>
		<div style="position: absolute; top : 5%;">
			<button (click)="handleClick()">asdf</button>
			<a *ngFor="let routine of routines" routerLink="/routine/{{routine.id}}">{{routine.name}}</a>
		</div>
	`
})
export class RoutineListComponent implements OnInit {
	constructor(private dataService: DataService) {}

	ngOnInit() : void {
		this.getData();
	}

	routines : RoutineSummary[];

	getData() : void {
		this.dataService.getRoutineSummaries().then(routine => this.routines = routine);
	}

	handleClick() : void {
		this.dataService.getAccountConfig().then(res => console.log(res));
	}

}
