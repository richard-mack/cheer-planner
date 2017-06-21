import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector : 'numeric-input',
	template : `
		<button (click)="onClick()">asdf</button>
		<div [ngStyle]="{
    		'position' : 'absolute',
      		'left' : config.left + 'px',
      		'top' : config.top + 'px',
      		'height' : config.height + 'px',
      		'font-size' : config.height + 'px'
      	}">
      		Count - <label [innerHTML]="this.Math.floor((currentCountNumber - 1) / 8) + 1"></label> :
      		<label [innerHTML]="currentCountNumber % 8 || 8"></label> (<label [innerHTML]="currentCountNumber" ></label>)
    
    <!-- Arrows for incrementing/decrementing the counts -->
      <input type="image" src="./app/up.png" (click)="jumpToCount(currentCountNumber + 8)" [ngStyle]="{
        'height' : config.height / 2 + 'px', 
        'width': config.height / 2 + 'px',
        'position' : 'absolute',
        'font-size' : config.height + 'px',
        left: '3.28em',
        top : '-0.3em'
      }"><input type="image" src="./app/down.png" (click)="jumpToCount(currentCountNumber - 8)" [ngStyle]="{
        height: config.height / 2 + 'px', 
        width: config.height / 2 + 'px',
        'position' : 'absolute',
        'font-size' : config.height + 'px',
        left: '3.28em',
        top : '0.9em'
      }">
      <input type="image" src="./app/up.png" (click)="jumpToCount(currentCountNumber + 1)" [ngStyle]="{
        height: config.height / 2 + 'px', 
        width: config.height / 2 + 'px',
        'position' : 'absolute',
        'font-size' : config.height + 'px',
        left: '4.55em',
        top : '-0.3em'
      }"><input type="image" src="./app/down.png" (click)="jumpToCount(currentCountNumber - 1)" [ngStyle]="{
        height: config.height / 2 + 'px', 
        width: config.height / 2 + 'px',
        'position' : 'absolute',
        'font-size' : config.height + 'px',
        left: '4.55em',
        top : '0.9em'
      }">
    </div>
	`
})
export class NumericInputComponent {
	Math : any;
	@Input() currentCountNumber: number;
	@Output() currentCountNumberChange : EventEmitter<number> = new EventEmitter<number>();
	@Input() config: object;

	constructor() {
		this.Math = Math;
	}

	jumpToCount(target: number) : void {
		if (target < 1)
			target = 1;
		this.currentCountNumberChange.emit(target);
	}

}