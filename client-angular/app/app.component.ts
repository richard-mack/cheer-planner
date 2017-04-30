import { Component } from '@angular/core';

export class Routine {
	id: string;
    name: string;
    accountID : string;
    counts : object;
    athletes : [string];
    lastModified : Date;
    notes : [string];
    config : object;
};

export class Athlete {
	id : string;
    name : string;
	firstName : string;
	lastName : string;
	position : string;
	skills : [string];
	accountID : string;
	lastModified : Date;
}

@Component({
  selector: 'athlete-editor',
  template: `
  <div>
  	<label> Athlete Id: {{athlete.id}} </label> <br />
  	<input [(ngModel)]="athlete.firstName" placeholder="First Name"> <input [(ngModel)]="athlete.lastName" placeholder="Last Name">
  	<select [(ngModel)]="athlete.position">
  	<option value="Base">Base</option>
  	<option value="Crossover">Crossover</option>
  	<option value="Top">Top</option>
  	</select>
  </div>
  `,
})
export class AthleteEditorComponent  { 
	title = 'chrplnr';
	routine: Routine;
	athlete: Athlete = {
		id : '1',
		name : 'Richard Mack',
		firstName : 'Richard',
		lastName : 'Mack',
		position : 'Base',
		skills : ['Double Base'],
		accountID : 'default',
		lastModified : new Date()
	};
}
