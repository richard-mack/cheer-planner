export class Component {
	offset : Number;
	description : string
}

export class Skill {
    id : string;
	name : string;
	category : string;
	accountID : string;
	description : string;
	components : Component[];
	lastModified : Date
};