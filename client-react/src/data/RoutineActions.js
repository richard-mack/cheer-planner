import RoutineActionTypes from './RoutineActionTypes';
import CheerDispatcher from './CheerDispatcher.js';
import CreateID from './CreateID.js';
import RoutineAPI from '../api/RoutineAPI';

const Actions = {
	getRoutineList() { // SHOULDDO: Once permissions are implemented, this is meaningful. Until then, it doesn't need to do anything
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.GET_ROUTINE_LIST,
		});
	},

	getRoutine(id) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.GET_ROUTINE,
			id,
		});

		RoutineAPI.getRoutine(id)
	},

	saveRoutine(routine) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.SAVE_ROUTINE,
			id : routine.id,
		});

		RoutineAPI.saveRoutine(routine);
	},

	addAthlete(id) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.ADD_ATHLETE,
			id,
		});
	},

	upsertCount(count) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.UPSERT_COUNT,
			count,
		})
	},

	changeCountDetails(count) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.CHANGE_COUNT_DETAILS,
			count
		})
	},

	upsertNote(countNumber, note) {
		CheerDispatcher.dispatch({
			type : RoutineActionTypes.UPSERT_NOTE,
			countNumber,
			note,
		})
	}


	/*saveAthleteDetails(athleteData) {
		if (!athleteData.id) {
			athleteData.id = CreateID({prefix : 'A'})
		}
		if (!athleteData.shortName) {
			athleteData.shortName = athleteData.name.split(' ')[0]
		}
		console.log(athleteData);

		CheerDispatcher.dispatch({
			type : AthleteActionTypes.SAVE_ATHLETE_DETAILS,
			athleteData,
		});
	}*/
}

export default Actions;