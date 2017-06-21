import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
	selector : 'header',
	providers : [ AuthService ],
	template : `
	<div style="position: absolute; height: 5%; width: 100%; top: 0px; left:0px; background-color: lightgrey; border: 1px solid black;">
		<a routerLink="/config">Config</a>
		<span style="position: absolute; right: 0px;"><button (click)="onLogoutClick()">Logout</button></span>
	</div>
	`
})
export class HeaderComponent {
	constructor(private authService : AuthService, private router : Router, private route : ActivatedRoute) {}

	onLogoutClick() : Promise<boolean> {
		console.log('logging out');
		return this.authService.logout().then(res => {
			return this.router.navigate(['login']);
		});
		
	}
}