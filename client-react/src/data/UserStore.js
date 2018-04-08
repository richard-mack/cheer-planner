import User from './User';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import debugFlags from '../debugFlags';

import UserActionTypes from './UserActionTypes';
import CheerDispatcher from './CheerDispatcher';

class UserStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return Immutable.Map({
			loggedInUser : null,
			loginDetails : Immutable.Map({
				username : '',
				password : '',
			}),
		});
	}

	reduce(state, action) {
		if (debugFlags.userChanges) {
			console.log('State Before Reduce:');
			console.log(state.toJSON());
			console.log('Action:');	
			console.log(action);
		}
		switch (action.type) {
			case UserActionTypes.LOGIN_RESPONSE:
				state = state.set('loggedInUser', new User(action.user));
				break;

			case UserActionTypes.UPDATE_LOGIN_DETAILS:
				state = state.setIn(['loginDetails', action.field], action.newValue);
				break;

			default:
				break;
		}
		if (debugFlags.userChanges) {
			console.log('State after Reduce:');
			console.log(state.toJSON());
		}
		return state;

	}
}

export default new UserStore();