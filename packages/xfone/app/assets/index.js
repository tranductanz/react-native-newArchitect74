import { Mixins } from '@mwg-sdk/styles';

const images = {
    ic_retryic: require('./images/ic_retryic.png'),
    animation_not_found: require('./images/animation_not_found.json'),
    ic_blue_back: require('./images/ic_blue_back.png'),
    logo: require('./images/logo.png'),
    animation_loading_1: require('./images/animation_loading_1.json'),
    animation_loading_2: require('./images/animation_loading_2.gif'),
    animation_loading_3: require('./images/animation_loading_3.json'),
    ic_tab_history: require('./images/ic_tab_history.png'),
    ic_tab_profile: require('./images/ic_tab_profile.png'),
    ic_tab_dial: require('./images/ic_tab_dial.png'),
    ic_tab_dashboard: require('./images/ic_tab_dashboard.png'),
    ic_login_logo: require('./images/ic_login_logo.png'),
    ic_splash: require('./images/ic_splash.png'),
    ic_create_room: require('./images/ic_create_room.png'),
    ic_link_group: require('./images/ic_link_group.png'),
    ic_livestream: require('./images/ic_livestream.png'),
    ic_call: require('./images/ic_call.png'),
    ic_chat: require('./images/ic_chat.png'),
    animation_loading: require('./images/animation_loading.json'),
    ic_check: require('./images/ic_check.png'),
    ic_bell: require('./images/ic_bell.png'),
    ic_home_call: require('./images/ic_home_call.png'),
    ic_home_message: require('./images/ic_home_message.png'),
    ic_home_profile: require('./images/ic_home_profile.png'),
    ic_search: require('./images/ic_search.png'),
    ic_call_miss: require('./images/ic_call_miss.png'),
    ic_call_reciver: require('./images/ic_call_reciver.png'),
    ic_call_request: require('./images/ic_call_request.png'),
    ic_hide_password: require('./images/ic_hide_password.png'),
    ic_show_password: require('./images/ic_show_password.png'),
    ic_launcher: require('./images/ic_launcher.png'),
    ic_home_call_act: require('./images/ic_home_call_act.png'),
    ic_home_profile_act: require('./images/ic_home_profile_act.png'),
    ic_tab_dashboard_act: require('./images/ic_tab_dashboard_act.png'),
    ic_keyboard: require('./images/ic_keyboard.png'),
    ic_keyboard_act: require('./images/ic_keyboard_act.png'),
    ic_logout: require('./images/ic_logout.png'),
    ic_help: require('./images/ic_help.png'),
    ic_right: require('./images/ic_right.png'),
    ic_x: require('./images/ic_x.png'),
    ic_input_user: require('./images/ic_input_user.png'),
    ic_input_password: require('./images/ic_input_password.png'),
    ic_video_call: require('./images/ic_video_call.png'),
    ic_remove_number: require('./images/ic_remove_number.png'),
    ic_sso: require('./images/ic_sso.png'),
    ic_bg_splashscreen: require('./images/ic_bg_splashscreen.png'),
    ic_logo_spash: require('./images/ic_logo_spash.png'),
    ic_call_right_spash: require('./images/ic_call_right_spash.png'),
    ic_call_spash: require('./images/ic_call_spash.png'),
    ic_cloud_splash: require('./images/ic_cloud_splash.png'),
    ic_ring: require('./images/ic_ring.png'),
    ic_error: require('./images/ic_error.png')
};

const fonts = {
    Inter: {
        bold: 'Inter-Bold',
        regular: 'Inter-Regular',
        semiBold: 'Inter-SemiBold'
    }
};

const textStyle = {
    boldCallout: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(16),
        fontWeight: '500'
    },
    regularBody: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(17),
        fontWeight: '400'
    },
    regularSubHeadline: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(15),
        fontWeight: '400'
    },
    regularCaption1: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(12),
        fontWeight: '400'
    },
    boldLargeTitle: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(34),
        fontWeight: '700'
    },
    regularFootnote: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(13),
        fontWeight: '400'
    },
    boldBody: {
        fontFamily: fonts.Inter.regular,
        fontSize: Mixins.scale(17),
        fontWeight: '600'
    }
};

export { images, textStyle };
