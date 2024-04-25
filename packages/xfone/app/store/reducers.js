import { combineReducers } from 'redux';
import { profileReducer } from '../container/Profile/reducer';
import { authenReducer } from '../container/Splash/reducer';
import { videoCallReducer } from '../common/call/video-call/reducer';
import { audioCallReducer } from '../common/call/audio-call/reducer';
import { auth } from '../container/Login/reducer';
const rootReducer = combineReducers({
    profileReducer,
    authenReducer,
    videoCallReducer,
    audioCallReducer,
    auth
});

export { rootReducer };
