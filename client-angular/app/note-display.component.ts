import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
	selector : 'note-display',
	template : `
		<input [(ngModel)]="countNote" (change)="onNoteChange($event)" [ngStyle]="{
			'position' : 'absolute',
			'top' : config.top + 'px',
			'left' : config.left + 'px',
			'height' : config.height + 'px',
			'width' : config.width + 'px'
		}"/>
	`
})
export class NoteDisplayComponent {
	@Input() countNote : string;
	@Output() countNoteChange : EventEmitter<string> = new EventEmitter<string>();
	@Input() config : object;

	onNoteChange($event : any) : void {
		this.countNoteChange.emit(this.countNote);
	}
}