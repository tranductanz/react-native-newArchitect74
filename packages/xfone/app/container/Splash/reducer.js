import * as _state from './state';
import * as _action from './action';

const authenReducer = function (state = _state.authenState, action) {
    switch (action.type) {
        case _action.authenAction.STACK_APP:
            return {
                ...state,
                stackApp: action.stack
            };
        case _action.authenAction.IS_SIGNIN:
            return {
                ...state,
                isSignIn: action.isSignIn
            };
        case _action.authenAction.RESTORE_TOKEN:
            return {
                ...state,
                token: action.token
            };

        default:
            return state;
    }
};

export { authenReducer };
