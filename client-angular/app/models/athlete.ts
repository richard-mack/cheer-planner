import { Skill } from './skill';

export class Athlete {
	constructor(athleteObject : object) {
		for (let property in athleteObject) {
			this[property] = athleteObject[property];
		}
	}
	id : string;
    name : string;
	firstName : string;
	lastName : string;
	position : string;
	skills : Skill[];
	accountID : string;
	lastModified : Date;
}