/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
import { Dimensions, PixelRatio, StatusBar, Platform } from 'react-native';

export const { width, height } = Dimensions.get('window');
const standardLength = width > height ? width : height;

const offset =
    width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight =
    Platform.OS === 'android' ? standardLength - offset : standardLength;

const guidelineBaseWidth = 375; // iPhone 6 width

const guidelineBaseHeight = 812; // Depend on design

export const scaleSize = (size) => (width / guidelineBaseWidth) * size;

export const scaleFont = (size) => size;

export function getFontsByScreenHeight(
    fontSize,
    standardScreenHeight = guidelineBaseHeight
) {
    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
}

const scale = (size) =>
    PixelRatio.roundToNearestPixel((width / guidelineBaseWidth) * size);
const verticalScale = (size) =>
    PixelRatio.roundToNearestPixel((deviceHeight / guidelineBaseHeight) * size);
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
export const getScaleWithWidth = (number) => {
    console.log('getScaleWithWidth :: ', number);
    return (number * height) / guidelineBaseHeight / 2;
};
export const scaleImage = (
    _width,
    _height,
    fullWidth = false,
    fullHeight = false
) => {
    let scaleWidth;
    let scaleHeight;
    if (fullWidth) {
        scaleWidth = width;
        scaleHeight = (_height * deviceHeight) / guidelineBaseHeight;
    } else if (fullHeight) {
        scaleHeight = deviceHeight;
        scaleHeight = (_width * width) / guidelineBaseWidth;
    } else {
        scaleHeight = (_height * deviceHeight) / guidelineBaseHeight;
        scaleWidth = (_width * width) / guidelineBaseWidth;
    }
    return {
        width: Math.round(scaleWidth),
        height: Math.round(scaleHeight)
    };
};

function dimensions(top, right = top, bottom = top, left = right, property) {
    const styles = {};

    styles[`${property}Top`] = top;
    styles[`${property}Right`] = right;
    styles[`${property}Bottom`] = bottom;
    styles[`${property}Left`] = left;

    return styles;
}

export function margin(top, right, bottom, left) {
    return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top, right, bottom, left) {
    return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
    color,
    offset = { height: 2, width: 2 },
    radius = 8,
    opacity = 0.2
) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius
    };
}
