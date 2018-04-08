import AppView from '../views/AppView';
import {Container} from 'flux/utils';

import AthleteStore from '../data/AthleteStore';
import AthleteActions from '../data/AthleteActions';
import RoutineStore from '../data/RoutineStore';
import RoutineActions from '../data/RoutineActions';
import StateStore from '../data/StateStore';
import StateActions from '../data/StateActions';
import UserStore from '../data/UserStore';
import UserActions from '../data/UserActions';

import debugFlags from '../debugFlags';

function getStores() {
  return [
    AthleteStore,
    RoutineStore,
    StateStore,
    UserStore,
  ];
}

function getState() {
  return {
    athletes: AthleteStore.getState(),

    routine : RoutineStore.getState(),

    appState : StateStore.getState(),

    user : UserStore.getState(),

    onClickOpenAthleteDetails : StateActions.openAthleteDetails,
    onChangeAthleteDetails : AthleteActions.changeAthleteDetails,
    onClickCloseAthleteDetails : StateActions.closeAthleteDetails,

    onClickOpenCountDetails : StateActions.openCountDetails,
    onChangeCountDetails : RoutineActions.changeCountDetails,
    onClickCloseCountDetails : StateActions.closeCountDetails,

    upsertNote : RoutineActions.upsertNote,

    onClickAddAthlete : AthleteActions.createAthlete,
    onDeleteAthlete : AthleteActions.deleteAthlete,

    setCurrentCount : StateActions.setCurrentCount,
    setActiveView : StateActions.setActiveView,

    hideAthlete : StateActions.hideAthlete,
    showAthlete : StateActions.showAthlete,

    saveRoutine : RoutineActions.saveRoutine,
    saveAthlete : AthleteActions.saveAthlete,

    login : UserActions.login,
    onChangeLoginDetails : UserActions.onChangeLoginDetails,
  };
}

export default Container.createFunctional(AppView, getStores, getState);
