
var deferredPrompt;
var enableNotifications = document.querySelector('.enable-notifications');

if(navigator.serviceWorker){
	navigator.serviceWorker.register('/sw.js')
		.then(() => console.log('Service Worker registered'))
		.catch(err => console.log(err));
}

window.addEventListener('beforeinstallprompt' (e) => {
	console.log('beforeinstallprompt fired');
	e.preventDefault();
	deferredPrompt = e;
	return false;
});

function displayNotification{
	if(navigator.serviceWorker){
		var options = {
		body : 'You were successfully notified' ,
		//icon : './images/icons/app-icon-96x96.png',
		//image : './images/',
		dir : 'ltr',
		lang : 'en-US',
		vibrate : [100 , 50 , 200],
		//badge : './images/icons/app-icon-96x96.png',
		tag : 'confirm-notification',
		renotify : true,
		actions : [
			{action : 'confirm' , title : 'Okay' , icon : './images/icons/app-icon-96x96.png'}
			{action : 'coancel' , title : 'Cancel' , icon : './images/icons/app-icon-96x96.png'}
		]
		}
		navigator.serviceWorker.ready
			.then(sw => {
				sw.showNotification('Success Notification' , options);
			})
	}
	// var options = {
	// 	body : 'You were successfully notified'
	// }
	// new Notification('Success notification');
}

var reg;
function createPushSubscription(){
	if(!(navigator.serviceWorker))
		return;
	navigator.serviceWorker.ready
		.then(sw => {
			reg = sw;
			return sw.pushManager.getSubscription();
		})
		.then(sub => {
			if(sub === null){
				var vapidPublicKey = "BK9jsdM28cSfuBmb8BY57axtRsrEVng8OhemG4PU2T6ySkR_w1clWuZqfBa7JG78ThdBXOk5AVM8nWL7JLK8yhE";
				var convertedKey = urlBase64ToUint8Array(vapidPublicKey);
				reg.pushManager.subscribe({
					userVisibleOnly : true , 
					applicationServerKey : convertedKey
				});
			} else {

			}
		})
		.then(newSub => {
		return fetch('' , {
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json'
				},
				body : JSON.stringify(newSub)
			})
		})
		.then(res => {
			if(res.ok)
				displayNotification();
		})
		.catch(err => console.log(err));
}

function askNotificationPermission{
	Notification.requestPermission((result) => {
		console.log('Usr choice' , result);
		if(result !== 'granted') console.log('No notification permission provided');
	    else
	    	createPushSubscription();
	    	//displayNotification();
	});
}

if(window.Notification && navigator.serviceWorker){
	for(let i = 0 ; i < enableNotifications.length ; i++){
	enableNotifications[i].style.display = 'inline-block';
	enableNotifications[i].addEventListener('click',askNotificationPermission);
	}
}