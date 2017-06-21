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

	createID(options : object) : string {
		let id = "";
		if (options && options.prefix)
			id += options.prefix.slice(0,32);
		id += (new Date()).getTime().toString(36);
		while (id.length < 32) {
			id += Math.floor(Math.random*36).toString(36);
		}
		return id;
	}

	getRoutineSummaries() : Promise<RoutineSummary[]> {
		return this.http.get('api/Routine').toPromise().then(res => {return res.json();}); // MUSTDO : make this 
	}

	getRoutineData(id: string): Promise<Routine> {
		return this.http.get(`api/Routine/${id}`).toPromise().then(res => {
			let returnObj = res.json();
			returnObj.routine.athletes = res.json().routine.athletes.map((athleteID : string) => {
				return res.json().athletes.find((athlete : Athlete) => athlete.id == athleteID);
			});
			return returnObj.routine;
		});	
	}

	saveRoutineData(routineData : Routine) : Promise<string> {
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
		delete routineData._id;
		delete routineData.__v;
		return this.http.post('/api/Athlete', {data : athletes}, {'Content-Type' : 'application/json'}).toPromise().then(response => {
			console.log(response);
			return this.http.post('api/Routine', {data : routineData}, {'Content-Type' : 'application/json'}).toPromise();
		})
	}

	getAccountConfig(): Promise<Object> {
		return this.http.get('api/Account').toPromise().then(res => {
			return res.json();
		})
	}

	saveAccountConfig(config : object) : Promise<boolean> {
		return this.http.post('api/Account', {config : config}, { 'Content-Type' : 'application/json'}).toPromise();
	}
}