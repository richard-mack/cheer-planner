import Counter from './Counter';
import Todo from './Todo';
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import TodoActionTypes from './TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

class TodoStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case TodoActionTypes.ADD_TODO:
        // Don't add todos with no text.
        if (!action.text) {
          return state;
        }
        const id = Counter.increment();
        return state.set(id, new Todo({
          id,
          text: action.text,
          complete: false,
        }));
        break;
        
      case TodoActionTypes.DELETE_TODO:
        return state.delete(action.id);
        break;

      case TodoActionTypes.TOGGLE_TODO:
        return state.update(
            action.id,
            todo => todo.set('complete', !todo.complete),
          );
        break;

      default:
        return state;
    }
  }
}

export default new TodoStore();