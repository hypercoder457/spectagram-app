import('dotenv/config');

export default {
    extra: {
        webClientId: process.env.WEB_CLIENT_ID,
        androidClientId: process.env.ANDROID_CLIENT_ID,
        expoClientId: process.env.EXPO_CLIENT_ID
    }
}