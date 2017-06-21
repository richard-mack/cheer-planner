import { Component, Input } from '@angular/core';


@Component({
	selector : 'cpApp',
	template : `
		<router-outlet></router-outlet>
	`
})
export class AppComponent {
	title = 'Cheer Planner v0.2';
}
