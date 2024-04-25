import * as _action from './actions';
const initialState = {
    isReceivedIncomingAudioCall: false,
    incomingAudioCallData: null
};
export const audioCallReducer = function (state = initialState, action) {
    switch (action.type) {
        case _action.GO_TO_AUDIO_CALL:
            return {
                ...state,
                isReceivedIncomingAudioCall: true,
                incomingAudioCallData: action.data
            };
        case _action.END_AUDIO_CALL:
            return {
                ...state,
                isReceivedIncomingAudioCall: false,
                incomingAudioCallData: null
            };

        default:
            return {
                ...state
            };
    }
};
