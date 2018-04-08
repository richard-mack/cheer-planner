import Athlete from './Athlete';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import AthleteActionTypes from './AthleteActionTypes';
import RoutineActionTypes from './RoutineActionTypes';
import StateActionTypes from './StateActionTypes';
import UserActionTypes from './UserActionTypes';
import CheerDispatcher from './CheerDispatcher';

import debugFlags from '../debugFlags';

class StateStore extends ReduceStore {
	constructor() {
		super(CheerDispatcher);
	}

	getInitialState() {
		return Immutable.Map({
			editingAthlete : '',
			editingCount : {
				athleteId : '',
				countNumber : 0,
			},
			currentCount : 1,
			activeView : 'login',
			hiddenAthletes : new Immutable.Set(),
			isModalVisible : false,
			routinePositions : new Immutable.List(),
		});
	}

	updatePositions(editedCount, oldRoutinePositions) {
		let originalPosition = oldRoutinePositions.getIn([editedCount.count, editedCount.athleteId])
		let counter = editedCount.count;

		while (Immutable.is(oldRoutinePositions.getIn([counter, editedCount.athleteId]), originalPosition)) {
			oldRoutinePositions = oldRoutinePositions.setIn([counter, editedCount.athleteId, 'posx'], editedCount.posx);
			oldRoutinePositions = oldRoutinePositions.setIn([counter, editedCount.athleteId, 'posy'], editedCount.posy);
			counter++;
		}

		return oldRoutinePositions;
	}

	reduce(state, action) {
		if (debugFlags.stateChanges) {
			console.log('State Before Reduce:');
			console.log(state.toJSON());
			console.log('Action:');
			console.log(action);
		}
		switch (action.type) {
			case StateActionTypes.OPEN_ATHLETE_DETAILS:
				if (action.id) {
					state = state.set('editingAthlete', action.id)
					state = state.set('isModalVisible', true); // We have opened a Modal
				}
				break;

			case StateActionTypes.CLOSE_ATHLETE_DETAILS:
				state = state.set('editingAthlete', '');
				state = state.set('isModalVisible', false); // We have closed a Modal
				break;

			case StateActionTypes.OPEN_COUNT_DETAILS:
				state = state.set('editingCount', { athleteId : action.id, countNumber : action.countNumber});
				state = state.set('isModalVisible', true); // We have opened a Modal
				break;

			case StateActionTypes.CLOSE_COUNT_DETAILS:
				state = state.set('editingCount', { athleteId : '', countNumber : 0});
				state = state.set('isModalVisible', false); // We have closed a Modal
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

			case UserActionTypes.LOGIN_RESPONSE:
				state = state.set('activeView', 'floor')
				break;
			case RoutineActionTypes.GET_ROUTINE_RESPONSE:
				// Need to set up positions for the whole floor
				let positions = new Immutable.List();
				let counts = action.routine.counts;
				let athletes = action.athletes;
				// There will be no meaningful positions on count zero, just make it have a note and no positions
				positions = positions.push(new Immutable.Map({'note' : 'Unused Count'}));
				for (let countNumber = 1; countNumber < counts.length; countNumber++) {
					let currentCount = counts[countNumber];
					let prevCountPositions = positions.get(countNumber - 1);
					let currentCountPositions = new Immutable.Map();
					// Attach the note to the count
					currentCountPositions = currentCountPositions.set('note', currentCount.note || '')

					// Now, we iterate through the athletes. Each one we need to look at
					// to determine whether it has a spot on the floor or is an open count
					let unusedAthleteCounter = 1;
					athletes.forEach(athlete => {
						let athleteId = athlete.id;
						let prevAthletePosition = prevCountPositions.get(athleteId);
						let newAthleteCount = currentCount[athleteId];
						let newAthletePosition;
						// Now, there are three possibilities.
						if (newAthleteCount) {
							// The athlete has been moved to a new place this count
							newAthletePosition = new Immutable.Map({'posx' : newAthleteCount.posx, 'posy' : newAthleteCount.posy, 'shortName' : athlete.shortName});
						} else if (prevAthletePosition && prevAthletePosition.posx != 1.03) {
							// The athlete was placed on the floor last count, but hasn't been moved to a new place
							newAthletePosition = prevAthletePosition;
						} else {
							// The athlete was unused last count, and has not been put on the floor this count
							newAthletePosition = new Immutable.Map({'posx' : 1.03, 'posy' : 25*unusedAthleteCounter/1000, 'shortName' : athlete.shortName});
							unusedAthleteCounter++;
						}
						currentCountPositions = currentCountPositions.set(athleteId, newAthletePosition);
					});

					positions = positions.push(currentCountPositions);
				}

				state = state.set('routinePositions', positions);
				break;

			case RoutineActionTypes.CHANGE_COUNT_DETAILS:
			case RoutineActionTypes.UPSERT_COUNT:
				state = state.update('routinePositions', routinePositions => this.updatePositions(action.count, routinePositions));
				console.log('UpsertCount');
				break;

			case RoutineActionTypes.UPSERT_NOTE:
				state = state.setIn(['routinePositions', action.countNumber, 'note'], action.note);
				// MUSTDO: Update notes based on this
				break;
			default:
				break;
		}
		if (debugFlags.stateChanges) {
			console.log('State after Reduce:');
			console.log(state.toJSON());
		}
		return state;

	}
}

export default new StateStore();