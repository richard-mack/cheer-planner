import Immutable from 'immutable';

const Routine = Immutable.Record({
  'id': '',
  'name' : 'New Routine',
  'athletes' : new Immutable.Set(),
  'counts' : new Immutable.List(),
  //'accountID' : '',
});

export default Routine;