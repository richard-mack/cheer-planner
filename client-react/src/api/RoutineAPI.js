import CheerDispatcher from '../data/CheerDispatcher.js';
import RoutineActionTypes from '../data/RoutineActionTypes';
import AthleteActionTypes from '../data/AthleteActionTypes';
import request from 'superagent';

module.exports = {
	getRoutine : function(id) {
		request.get(`/api/Routine/${id}`).end(function(err, response) {
	        if (err) return console.error(err);

	        CheerDispatcher.dispatch({
	        	type : RoutineActionTypes.GET_ROUTINE_RESPONSE,
	        	routine : response.body.routine,
	        	athletes : response.body.athletes,
	      	});
	    });
	},

	saveRoutine : function(routine) {
		request.post('/api/Routine/')
		.send({data : routine})
		.end(function (err, response) {
			if (err) return console.error(err);

			console.log(response);
			return;
		})
	}
}
