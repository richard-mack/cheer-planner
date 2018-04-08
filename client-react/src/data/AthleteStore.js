import Athlete from './Athlete';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import debugFlags from '../debugFlags';

import AthleteActionTypes from './AthleteActionTypes';
import RoutineActionTypes from './RoutineActionTypes'; // We need this for the initial populating
import CheerDispatcher from './CheerDispatcher';

class AthleteStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return Immutable.Map({
			athletesList : Immutable.OrderedMap(),
		});
	}

	reduce(state, action) {
		if (debugFlags.athleteChanges) {
			console.log('State Before Reduce:');
			console.log(state.toJSON());
			console.log('Action:');	
			console.log(action);
		}
		switch (action.type) {
			case AthleteActionTypes.GET_ATHLETE_RESPONSE:
				state = state.setIn(['athletesList', action.athlete.id], new Athlete(action.athlete));
				break;

			case AthleteActionTypes.SAVE_ATHLETE_RESPONSE:
				// MUSTDO: Handle this
				break;

			case AthleteActionTypes.CREATE_ATHLETE:
				state = state.update('athletesList', list => list.set(action.athleteData.id, new Athlete(action.athleteData)));
				break;

			case AthleteActionTypes.DELETE_ATHLETE:
				// for now, do nothing. MUSTDO: Implement this.
				break;

			case AthleteActionTypes.CHANGE_ATHLETE_DETAILS:
				state = state.setIn(['athletesList', action.athleteId, action.field], action.newValue);
				break;

			case RoutineActionTypes.GET_ROUTINE_RESPONSE:
				action.athletes.map(athlete => {
					state = state.setIn(['athletesList', athlete.id], new Athlete(athlete));
				});
				break;

			default:
				break;
		}
		if (debugFlags.athleteChanges) {
			console.log('State after Reduce:');
			console.log(state.toJSON());
		}
		return state;

	}
}

export default new AthleteStore();