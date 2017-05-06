import { Component, Input } from '@angular/core';


@Component({
	selector : 'cpApp',
	template : `
		<a routerLink="/routine">Routine</a>
		<router-outlet></router-outlet>
	`
})
export class AppComponent {
	title = 'Cheer Planner v0.2';
	onClickRoutine() : void {
	}
}
