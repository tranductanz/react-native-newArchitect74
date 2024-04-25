import Config from 'react-native-config';

const PRODUCT_MEDIA = 'mwg-app-media-service';

export const WEBSOCKET_URL = `${Config.WS}${Config.WS_PRE}`;
export const API_UPLOAD = `${Config.ERPHOST + PRODUCT_MEDIA}/api/media/upload`;
export const TOKEN_DEFAULT = Config.AUTHEN_KEY;
export const HOST_XFONE = `${Config.ERPHOST}${Config.SERVICE}`;

export const API_AUTH_TOKEN = `${Config.ERPHOST}${Config.SERVICE_AUTHEN}/oauth/token`;
export const API_AUTH_USER = `${Config.ERPHOST}${Config.SERVICE_AUTHEN}/api/auth`;
export const VERSION_APP = `${Config.ERPHOST}${Config.SERVICE_AUTHEN}/api/app/setting/get/byapp`;
export const RANDOM_VERSION_APP = `${Config.ERPHOST}${Config.SERVICE_AUTHEN}/api/app/setting/random`;
export const VERSION_APP_BY_NAME = `${Config.ERPHOST}${Config.SERVICE_AUTHEN}/api/app/setting/get/allAppByName`;

export const API_AUTH_TOKEN_VALIDATE = `${HOST_XFONE}/api/callcenter/user`;
export const API_JOIN_ROOM = `${HOST_XFONE}/api/callcenter/timekeeping/updateJoinOut`;
export const API_NOTIFICATIONS = `${HOST_XFONE}/api/callcenter/notification/list`;
export const API_SEEN_NOTIFI = `${HOST_XFONE}/api/callcenter/notification/seen`;
export const API_SEND_INFO_TMS = `${HOST_XFONE}/api/callcenter/tms/sendinfo`;
export const API_UNSUBSCRIBE_NOTIFI = `${HOST_XFONE}/api/notification/token/unsubscribe`;
export const API_CHECK_ROOM_EXIST =
    'https://erpapp.tgdd.vn/mwg-app-callcenter-service-beta/api/callcenter/janus/room/check';
export const API_PAUSE_NOTIFI = `${HOST_XFONE}/api/callcenter/timekeeping/update`;
export const API_INFO_ADDRESS = `${HOST_XFONE}/api/callcenter/timekeeping/list`;

export const API_SEARCH_USENAME = `${HOST_XFONE}/api/callcenter/user/search`;

export const API_FILE_IMAGE =
    'https://devcallcenter.tgdd.vn/mwg-app-media-service/api/media/file/';

export const API_FILE_UPLOAD_IMAGE =
    'https://devcallcenter.tgdd.vn/mwg-app-media-service/api/media/upload';

export const API_USER_AVATAR =
    'https://wscallcenter.tgdd.vn/user-service/api/user';

export const PATH_USER_AVATAR =
    'https://wsticket.tgdd.vn/user-service/api/user/profile/image/';

export const GET_VIDEO_CALL_TOKEN_INSTANT2 = `${Config.ERPHOST}/mwg-app-callcenter-video-service-beta/api/callcenter/janus/get/test`;
export const GET_VIDEO_CALL_TOKEN_INSTANT1 =
    'https://wscallcenter.tgdd.vn/mwg-app-callcenter-video-service/api/callcenter/janus/get';

// Livestream
export const SHOPTAINMENT =
    Config.ENV === 'staging'
        ? 'mwg-app-data-shopatainment-service-staging/api/v1/shoppertaiment/'
        : 'mwg-app-data-shopatainment-service/api/v1/shoppertaiment/';
export const SUBSCRIBE_LIVESTREAM = `https://betaerp.tgdd.vn/mwg-app-ovenmedia-service/api/media/subscribe`;
export const GET_LIVESTREAM_LINK = `https://betaerp.tgdd.vn/mwg-app-ovenmedia-service/api/media/getLink`;
export const GET_LIST_PERMISSION_BY_USERNAME = `${Config.ERPHOST}${SHOPTAINMENT}permission/getListPermissionByUserName`;
