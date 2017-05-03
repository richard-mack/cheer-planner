import { Component, Input } from '@angular/core';
import { Athlete } from './athlete';
import { Routine } from './routine';

const Athletes: Athlete[] = [
{
		id : '1',
		name : 'Richard Mack',
		firstName : 'Richard',
		lastName : 'Mack',
		position : 'Base',
		skills : ['Double Base'],
		accountID : 'default',
		lastModified : new Date()
	},
	{
		id : '2',
		name : 'Tina Lee',
		firstName : 'Tina',
		lastName : 'Lee',
		position : 'Top',
		skills : ['Double Base'],
		accountID : 'default',
		lastModified : new Date()
	},
	{
		id : '3',
		name : 'Emily Dufton',
		firstName : 'Emily',
		lastName : 'Dufton',
		position : 'Crossover',
		skills : ['Double Base'],
		accountID : 'default',
		lastModified : new Date()
	}
]

@Component({
	selector : 'cpApp',
	template : `
		<floor-display></floor-display>
	`
})
export class AppComponent {

}
