import CheerDispatcher from '../data/CheerDispatcher';
import UserActionTypes from '../data/UserActionTypes';

import RoutineActions from '../data/RoutineActions'; // We need this to trigger getting the routine model upon login

import request from 'superagent';

module.exports = {
	login : function(username, password) {
		console.log(username, password);
		request.post('api/login')
		.send({username, password})
		.end(function (err, response) {
			if (err) return console.log(err);

			//console.log(response);

			CheerDispatcher.dispatch({
				type : UserActionTypes.LOGIN_RESPONSE,
				user : {
					accountID : response.body.accountID,
				},
			});

			// Request for the routine model
			// HACK SHOULDDO: Refactor this to maintain separation of concerns
			RoutineActions.getRoutine('testroutine');
		});
	},
}