
importScripts('./js/idb.js');
importScripts('./js/utility.js');

var staticCache = 'static-v1';
var dynamicCache = 'dynamic-v1';
var assests = {

};

self.addEventListener('install' , e => {
	console.log('Service Worker installed');
	e.waitUntil(
		caches.open(staticCache)
		.then(cache => {
			console.log('SW - Precaching files')
			cache.addAll('./js/app.js')
		})
	)
});

self.addEventListener('activate' , e => {
	console.log('Service Worker activated');
	e.waitUntil(
		caches.keys()
			.then(keyList => {
				return Promise.all(
					keyList.map(key => {
						if(key !== 'staticCache' && key !== 'dynamicCache'){
							console.log('SW -removing old cache' , key);
							return cache.delete(key);
						}
					})
				)
			})
		)
	return self.clients.claim();
});

// self.addEventListener('fetch' , e => {
// 	console.log('Service Worker fetching');
// 	e.respondWith(
// 		caches.match(e.request)
// 			.then(res => {
// 				if(res) return res;
// 				else{
// 					return fetch(e.request)
// 						.then(res => {
// 							caches.open(dynamicCache)
// 								.then(cache => {
// 									cache.put(e.request.url , res.clone());
// 									return res;
// 								})
// 						})
// 						.catch(err => {
// 							return caches.open(staticCache)
// 									.then(cache =>{
// 										return caches.match('./html/offline.html');
// 									})
// 						});
// 				}

// 			})
// 		);
// });

function isInArray(st , arr){
	for(let i = 0 ; i < arr.length ; i++){
		if(arr[i] === st) return true;
	}
	return false;
}

self.addEventListener('fetch' , e => {
	console.log('Service Worker fetching');
	//var url = '';
	//if(e.request.url.indexOf(url) > -1){
	e.respondWith(
		////caches.open(dynamicCache)
			//.then(cache => 
				//return 
				fetch(e.request)
						.then(res => {
							//cache.put(e.request , res.clone());
							var clonedRes = res.clone();
							clearAllData('posts')
								.then(() => {
									return clonedRes.json();
								})
								.then(data => {
									for(var key in data){
										writeData('posts' , data[key])
											// .then(() => {
											// 	deleteItemFromData('posts' , key);
											// });
									}
								});
							return res;
			})
	)
	//) //} else if (isInArray(e.request.url , assests)){
				// e.respondWith(
				// 	caches.match(e.request)
				// 	)
	// } else {
			//e.respondWith(
			// caches.match(e.request)
			// .then(res => {
			// 	if(res) return res;
			// 	else{
			// 		return fetch(e.request)
			// 			.then(res => {
			// 				caches.open(dynamicCache)
			// 					.then(cache => {
			// 						cache.put(e.request.url , res.clone());
			// 						return res;
			// 					})
			// 			})
			// 			.catch(err => {
			// 				return caches.open(staticCache)
			// 						.then(cache =>{
			// 							return caches.match('./html/offline.html');
			// 						})
			// 			});
			// 	}

			// })
		    //);
		//}
});

self.addEventListener('notificationclick' , (e) => {

	var notification = e.notification;
	var action = e.action;

	console.log(notification);
	if(action === 'confirm'){
		console.log('confirm was clicked');
		notification.close();
	} else {
		console.log(action);
		e.waitUntil(
			clients.matchAll()
				.then(clis => {
					var client = clis.find((c) => {
						return c.visibilityState === 'visible';					
					});
					if(client !== undefined){
						client.navigate('http://localhost:8080');
						client.focus();
					} else {
						clients.openWindow('http://localhost:8080');
					}
					notification.close();
				})
			);
	}
});

self.addEventListener('notificationclose' e => {
	console.log('notification was closed' e);
});

self.addEventListener('push' e => {
	console.log('Push notification received' , e);
	var data = {title : 'New!' , content : 'Something new happened'};
	if(e.data){
		data = JSON.parse(e.data.text());
	}
	var options = {
		body : data.content,
		//icon : './images/icons/app-icon-96x96.png',
		//badge : './images/icons/app-icon-96x96.png',
	};

	e.waitUntil(
		self.registration.showNotification(data.title , options)
	);
});

self.addEventListener('sync' , e => {
	if(e.tag === 'sync-new-post'){
		console.log('Syncing new posts');
		e.waitUntil(
			readAllData('sync-posts')
				.then(data => {
					for(var dt of data){
						fetch('' , {
							method : 'POST',
							headers : {
								'Content-Type' : 'application/json',
								'Accept' : 'application/json'
							},
							body : JSON.stringify({
								id : dt.id,
								title : dt.title,
								location : dt.location,
								image : ''
							})
						})
						.then(res => {
							console.log('Send data' , res);
							if(res.ok) deleteItemFromData('sync-posts' , dt.id);
						})
						.catch(err => console.log(err));
					}
				})
		)
	}
});
































