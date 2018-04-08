import { Component, OnInit } from '@angular/core';

import { Config } from './models/config';

import { DataService } from './data.service';

@Component({
	selector : 'config',
	providers : [ DataService ],
	template : `
	<header></header>
	<div cpDropTarget (cpDrop)="onDrop($event)" style="position: absolute; height: 95%; width: 100%; top: 5%;">
		<button (click)="saveButton()" style="position: absolute; left: 10px; top: 10px;">Save</button>
		<div *ngFor="let configKey of configKeys" [ngStyle]="{
			'position' : 'absolute',
			'left' : config[configKey].left + 'px',
			'top' : config[configKey].top + 'px',
			'height' : config[configKey].height + 'px',
			'width' : config[configKey].width + 'px',
			'border' : '1px black solid',
			'z-index' : 1
		}" [cpDraggable]="{data : configKey}">{{configKey}}
			<div id="DragHandle" *ngIf="config[configKey].resizable" [ngStyle]="{
				'position' : 'absolute',
				'left' : config[configKey].width - 5 + 'px',
				'top' : config[configKey].height - 5 + 'px',
				'border': '3px black solid',
				'z-index' : 2
			}" [cpDraggable]="{data : configKey}">

			</div>

		</div>
		</div>
	`
})
export class ConfigComponent implements OnInit {
	constructor(private dataService : DataService) {}

	config : object = null;
	configKeys : string[] = [];

	ngOnInit() : void {
		this.dataService.getAccountConfig().then(config => {
				this.config = new Config(config);
			this.configKeys = Object.keys(this.config);
		});
	}

	onDrop($event : any) : void {
		let configElement;
		// If we are resizing the item
		if ($event.dragStartData.targetId == 'DragHandle') {
			configElement = this.config[$event.data]
			configElement.height = configElement.height + $event.event.pageY - $event.dragStartData.pageY;
			configElement.width = configElement.width + $event.event.pageX - $event.dragStartData.pageX;
		}
		else {
			this.config[$event.data].top = this.config[$event.data].top + $event.event.pageY - $event.dragStartData.pageY;
			this.config[$event.data].left = this.config[$event.data].left + $event.event.pageX - $event.dragStartData.pageX;
		}

	//	console.log($event);
	}

	saveButton() : void {
		this.dataService.saveAccountConfig(this.config).catch(err => {
			throw new Error(err);
		})
	}
}