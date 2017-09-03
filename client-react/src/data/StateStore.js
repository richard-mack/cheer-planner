import Athlete from './Athlete';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import AthleteActionTypes from './AthleteActionTypes';
import RoutineActionTypes from './RoutineActionTypes';
import StateActionTypes from './StateActionTypes';
import CheerDispatcher from './CheerDispatcher';

class StateStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return Immutable.Map({
			editingAthlete : '',
			currentCount : 1,
			activeView : 'spreadsheet',
			hiddenAthletes : new Immutable.Set(),
		});
	}

	reduce(state, action) {
		console.log('State Before Reduce:');
		console.log(state.toJSON());
		console.log('Action:');
		console.log(action);
		switch (action.type) {
			case AthleteActionTypes.OPEN_ATHLETE_DETAILS:
				if (action.id) {
					state = state.set('editingAthlete', action.id)
				}
				break;

			case AthleteActionTypes.CLOSE_ATHLETE_DETAILS:
				state = state.set('editingAthlete', '');
				break;

			case StateActionTypes.SET_CURRENT_COUNT:
				let count = parseInt(action.number)
				
				if (isNaN(count))
					count = 1;

				count = Math.max(count, 1)
				count = Math.min(count, 800)


				state = state.set('currentCount', count)
				break;

			case StateActionTypes.SET_ACTIVE_VIEW:
				let possibleViews = ['floor','spreadsheet'];

				if (possibleViews.indexOf(action.desiredView) == -1)
					break;

				state = state.set('activeView', action.desiredView)
				break;

			case StateActionTypes.HIDE_ATHLETE:
				state = state.update('hiddenAthletes', hidden => hidden.add(action.athleteId))
				break;
			case StateActionTypes.SHOW_ATHLETE:
				state = state.update('hiddenAthletes', hidden => hidden.delete(action.athleteId));
				break;
			default:
				break;
		}
		console.log('State after Reduce:');
		console.log(state.toJSON());
		return state;

	}
}

export default new StateStore();