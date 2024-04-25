import * as _action from './actions';
const initialState = {
    isReceivedIncomingVideoCall: false,
    incomingCallData: null
};
export const videoCallReducer = function (state = initialState, action) {
    switch (action.type) {
        case _action.GO_TO_VIDEO_CALL:
            return {
                ...state,
                isReceivedIncomingVideoCall: true,
                incomingCallData: action.data
            };
        case _action.END_VIDEO_CALL:
            return {
                ...state,
                isReceivedIncomingVideoCall: false,
                incomingCallData: null
            };

        default:
            return {
                ...state
            };
    }
};
