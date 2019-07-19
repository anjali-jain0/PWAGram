
var addBtn = document.querySelector('#addbtn') ;
var createPostForm = document.querySelector('#createpost') ;
var video = document.querySelector('#player');
var canvas = document.querySelector('#canvas');
var captureBtn = document.querySelector('#capture-btn');
var imgPicker = document.querySelector('#img-picker');
var imgPickerArea = document.querySelector('#img-picker-area');
var picture;
var locationBtn = document.querySelector('#location-btn');
var locationLoader = document.querySelector('#location-loader');
var fetchedLocation;
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');

locationBtn.addEventListener('click' , e => {

	if(!(navigator.geolocation))
		return;

	locationBtn.style.display = 'none';
	locationLoader.style.display = 'block';

	navigator.geolocation.getCurrentPosition(position => {
		locationBtn.style.display = 'inline';
		locationLoader.style.display = 'none';
		fetchedLocation = {lat : position.coords.latitude , lng : 0};
		locationInput.value = 'In Gwalior';
		//.classList.add('is-focused');
	} , err => {
		console.log(err);
		locationBtn.style.display = 'inline';
		locationLoader.style.display = 'none';
		alert('Could not fetch location , please enter manually!');
		fetchedLocation = {lat : 0 , lng : 0};
	} , {timeout : 7000});
});

function initializeLocation(){
	if(!(navigator.geolocation))
		locationBtn.style.display = 'none';

}

function initializeMedia(){
	if(!navigator.mediaDevices){
		navigator.mediaDevices = {};
	}
	if(!(navigator.mediaDevices.getUserMedia)){
		navigator.mediaDevices.getUserMedia = (constraints) => {
			var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if(!getUserMedia){
				return Promise.reject(new Error('getUserMedia error'));
			}
			return new Promise((resolve,reject){
				getUserMedia.call(navigator , constraints , resolve , reject);
			});
		}
	}
	navigator.mediaDevices.getUserMedia({video : true})
		.then(stream => {
			video.src = stream;
			video.style.display = 'block';
		})
		.catch(err => {
			imgPickerArea.style.display = 'block';
		})
}

captureBtn.addEventListener('click' , e => {
	canvas.style.display = 'block';
	video.style.display = 'none';
	captureBtn.style.display = 'none';
	var context = canvas.getContext('2d');
	context.drawImage(video , 0 , 0 , canvas.width , 
		video.videoHeight / (video.videoWidth / canvas.width));
	video.src.getVideoTracks().forEach(track => {
		track.stop();
	});
	picture = dataURItoBlob(canvas.toDataURL());
});

imgPicker.addEventListener('change' , (e) => {
	picture = e.target.files[0];
})

function onSavePost(e) {
	console.log('clicked');
	if(window.caches){
	caches.open('user-called')
		.then(cache => {
			//cache.add()
		})
	}
}

function createCard(data){

	var cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow-2dp';
	var cardTilte = document.createElement('div');
	cardTilte.className = 'mdl-card_title';
	cardTilte.style.backgroundImage = 'url(' + data.image + ')';
	cardTilte.style.backgroundSize = cover;
	cardTilte.style.height = '180px';
	cardWrapper.appendChild(cardTilte);
	var cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.style.color = 'white';
	cardTitleTextElement.className = 'mdl-card_title-text';
	cardTitleTextElement.textContent = data.title;
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card_supporting-text';
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = 'center';
	cardWrapper.appendChild(cardSupportingText);
	//componentHandler
	//shared
}

function clearCard(){
	while(postsArea.hasChildNodes()){
		postsArea.removeChild(postArea.lastChild);
	}
}

function closeCreatePostPage(){
	imgPickerArea.style.display = 'none';
	canvas.style.display = 'none';
	video.style.display = 'none';
	locationBtn.style.display = 'inline';
	locationLoader.style.display = 'none';
}

function openCreatePostPage() {
	createPostForm.style.display = 'block';
	initializeMedia();
	initializeLocation();
	if(deferredPrompt){
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then(choice => {
			console.log(choice.outcome);
			if(choice.outcome === 'dismissed')
				console.log('Usr cancelled');
			else
				console.log('Usr added');
		});
		deferredPrompt = null;
	}
}

//var url = '';
var networkData = false;

function updateUI(data){
	clearCard();
	for(var i = 0 ; i < data.length ; i++){
		createCard(data[i]);
	}
}

fetch(url)
	.then(res => {
		return res.json();
	})
	.then(data => {
		networkData = true;
		console.log(data);
		//create-card
		var dataArray = [];
		for(var key in data){
			dataArray.push(data[key]);
		}
		updateUI(dataArray);
	});

// if(window.caches){
// 	caches.match(url)
// 		.then(res => {
// 			if(res) return res.json();
// 		})
// 		.then(data => {
// 			console.log(data);
// 			if(!networkData){
// 			//create-card
// 			var dataArray = [];
// 			for(var key in data){
// 				dataArray.push(data[key]);
// 			}
// 			updateUI(dataArray);
// 			}
// 		});
// }

if('indexedDB' in  window){
	readAllData('posts')
		.then(data => {
			if(!networkData){
				console.log('From cache' , data);
				updateUI(data);
			}
		});
}

function sendData(){
	fetch('' , {
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json',
			'Accept' : 'application/json'
		},
		body : JSON.stringify({
			id : new Date().toISOString(),
			title : titleInput.value,
			location : locationInput.value,
			image : ''
		})
	})
	.then(res => {
		console.log('Send data' , res);
		updateUI();
	})
}

form.addEventListener('submit' , (e) => {
	e.preventDefault();
	if(titleInput.value.trim() === '' || locationInput.value.trim() === ''){
		alert('Please enter valid data');
		return;
	}
	closeCreatePostPage();
	if(navigator.serviceWorker && window.SyncManager){
		navigator.serviceWorker.ready
			.then(sw => {
				var post = {
					id: new Date().toISOString(),
					title: titleInput.value,
					location: locationInput.value
				};
				writeData('sync-posts' , post)
					.then(() => {
						return sw.sync.register('sync-new-post');
					})
					.then(() => {
						var snackbarContainer = document.querySelector('#confirmation-notice');
						var data = {message : 'Your post was saved for syncing!'};
						snackbarContainer.MaterialSnackbar.showSnackbar(data);
					})
					.catch(err => console.log(err));
			});
	} else {
		sendData();
	}
});

addBtn.addEventListener('click' , openCreatePostPage);