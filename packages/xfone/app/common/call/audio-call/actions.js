export const GO_TO_AUDIO_CALL = 'GO_TO_AUDIO_CALL';
export const END_AUDIO_CALL = 'END_AUDIO_CALL';

export const goToAudioScreen = (data) => (dispatch) => {
    dispatch({
        type: GO_TO_AUDIO_CALL,
        data: data
    });
};

export const endAudioCall = () => (dispatch) => {
    dispatch({
        type: END_AUDIO_CALL
    });
};
