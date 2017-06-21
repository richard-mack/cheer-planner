import { Skill } from './skill';

export class Athlete {
	id : string;
    name : string;
	firstName : string;
	lastName : string;
	position : string;
	skills : Skill[];
	accountID : string;
	lastModified : Date;
}