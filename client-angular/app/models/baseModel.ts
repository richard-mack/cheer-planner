import { Http } from '@angular/http';

export class BaseModel {
	id : string;

	constructor (prefix? : string) {
		this.id = "";
		if (prefix) {
			this.id += prefix.slice(0,32)
		}
    	this.id += (new Date()).getTime().toString(36);
    	while (this.id.length < 32) {
      		this.id += Math.floor(Math.random()*36).toString(36);
    	}
	}
}