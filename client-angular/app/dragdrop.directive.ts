// Taken from http://www.radzen.com/blog/angular-drag-and-drop/

import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { DragService } from './dragdrop.service';

@Directive({
	selector : '[cpDraggable]'
})
export class DraggableDirective {
	constructor(private dragService : DragService) { }

	@HostBinding('draggable')
	get draggable() {
		return true;
	}

	@Input()
	set cpDraggable(options : DraggableOptions) {
		if (options)
			this.options = options;
	}

	private options: DraggableOptions = {};

	@HostListener('dragstart', ['$event'])
	onDragStart(event : any) {
		const { zone = 'zone', data = {} } = this.options;
		this.dragService.startDrag(zone);
		/*console.log('Drag Start Data');
		console.log(data);
		console.log('Drag Start $event');
		console.log(event);*/

		event.dataTransfer.setData('Text', JSON.stringify({ 'data' : data, 'dragStartData' : {'pageX' : event.pageX, 'pageY' : event.pageY, 'targetId' : event.target.id} }));
	}
}

export interface DraggableOptions {
	zone? : string;
	data? : any;
}

@Directive({
	selector : '[cpDropTarget]'
})
export class DropTargetDirective {
	constructor(private dragService : DragService) { }

	@Input()
	set cpDropTarget(options : DropTargetOptions) {
		if (options)
			this.options = options;
	}

	@Output('cpDrop') drop = new EventEmitter();
	private options: DropTargetOptions = {};

	@HostListener('dragenter', ['$event'])
	@HostListener('dragover', ['$event'])
	onDragOver(event : any) {
		const {zone = 'zone'} = this.options;

		if (this.dragService.accepts(zone)) {
			event.preventDefault();
		}
	}

	@HostListener('drop', ['$event'])
	onDrop(event : any) {
		const data = JSON.parse(event.dataTransfer.getData('Text'));
		this.drop.next({'event' : event, 'data' : data.data, 'dragStartData' : data.dragStartData })
	}
}

export interface DropTargetOptions {
	zone? : string;
}