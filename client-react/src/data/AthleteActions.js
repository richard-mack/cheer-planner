import AthleteActionTypes from './AthleteActionTypes';
import CheerDispatcher from './CheerDispatcher.js';
import CreateID from './CreateID.js';

const Actions = {
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

	openAthleteDetails(id) {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.OPEN_ATHLETE_DETAILS,
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
	},

	closeAthleteDetails() {
		CheerDispatcher.dispatch({
			type : AthleteActionTypes.CLOSE_ATHLETE_DETAILS,
		});
	}
}

export default Actions;