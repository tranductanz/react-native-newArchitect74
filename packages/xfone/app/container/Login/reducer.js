// import * as _action from './action';
import * as types from './action';

const initialState = {
    fetching: false,
    authCompleted: false,
    authError: {},
    sipIP: {},
    livestreamPermissionList: null
};

const auth = function (state = initialState, action) {
    switch (action.type) {
        case types.AUTH_FETCHING:
            return {
                ...initialState,
                fetching: true
            };
        case types.AUTH_COMPLETED:
            return {
                ...state,
                authCompleted: true,
                fetching: false
            };
        case types.AUTH_ERROR:
            return {
                ...state,
                fetching: false,
                authCompleted: false,
                authError: action.error
            };

        case types.AUTHEN_LOGOUT:
            return {
                ...initialState,
                authCompleted: false
            };
        case types.SIP_IP:
            return {
                ...state,
                sipIP: action.data
            };
        case types.SET_LIVESTREAM_PERMISSION_LIST:
            return {
                ...state,
                livestreamPermissionList: action.data
            };
        default:
            return state;
    }
};

export { auth };
