import { Mixins } from '@mwg-sdk/styles';
import { scaleFont } from './mixins';

export const FONT_FAMILY_BLACK = 'Inter-Black';
export const FONT_FAMILY_BOLD = 'Inter-Bold';
export const FONT_FAMILY_LIGHT = 'Inter-Light';
export const FONT_FAMILY_MEDIUM = 'Inter-Medium';
export const FONT_FAMILY_REGULAR = 'Inter-Regular';
export const FONT_FAMILY_SEMIBOLD = 'Inter-Semibold';
export const FONT_FAMILY_EXTRABOLD = 'Inter-ExtraBold';
export const FONT_FAMILY_EXTRALIGHT = 'Inter-ExtraLight';
export const FONT_FAMILY_THIN = 'Inter-Thin';

// FONT WEIGHT
export const FONT_WEIGHT_BLACK = '900';
export const FONT_WEIGHT_BOLD = '700';
export const FONT_WEIGHT_LIGHT = '300';
export const FONT_WEIGHT_MEDIUM = '500';
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_SEMIBOLD = '600';
export const FONT_WEIGHT_EXTRABOLD = '800';
export const FONT_WEIGHT_EXTRALIGHT = '200';
export const FONT_WEIGHT_THIN = '100';

// FONT SIZE

export const FONT_SIZE_11 = scaleFont(11);
export const FONT_SIZE_12 = scaleFont(12);
export const FONT_SIZE_13 = scaleFont(13);
export const FONT_SIZE_14 = scaleFont(14);
export const FONT_SIZE_15 = scaleFont(15);
export const FONT_SIZE_16 = scaleFont(16);
export const FONT_SIZE_17 = scaleFont(17);
export const FONT_SIZE_20 = scaleFont(20);
export const FONT_SIZE_22 = scaleFont(22);
export const FONT_SIZE_28 = scaleFont(28);
export const FONT_SIZE_34 = scaleFont(34);

// LINE HEIGHT
export const LINE_HEIGHT_13 = scaleFont(13);
export const LINE_HEIGHT_16 = scaleFont(16);
export const LINE_HEIGHT_18 = scaleFont(18);
export const LINE_HEIGHT_20 = scaleFont(20);
export const LINE_HEIGHT_21 = scaleFont(21);
export const LINE_HEIGHT_22 = scaleFont(22);
export const LINE_HEIGHT_25 = scaleFont(25);
export const LINE_HEIGHT_28 = scaleFont(28);
export const LINE_HEIGHT_34 = scaleFont(34);
export const LINE_HEIGHT_41 = scaleFont(41);

// FONT STYLE
export const FONT_REGULAR = {
    fontFamily: FONT_FAMILY_REGULAR,
    fontWeight: FONT_WEIGHT_REGULAR
};

export const TEXT_STYLE = {
    subHeadlineRegular: {
        fontFamily: FONT_FAMILY_REGULAR,
        fontSize: Mixins.scale(15),
        letterSpacing: Mixins.scale(-0.14),
        fontWeight: '400',
        lineHeight: Mixins.scale(20),
        color: '#323F4B'
    }
};
