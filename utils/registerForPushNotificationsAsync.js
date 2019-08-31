import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { fetch } from './dataAccess';

export default async function registerForPushNotificationsAsync(identity, {token}) {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let expoToken = await Notifications.getExpoPushTokenAsync();

    let headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(`waiting_lines/${identity}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify({
            expoToken
        }),
    });
}
