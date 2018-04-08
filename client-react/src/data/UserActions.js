import UserActionTypes from './UserActionTypes';
import CheerDispatcher from './CheerDispatcher';
import CreateID from './CreateID';
import UserAPI from '../api/UserAPI';

const Actions = {


	login(username, password) {
		CheerDispatcher.dispatch({
			type : UserActionTypes.LOGIN,
			username,
		});

		UserAPI.login(username, password);
	},

	onChangeLoginDetails(field, newValue) {
		CheerDispatcher.dispatch({
			type : UserActionTypes.UPDATE_LOGIN_DETAILS,
			field,
			newValue,
		});
	},
}

export default Actions;