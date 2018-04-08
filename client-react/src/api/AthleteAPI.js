import CheerDispatcher from '../data/CheerDispatcher.js';
import AthleteActionTypes from '../data/AthleteActionTypes';
import request from 'superagent';

module.exports = {
	getAthlete : function(id) {
		request.get('/api/Athlete/'+id).end(function(err, response) {
	        if (err) return console.error(err);

	        CheerDispatcher.dispatch({
	        	type : AthleteActionTypes.GET_ATHLETE_RESPONSE,
	        	athlete : response.body[0],
	      	});
	    });
	},

	saveAthlete : function(athlete) {
		request.post('/api/Athlete/')
		.send({data : athlete})
		.end(function (err, response) {
			if (err) return console.error(err);

			console.log(response);

			CheerDispatcher.dispatch({
				type : AthleteActionTypes.SAVE_ATHLETE_RESPONSE,
				response,
			})
			return;
		})
	}
}
