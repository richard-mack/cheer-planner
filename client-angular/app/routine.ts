import { Athlete } from './athlete';

export class Routine {
	id: string;
    name: string;
    accountID : string;
    counts : object;	
    athletes : Athlete[];
    lastModified : Date;
    notes : [string];
    config : object;
};