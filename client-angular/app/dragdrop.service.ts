// Taken from http://www.radzen.com/blog/angular-drag-and-drop/

import { Injectable } from '@angular/core';

@Injectable()
export class DragService {
	private zone : string;

	startDrag(zone : string) {
		this.zone = zone;
	}

	accepts(zone : string) {
		return zone == this.zone;
	}
}