import AppView from '../views/AppView';
import {Container} from 'flux/utils';

import AthleteStore from '../data/AthleteStore';
import AthleteActions from '../data/AthleteActions';
import RoutineStore from '../data/RoutineStore';
import RoutineActions from '../data/RoutineActions';
import StateStore from '../data/StateStore';
import StateActions from '../data/StateActions';

import debugFlags from '../debugFlags';

function getStores() {
  return [
    AthleteStore,
    RoutineStore,
    StateStore,
  ];
}

function getState() {
  return {
    athletes: AthleteStore.getState(),

    routine : RoutineStore.getState(),

    appState : StateStore.getState(),

    routinePositions : RoutineStore.getState().get('counts').reduce(
      (accumulator, count) => {
        if (debugFlags.routinePositions) {
          console.log('Count To Process:');
          console.log(count ? count.toObject() : 'Null Count');
        }
        let athletesList = AthleteStore.getState().get('athletesList').map(athlete => {
          return {id : athlete.id, shortName : athlete.shortName}
        }).toArray();
        let unusedCounter = 1;
        let newCountPositions = {};
        // Iterate through the athletes, placing each one
        for (let athlete of athletesList) {
          if (count && count.get(athlete.id)) {
            // Is the athlete moved on this count?
            newCountPositions[athlete.id] = {
              posx : count.get(athlete.id).posx, 
              posy : count.get(athlete.id).posy, 
              shortName : athlete.shortName
            }
          } else if (accumulator.length > 0 && accumulator.slice(-1)[0][athlete.id].posx != 1.03){
            // Were they previously placed on the floor?
            newCountPositions[athlete.id] = accumulator.slice(-1)[0][athlete.id]
          } else {
            // They aren't on the floor. Add to the usused athletes list.
            newCountPositions[athlete.id] = {posx : 1.03, posy : 0.025*unusedCounter, shortName : athlete.shortName}
            unusedCounter++;
          }
        }
        if (debugFlags.routinePositions) {
          console.log('New Count Positions:')
          console.log(newCountPositions);
        }

        accumulator.push(newCountPositions);
        if (debugFlags.routinePositions) {
          console.log('Accumulator Status');
          console.log(accumulator);
        }
        return accumulator;
      }, []
    ),

    countNotes : RoutineStore.getState().get('counts').reduce((accumulator, count) => {
      // Early Exit
      if (accumulator.length == 0)
        return ['No Comment'];

      let newNote;
      if (count)
        newNote = count.get('note');
      else
        newNote = accumulator[accumulator.length-1];

      accumulator.push(newNote);
      return accumulator;
    }, []),

    onChangeAthleteDetails : AthleteActions.changeAthleteDetails,

    onClickAthlete : AthleteActions.openAthleteDetails,
    onClickAddAthlete : AthleteActions.createAthlete,
    onClickCloseAthleteDetails : AthleteActions.closeAthleteDetails,
    onDeleteAthlete : AthleteActions.deleteAthlete,

    setCurrentCount : StateActions.setCurrentCount,
    setActiveView : StateActions.setActiveView,

    hideAthlete : StateActions.hideAthlete,
    showAthlete : StateActions.showAthlete,
  };
}

export default Container.createFunctional(AppView, getStores, getState);
