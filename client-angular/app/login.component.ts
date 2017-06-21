import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
	selector : 'login-component',
	template : `
		Username : <input [(ngModel)]="username" placeholder="Username" /><br />
		Password : <input [(ngModel)]="password" placeholder="Password" /><br />
		<button (click)="onRegisterClick()">Register</button>
		<button (click)="onLoginClick()">Login</button>
	`,
	providers : [ AuthService ]
})
export class LoginComponent {
	constructor(
		private route : ActivatedRoute,
		private authService: AuthService,
		private router : Router
		) { }

	username : string;
	password : string;
	loginError : string;

	onRegisterClick() : Promise<boolean> {
		return this.authService.register(this.username, this.password).catch(err => {
			console.log(err);
			return false;
		});
	}

	onLoginClick() : Promise<boolean> {
		return this.authService.login(this.username, this.password).then(res => {
			return this.router.navigate(['/routine'], {relativeTo : this.route})
		}).catch(err => {
			console.log(err);
			return false;
		})
	}
}