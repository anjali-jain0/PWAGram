
var deferredPrompt;

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