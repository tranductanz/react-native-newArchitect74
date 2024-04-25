import { ENUM } from '@constants';

export const authenState = {
    isFirstTime: true,
    isShowSplash: true,
    isSignIn: false,
    stackApp: ENUM.ENUM_STACK.SPLASH_STACK,
    isAuthened: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    token: null
};
