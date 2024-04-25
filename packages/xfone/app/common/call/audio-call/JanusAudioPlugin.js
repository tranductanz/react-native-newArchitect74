import { Janus } from 'react-native-janus';
import JanusPlugin from 'react-native-janus/utils/JanusPlugin';
import { mediaDevices } from 'react-native-webrtc';

class AudioPlugin extends JanusPlugin {
    constructor(janus) {
        super('janus.plugin.sip', janus);
        this.emitOnMessage = null;
    }
    setEmitOnMessage = (callback) => {
        this.emitOnMessage = callback;
    };

    onMessage = async (message) => {
        console.log(
            '[Audio Call Plugin]: Receive Janus message: ',
            JSON.stringify(message)
        );
        if (message.janus === 'event') {
            switch (message?.plugindata?.data?.result?.event) {
                case 'should_destroy':
                    this.emitOnMessage({
                        event: 'should_destroy',
                        data: {
                            oldSessionID:
                                message?.plugindata?.data.result.sessionid,
                            currentSessionID: message.session_id
                        }
                    });
                    break;
                case 'registered':
                    this.emitOnMessage({
                        event: 'registered'
                    });
                    break;
                case 'calling':
                    this.emitOnMessage({
                        event: 'calling'
                    });
                    break;
            }
        }
    };

    hangup = async () => {
        try {
            await this.janus.socket.sendAsync({
                janus: 'hangup',
                session_id: this.janus.socket.sessionID,
                handle_id: this.handleID
            });
            this.janus.socket.detachPlugin(this);
            this.janus.destroy();
            console.log('[Audio Call Plugin]: Hangup success');
            return;
        } catch (e) {
            console.log('[Audio Call Plugin]: Hangup error: ', e);
        }
    };

    register = async (username) => {
        const request = {
            request: 'register',
            username
        };
        return this.send(request, () => {});
    };

    call = async (stream, request) => {
        return new Promise(async (resolve, reject) => {
            try {
                stream.getTracks().forEach((track) => {
                    this.pc.addTrack(track, stream);
                });

                const offer = await this.pc.createOffer();
                await this.pc.setLocalDescription(offer);
                const response = await this.sendAsyncWithJsep(request, {
                    type: offer.type,
                    sdp: offer.sdp
                });
                resolve();
            } catch (e) {
                console.log('[Audio Call Plugin]: configure error ', e);
                reject(e);
            }
        });
    };

    destroyOldSession = (oldSessionID, currentSessionID, callback) => {
        this.janus.socket.sendAsync(
            {
                janus: 'destroy',
                session_id: oldSessionID,
                current_session_id: currentSessionID
            },
            callback
        );
    };
}

export class JanusAudioPlugin {
    constructor(props) {
        this.props = props;
        this.localStream = null;
    }

    getLocalstream = async () => {
        const media = await mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        this.localStream = media;
    };

    registerJanus = async () => {
        const { uriJanus, profile } = this.props;
        const { authuser, proxy, secret, username } = profile;
        this.Janus = new Janus(uriJanus);
        this.Janus.setApiSecret('janusrocks');
        this.Janus.setIceServers([
            {
                urls: 'turn:stun.tgdd.vn:3478',
                username: 'websip',
                credential: 'websip'
            },
            { urls: 'stun:stun.tgdd.vn:3478' }
        ]);
        await this.getLocalstream();
        await this.Janus.connect((e) => {
            console.log(
                '[Audio Call Plugin]: Receive Janus socket message: ',
                e
            );
        });
        this.AudioPlugin = new AudioPlugin(this.Janus);
        await this.AudioPlugin.connect();
        this.register = {
            request: 'register',
            authuser,
            proxy,
            secret,
            username
        };
        this.AudioPlugin.send(this.register, () => {});

        this.AudioPlugin.setEmitOnMessage((mes) => {
            this.props.janusListener(mes);
            switch (mes.event) {
                case 'should_destroy':
                    this.AudioPlugin.destroyOldSession(
                        mes.data.oldSessionID,
                        mes.data.currentSessionID,
                        this.AudioPlugin.send(this.register, () => {})
                    );
                    break;
                case 'registered':
                    this.startCall();
                    break;
            }
        });
    };

    startCall = async () => {
        const { remoteUserID } = this.props.profile;
        try {
            const dataCall = {
                request: 'call',
                uri: remoteUserID
            };
            await this.AudioPlugin.createPeer();
            this.AudioPlugin.call(this.localStream, dataCall);
            console.log('[Audio Call Plugin]: Start Call success');
        } catch (error) {
            console.log('Error when start call ', error);
        }
    };

    declinedIncomingCall = () => {
        this.AudioPlugin.hangup();
    };
}
