import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<AppContainer />, document.getElementById('app-root'));


import AthleteActions from './data/AthleteActions';
import RoutineActions from './data/RoutineActions';
import StateActions from './data/StateActions';

AthleteActions.createAthlete({id : 'A1', name : 'Tina Lee', shortName : 'Tina'});
AthleteActions.createAthlete({id : 'A2', name : 'Richard Mack', shortName : 'Richard'})
AthleteActions.createAthlete({id : 'This is a longer id', name : 'Michalla Traille', shortName : 'Michalla'})
RoutineActions.upsertCount({count : 1, athleteId : 'A1', posx : 0.5, poxy : 0.8, note : 'count1Tina'});
RoutineActions.upsertCount({count : 1, athleteId : 'A2', posx : 0.5, posy : 0.7, note : 'count1Richard'});
RoutineActions.upsertCount({count : 2, athleteId : 'A1', posx : 0.5, posy : 0.2, note : 'count 2 Tina'});
RoutineActions.upsertNote(1, 'This is a test');
RoutineActions.upsertNote(2, 'Also a Test');
StateActions.setActiveView('table');
