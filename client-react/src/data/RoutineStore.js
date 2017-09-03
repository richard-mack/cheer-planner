import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import CheerDispatcher from './CheerDispatcher';

import Routine from './Routine';
import CountsContainer from './CountsContainer';
import Count from './Count';

import RoutineActionTypes from './RoutineActionTypes';

class AthleteStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return new Routine();
	}

	reduce(state, action) {
		console.log('State Before Reduce:');
		console.log(state.toJSON());
		console.log('Action:');
		console.log(action);
		switch (action.type) {
			case RoutineActionTypes.ADD_ATHLETE:
				state = state.set('athletes', athletes.add(action.id));
				break;

			case RoutineActionTypes.UPSERT_COUNT:
				state = state.set('counts', state.counts.update(
					action.count.count, 
					new CountsContainer.set(action.count.athleteId, new Count(action.count)),
					countsContainer => countsContainer.set(action.count.athleteId, new Count(action.count))
					))
				break;

			case RoutineActionTypes.UPSERT_NOTE:
				state = state.setIn(['counts', action.countNumber, 'note'], action.note);
				break;

			case RoutineActionTypes.GET_ROUTINE_RESPONSE:
				console.log(JSON.stringify(action.routine));
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