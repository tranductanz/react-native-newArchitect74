import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

/**
 * Hiển thị modal bottom sheet
 * @param {useRef}  modalRef
 */
const MyBottomSheet = ({
    modalRef,
    snapPointsArray = ['25%', '50%'], //chiều cao từ dưới lên của bottom sheet, sắp xếp tăng dần
    header,
    children,
    haveBackDrop = true,
    borderRadius = 12,
    backgroundColor = 'white',
    scrollViewStyle = {},
    keyboardShouldPersistTaps,
    flatListInside = false,
    ...props
}) => {
    const snapPoints = useMemo(() => snapPointsArray, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // có cái này để nó hiển thị overlay
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        []
    );

    const BottomSheetBackground = ({ style }) => {
        return (
            <View
                style={[
                    {
                        backgroundColor: backgroundColor,
                        borderRadius: borderRadius
                    },
                    { ...style }
                ]}
            />
        );
    };

    // renders
    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                backgroundComponent={(props) => (
                    <BottomSheetBackground {...props} />
                )}
                keyboardBlurBehavior={'restore'}
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true}
                ref={modalRef}
                index={1} // index của snappoint muốn hiện lên đầu tiên
                snapPoints={snapPoints}
                backdropComponent={haveBackDrop ? renderBackdrop : () => {}}
                {...props}>
                <NativeViewGestureHandler disallowInterruption={true}>
                    <View style={{ flex: 1 }}>
                        {header}
                        {flatListInside ? (
                            children
                        ) : (
                            <BottomSheetScrollView
                                keyboardShouldPersistTaps={
                                    keyboardShouldPersistTaps ?? 'never'
                                }
                                style={scrollViewStyle}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}>
                                {children}
                            </BottomSheetScrollView>
                        )}
                    </View>
                </NativeViewGestureHandler>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

export default MyBottomSheet;
