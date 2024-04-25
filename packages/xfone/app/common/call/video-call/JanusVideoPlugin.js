import { Janus } from 'react-native-janus';
import JanusPlugin from 'react-native-janus/utils/JanusPlugin';

class VideoPlugin extends JanusPlugin {
    constructor(janus) {
        super('janus.plugin.videocall', janus);
        this.emitOnMessage = null;
    }
    setEmitOnMessage = (callback) => {
        this.emitOnMessage = callback;
    };

    onMessage = async (message) => {
        console.log('[Video Call Plugin]: Receive Janus message: ', message);
        if (message.janus === 'event') {
            if (message?.plugindata?.data?.result?.event === 'incomingcall') {
                this.emitOnMessage({
                    event: 'incomingcall'
                });
            }
            if (message?.plugindata?.data?.result?.event === 'registered') {
                this.emitOnMessage({
                    event: 'registered'
                });
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
            console.log('[Video Call Plugin]: Hangup success');
            return;
        } catch (e) {
            console.log('[Video Call Plugin]: Hangup error: ', e);
        }
    };

    register = async (username) => {
        const request = {
            request: 'register',
            username
        };
        return this.send(request, () => {});
    };
}

export class JanusVideoPlugin {
    constructor(props) {
        this.props = props;
    }
    registerJanus = async () => {
        const { uriJanus, localUser } = this.props;
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
        await this.Janus.connect((e) => {
            console.log(
                '[Video Call Plugin]: Receive Janus socket message: ',
                e
            );
        });
        this.VideoPlugin = new VideoPlugin(this.Janus);
        await this.VideoPlugin.connect();
        await this.VideoPlugin.register(localUser);
        this.VideoPlugin.setEmitOnMessage(async (mes) => {
            this.props.janusListener(mes);
        });
    };
    // Người nhận từ chối cuộc gọi đến
    declinedIncomingCall = () => {
        this.VideoPlugin.hangup();
    };
}
