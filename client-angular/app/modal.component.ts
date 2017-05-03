import { Component, Input } from '@angular/core';

@Component({
	selector : '[cpModal]',
	template : `
	<div style="position: absolute; left: 0em; top: 0em; height: 100%; width: 100%; z-index: 1; background-color: lightgray; opacity: 0.5"></div>
	<div style="position: absolute; left:25%; top:25%; height:50%; width:50%; z-index: 2;">
		<ng-content></ng-content>
	</div>
	`
})
export class ModalComponent {
}