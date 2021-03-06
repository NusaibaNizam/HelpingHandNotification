'use-strict'


const functions = require('firebase-functions');
const admin= require('firebase-admin');
admin.initializeApp(functions.config().firebase);



exports.sendNotification = functions.database.ref('/Notifications/{receiver_user_id}/{notification_id}')
.onWrite(event=>
{
	const receiver_user_id = context.params.receiver_user_id;
	const notification_id = context.params.notification_id;


	console.log('We have a notification to send to :' , receiver_user_id);


	if (!data.after.val()) 
	{
		console.log('A notification has been deleted :' , notification_id);
		return null;
	}

	const DeviceToken = admin.database().ref(`/Users/${receiver_user_id}/device_token`).once('value');
	const Notification = admin.database().ref(`'/Notifications/${receiver_user_id}/${notification_id}/notification`).once('value');

	return Promise.all([DeviceToken, Notification]).then(result => 
	{
		const token_id = result[0].val();
		const msg = result[1].val();

		const payload = 
		{
			notification:
			{
				title: "Helping Hand",
				body: msg,
				icon: "default"
			}
		};

		return admin.messaging().sendToDevice(token_id, payload)
		.then(response => 
			{
				console.log('This was a notification feature.');
            return true;
			});
        
	});
});
