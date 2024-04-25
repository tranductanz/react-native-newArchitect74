var globalState = {
    nameModule: null,
    versionModule: null,
    namePlugin: null
};

const globalReducer = function (state = globalState, action) {
    switch (action.type) {
        case 'SET_NAME_MODULE':
            return {
                ...state,
                nameModule: action.payload.nameModule,
                versionModule: action.payload.versionModule,
                namePlugin: action.payload.namePlugin
            };

        default:
            return state;
    }
};

export { globalReducer };
