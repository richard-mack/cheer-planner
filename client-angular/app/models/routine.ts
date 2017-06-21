import { BaseModel } from './baseModel';
import { Athlete } from './athlete';


export class Routine extends BaseModel {
    name: string;
    accountID : string;
    counts : object;	
    athletes : Athlete[];
    lastModified : Date;
    notes : [string];
    config : object;

   constructor(name : string) {
   	super('R');
   	this.name = name;
   } 
};