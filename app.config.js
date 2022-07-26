import 'dotenv/config';

export default ({ config }) => {
    return {
        ...config,
        extra: {
            webClientId: process.env.WEB_CLIENT_ID,
            expoClientId: process.env.EXPO_CLIENT_ID
        },
    }
}    
