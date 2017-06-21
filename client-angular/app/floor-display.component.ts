import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Athlete } from './models/athlete';
import { Routine } from './models/routine';

// MUSTDO: Implement account level configurations

@Component({
	selector : 'floor-display',
	templateUrl: './floor-display.component.html',
})
export class FloorDisplayComponent implements OnInit {
	// Input Data
	@Input() routine: Routine;
	@Input() currentCountNumber: number;
	@Input() config : object;

	ngOnInit() : void {
		this.computeAthletePositions();
	}

	ngOnChanges(changes : SimpleChanges) {
		this.computeAthletePositions();
	}

	// Properties
	selectedAthlete : Athlete;
	athletePositions : object[] = [];

	// Methods
	onAthleteClick(athleteID : string): void {
		this.selectedAthlete = this.routine.athletes.find(athlete => athleteID == athlete.id);
	}

	computeAthletePositions() : void {
		let unusedCount = 0;
		this.athletePositions = [];

		for (let athlete of this.routine.athletes) {
			let lastKnownCount = this.lastKnownCount(athlete.id);
			if (lastKnownCount) {
				lastKnownCount['athleteName'] = athlete.firstName;
				this.athletePositions.push(lastKnownCount);
			}
			else {
				this.athletePositions.push({
					athleteID : athlete.id,
					athleteName : athlete.firstName,
					note : "Unused",
					posx : ((this.config['width']) - 115)/(this.config['matWidth']*9),
					posy : (15*(unusedCount+1)) / this.config['matHeight']
				});
				unusedCount++;
			}
		}
	}

	lastKnownCount(athleteID : string) : object {
		let countNumber = this.currentCountNumber;
		let count : any = null;
		while (countNumber > 0 && !count) {
			if (this.routine.counts[countNumber] && this.routine.counts[countNumber][athleteID])
				count = this.routine.counts[countNumber][athleteID];
			countNumber--;
		}
		return count;
	}

	onDrop(data : any) : void {
		let countToModify = this.routine.counts[this.currentCountNumber][data.data];
		console.log(data);
		// Now that we have the count, we want to translate the distance moved into a percentage of the floor
		let distanceMoved = {
			movePercentageX : (data.event.pageX - data.dragStartData.pageX) / (this.config.width - 120),
			movePercentageY : (data.event.pageY - data.dragStartData.pageY) / this.config.height
		}
		//console.log(countToModify);
		countToModify.posx = countToModify.posx + distanceMoved.movePercentageX;
		countToModify.posy = countToModify.posy + distanceMoved.movePercentageY;
		this.computeAthletePositions();
	}
}