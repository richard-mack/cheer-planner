import { Skill } from './skill';

export class Athlete {
	constructor(athleteObject : object) {
		for (let property of Object.keys(this)) {
			try { 
				switch (property) {
					case 'skills': {
						this.skills = athleteObject.skills.map(skill => new Skill(skill));
						break;
					}
					case 'lastModified': {
						this.lastModified = new Date(athleteObject.lastModified);
						break;
					}
					default: {
						this[property] = athleteObject[property];
						break;
					}
				}
			} catch (err) {
				console.log(`Failed to assign ${property} of Athlete. Error: ${err}`);
			}
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