import Athlete from './Athlete';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import AthleteActionTypes from './AthleteActionTypes';
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
		console.log('State Before Reduce:');
		console.log(state.toJSON());
		console.log('Action:');
		console.log(action);
		switch (action.type) {
			case AthleteActionTypes.CREATE_ATHLETE:
				state = state.update('athletesList', list => list.set(action.athleteData.id, new Athlete(action.athleteData)));
				break;

			case AthleteActionTypes.DELETE_ATHLETE:
				// for now, do nothing. MUSTDO: Implement this.
				break;

			case AthleteActionTypes.CHANGE_ATHLETE_DETAILS:
				state = state.setIn(['athletesList', action.athleteId, action.field], action.newValue);
				break;

			default:
				break;
		}
		console.log('State after Reduce:');
		console.log(state.toJSON());
		return state;

	}
}

export default new AthleteStore();