export const GO_TO_VIDEO_CALL = 'GO_TO_VIDEO_CALL';
export const END_VIDEO_CALL = 'END_VIDEO_CALL';

export const goToVideoCallScreen = (data) => (dispatch) => {
    dispatch({
        type: GO_TO_VIDEO_CALL,
        data: data
    });
};

export const endVideoCall = () => (dispatch) => {
    dispatch({
        type: END_VIDEO_CALL
    });
};
