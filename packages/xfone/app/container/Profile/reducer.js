export const typeNavigator = {
    SPLASH_NAVIGATOR: 'SPLASH_NAVIGATOR',
    LOGIN_NAVIGATOR: 'LOGIN_NAVIGATOR',
    MAIN_NAVIGATOR: 'MAIN_NAVIGATOR',
    LINKING_NAVIGATOR: 'LINKING_NAVIGATOR'
};

const initialState = {
    userProfile: {},
    hiddenProfile: false,
    packageId: '',
    shipmentOrderID: '',
    typeNavigator: null,
    isIncomingCall: false,
    isReceiveCallForeground: false,
    deeplink: null
};

const profileReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'INITIAL_USER_PROFILE':
            return {
                ...state,
                userProfile: action.data
            };

        case 'SET_DEEPLINK_PROFILE':
            return {
                ...state,
                packageId: action.packageId,
                shipmentOrderID: action.shipmentOrderID
            };

        case 'SET_HIDDEN_PROFILE':
            return {
                ...state,
                hiddenProfile: action.hidden
            };
        case 'RESET_UTILITIES':
            return {
                ...state,
                hiddenProfile: false
            };
        case 'SET_NAVIGATOR':
            return {
                ...state,
                typeNavigator:
                    action.typeNavigator !== null
                        ? action.typeNavigator
                        : state.typeNavigator,
                linkingUrlData:
                    action.linkingUrlData !== null
                        ? action.linkingUrlData
                        : state.linkingUrlData,
                isIncomingCall:
                    action.isIncomingCall !== null
                        ? action.isIncomingCall
                        : state.isIncomingCall,
                isReceiveCallForeground:
                    action.isReceiveCallForeground !== null
                        ? action.isReceiveCallForeground
                        : state.isReceiveCallForeground,
                url: action.url !== null ? action.url : state.url
            };
        case 'SET_DEEPLINK': {
            return {
                ...state,
                deeplink: action.data
            };
        }
        default:
            return state;
    }
};

export { profileReducer };
