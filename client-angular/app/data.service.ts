import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Athlete } from './athlete';
import { Routine } from './routine';
import { Skill } from './skill';


const Athletes: Athlete[] = [
{
		id : '1',
		name : 'Richard Mack',
		firstName : 'Richard',
		lastName : 'Mack',
		position : 'Base',
		skills : [{id : '1', name : 'Double Base', category : 'test', accountID : 'default', description: 'a', components : null, lastModified : new Date()}],
		accountID : 'default',
		lastModified : new Date()
	},
	{
		id : '2',
		name : 'Tina Lee',
		firstName : 'Tina',
		lastName : 'Lee',
		position : 'Top',
		skills : [{id : '1', name : 'Double Base', category : 'test', accountID : 'default', description: 'a', components : null, lastModified : new Date()}],
		accountID : 'default',
		lastModified : new Date()
	},
	{
		id : '3',
		name : 'Emily Dufton',
		firstName : 'Emily',
		lastName : 'Dufton',
		position : 'Crossover',
		skills : [{id : '1', name : 'Double Base', category : 'test', accountID : 'default', description: 'a', components : null, lastModified : new Date()}],
		accountID : 'default',
		lastModified : new Date()
	}
]

@Injectable()
export class DataService {
	constructor(private http: Http) { }

	getRoutines() : Promise<string[]> {
		return this.http.get('api/routine').toPromise().then(res => [res.toString()]); // MUSTDO : make this 
	}

	getRoutineData(): Promise<Athlete[]> {
		return this.http.get('api/routine').toPromise().then(res => {
			console.log(res);
			return Promise.resolve(Athletes);
		}
			);
	}
}