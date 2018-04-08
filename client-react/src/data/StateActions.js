import StateActionTypes from './StateActionTypes';
import CheerDispatcher from './CheerDispatcher.js';

const Actions = {
	setCurrentCount(number) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.SET_CURRENT_COUNT,
			number,
		});
	},

	setActiveView(desiredView) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.SET_ACTIVE_VIEW,
			desiredView,
		})
	},

	hideAthlete(athleteId) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.HIDE_ATHLETE,
			athleteId,
		})
	},

	showAthlete(athleteId) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.SHOW_ATHLETE,
			athleteId,
		})
	},

	openAthleteDetails(id) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.OPEN_ATHLETE_DETAILS,
			id,
		});
	},

	closeAthleteDetails() {
		CheerDispatcher.dispatch({
			type : StateActionTypes.CLOSE_ATHLETE_DETAILS,
		});
	},

	openCountDetails(id, countNumber) {
		CheerDispatcher.dispatch({
			type : StateActionTypes.OPEN_COUNT_DETAILS,
			id,
			countNumber,
		});
	},

	closeCountDetails() {
		CheerDispatcher.dispatch({
			type : StateActionTypes.CLOSE_COUNT_DETAILS,
		});
	},

}

export default Actions;