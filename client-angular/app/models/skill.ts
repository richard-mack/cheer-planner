export class Component {
	offset : number;
	description : string
}

export class Skill {
	constructor(skillObj : object) {
		for (property of Object.keys(this)) {
			try {
				switch (property) {
					case 'lastModified': {
						this.lastModified = new Date(skillObj.lastModified);
						break;
					}
					case 'components' : {
						this.components = skillObj.components.map(component => new Component(component));
						break;
					}
					default : {
						this['property'] = skillObj['property'];
						break;
					}
				}
			} catch (err) {
				console.log(`Failed to assign ${property} of Skill. Error: ${err}`);
			}
		}
	}

    id : string;
	name : string;
	category : string;
	accountID : string;
	description : string;
	components : Component[];
	lastModified : Date
};