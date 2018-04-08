import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Athlete } from './models/athlete';
import { Routine } from './models/routine';
import { RoutineSummary } from './models/routineSummary';
import { Skill } from './models/skill';
import { Account } from './models/account';

@Injectable()
export class DataService {
	constructor(private http: Http) { }

	createID(options : IDOptions) : string {
		let id = "";
		if (options && options.prefix)
			id = id.concat(options.prefix.slice(0,32));
		id = id.concat((new Date()).getTime().toString(36));
		while (id.length < 32) {
			id = id.concat(Math.floor(Math.random()*36).toString(36));
		}
		return id;
	}

	getRoutineSummaries() : Promise<RoutineSummary[]> {
		return this.http.get('api/Routine').toPromise().then(res => {return res.json();}); // MUSTDO : make this 
	}

	getRoutineData(id: string): Promise<Routine> {
		return this.http.get(`api/Routine/${id}`).toPromise().then(res => {
			let returnObj = res.json();
			// Instead of doing it this way, build the Routine/Athlete object with constructors.
			returnObj.routine.athletes = res.json().routine.athletes.map((athleteID : string) => {
				return res.json().athletes.find((athlete : Athlete) => athlete.id == athleteID);
			});
			return returnObj.routine;
		});	
	}

	saveRoutineData(routineData : Routine) : Promise<string> {
		let headers = new Headers({'Content-Type' : 'application/json'})
		// Start by normalizing the data somewhat
		let athletes = routineData.athletes;
		athletes.forEach(athlete => {
			if (!athlete.id)
				athlete.id = this.createID({prefix : 'A'});
			athlete.name = `${athlete.firstName} ${athlete.lastName}`;
			// Delete internal fields
			delete athlete._id;
			delete athlete.__v;
		})
		routineData.athletes = routineData.athletes.map(a => a.id);
		if (!routineData.id)
			routineData.id = this.createID({prefix : 'R'});
		delete routineData._id;
		delete routineData.__v;
		return this.http.post('/api/Athlete', {data : athletes}, headers).toPromise().then(response => {
			console.log(response);
			return this.http.post('api/Routine', {data : routineData}, headers).toPromise().then(response => {
				return response.toString();
			}).catch(err => {
				return err.toString();
			});
		}).catch(err => {
			return err.toString();
		})
	}

	getAccountConfig(): Promise<Object> {
		return this.http.get('api/Account').toPromise().then(res => {
			return res.json();
		})
	}

	saveAccountConfig(config : object) : Promise<boolean> {
		let headers = new Headers({'Content-Type' : 'application/json'})
		return this.http.post('api/Account', {config : config}, headers).toPromise().then(response => {
			return response.toString();
		}).catch(err => {
			return err.toString();
		});
	}
}

interface IDOptions {
	prefix? : string;
}