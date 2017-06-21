import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Account } from './models/account';

@Injectable()
export class AuthService {
	constructor(private http : Http) {}

	private user : boolean;

	isLoggedIn() : boolean {
		if (this.user) {
			return true;
		} else {
			return false;
		}

	}

	getUserStatus() : Promise<void> {
		return this.http.get('api/status').toPromise()
		.then(res => {
			if (res.json().status) {
				this.user = true;
			} else {
				this.user = false;
			}
		}).catch(res => {
			console.log(res);
			this.user = false;
		})
	}

	login(username : string, password : string) : Promise<boolean> {
		return this.http.post('api/login', {username : username, password : password}).toPromise()
		.then(res => {
			if (res.status && res.status == 200) {
				this.user = true;
				return Promise.resolve(true);
			} else {
				this.user = false;
				return Promise.reject(false);
			}
		}).catch(res => {
			this.user = false;
			console.log(res);
			return Promise.reject(false);
		});
	}

	logout() : Promise<boolean> {
		return this.http.get('api/logout').toPromise()
		.then(res => {
			this.user = false;
			return Promise.resolve(true);
		}).catch(res => {
			this.user = false;
			console.log(res);
			return Promise.reject(false);
		});
	}

	register(username : string, password : string) : Promise<boolean> {
		return this.http.post('api/register', { username : username, password : password }).toPromise()
		.then(res => {
			if (res.status && res.status == 200) {
				return Promise.resolve(true);
			} else {
				return Promise.reject(false);
			}
		}).catch(res => {
			console.log(res);
			return Promise.reject(false);
		});
	}
}