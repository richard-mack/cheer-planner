import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import debugFlags from '../debugFlags';

import CheerDispatcher from './CheerDispatcher';

import Routine from './Routine';
import CountsContainer from './CountsContainer';
import Count from './Count';

import AthleteActionTypes from './AthleteActionTypes';
import RoutineActionTypes from './RoutineActionTypes';
import UserActionTypes from './UserActionTypes';

class RoutineStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return new Routine();
	}	

	reduce(state, action) {
		if (debugFlags.routineCHanges) {
			console.log('State Before Reduce:');
			console.log(state.toJSON());
			console.log('Action:');
			console.log(action);
		}
	switch (action.type) {
			case RoutineActionTypes.ADD_ATHLETE:
				state = state.set('athletes', state.get('athletes').add(action.id));
				break;

			case RoutineActionTypes.CHANGE_COUNT_DETAILS: // This is not a mistake
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
				state = new Routine({
					id : action.routine.id,
					name : action.routine.name,
					athletes : new Immutable.Set(action.routine.athletes),
					counts : new Immutable.List(
						action.routine.counts.map((count, idx) => {
							let countContainer = new CountsContainer.set('note', count.note);
							//countContainer = countContainer.set('note', action.routine.notes[idx]);
							if (count) { // If count is null, we don't need to look for keys.
								Object.keys(count).forEach( athleteId => {
									if (count[athleteId] && athleteId !== 'note') {
										count[athleteId].athleteId = athleteId; // So we store the athlete id as part of the count
										countContainer = countContainer.set(athleteId, new Count(count[athleteId]));
									}
								});
							}
							return countContainer;
						}))
				});
				break;

			default:
				break;
		}
		if (debugFlags.routineChanges) {
			console.log('State after Reduce:');
			console.log(state.toJSON());
		}
		return state;

	}
}

export default new RoutineStore();