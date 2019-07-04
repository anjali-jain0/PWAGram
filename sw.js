
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
		caches.open(dynamicCache)
			.then(cache => 
				return fetch(e.request)
						.then(res => {
							cache.put(e.request , res.clone());
							return res;
			})
	)) //} else if (isInArray(e.request.url , assests)){
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



