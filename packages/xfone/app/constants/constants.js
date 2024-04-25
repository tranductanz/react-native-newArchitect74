import { Dimensions } from 'react-native';
import Config from 'react-native-config';
export const ISDEV = Config.ENV === 'dev';
export const ISSTAGING = Config.ENV === 'staging';
export const ISPRODUCTION = Config.ENV === 'production';
export const ISLIVE = Config.ENV === 'live';

export const { width } = Dimensions.get('screen');
