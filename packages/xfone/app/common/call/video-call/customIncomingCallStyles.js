import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        paddingTop: 48
    },
    headerBg: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarBorder: {
        width: 160,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 240,
        marginTop: 80
    },
    avatar: {
        width: 152,
        borderRadius: 152 / 2,
        aspectRatio: 1,
        resizeMode: 'cover'
    },
    userName: {
        marginTop: 8,
        color: '#fff',
        height: 32
        // fontFamily: 'Quicksand-Bold'
    },
    userID: {
        marginTop: 4,
        color: '#fff'
    },
    controlWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10%'
    },
    controlBtn: {
        width: 68,
        aspectRatio: 1,
        borderRadius: 120,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 64
    },
    controlBtnText: { color: '#fff', marginTop: 8 }
});
