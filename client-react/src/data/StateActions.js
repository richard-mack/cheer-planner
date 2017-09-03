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
	}
}

export default Actions;