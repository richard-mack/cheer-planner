import AthleteActionTypes from './AthleteActionTypes';
import CheerDispatcher from './CheerDispatcher';
import CreateID from './CreateID.js';
import AthleteAPI from '../api/AthleteAPI';

const Actions = {
	getAthlete(id) {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.GET_ATHLETE,
			id,
		});

		AthleteAPI.getAthlete(id);
	},

	saveAthlete(athlete) {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.SAVE_ATHLETE,
			athlete : athlete,
		})

		AthleteAPI.saveAthlete(athlete);
	},

	createAthlete(athleteData) {
		if (!athleteData.name) {
			throw new Error('Must have at least a name');
		}
		if (!athleteData.id) {
			athleteData.id = CreateID({prefix : 'A'})
		}
		if (!athleteData.shortName) {
			athleteData.shortName = athleteData.name.split(' ')[0]
		}
		console.log(athleteData);

		CheerDispatcher.dispatch({
			type : AthleteActionTypes.CREATE_ATHLETE,
			athleteData,
		})

	},
	deleteAthlete(id) {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.DELETE_ATHLETE,
			id,
		});
	},

	changeAthleteDetails(athleteId, field, newValue) {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.CHANGE_ATHLETE_DETAILS,
			athleteId,
			field,
			newValue,
		});
	}
}

export default Actions;