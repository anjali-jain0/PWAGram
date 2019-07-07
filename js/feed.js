
var addBtn = document.querySelector('#addbtn') ;
var createPostForm = document.querySelector('#createpost') ;
var video = document.querySelector('#player');
var canvas = document.querySelector('#canvas');
var captureBtn = document.querySelector('#capture-btn');
var ImgPicker = document.querySelector('#img-picker');
var ImgPickerArea = document.querySelector('#img-picker-area');
var picture;

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
			ImgPickerArea.style.display = 'block';
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

function onSavePost(e) {
	console.log('clicked');
	if(window.caches){
	caches.open('user-called')
		.then(cache => {
			//cache.add()
		})
	}
}
function clearCard(){
	while(postsArea.hasChildNodes()){
		postsArea.removeChild(postArea.lastChild);
	}
}

function closeCreatePostPage(){
	ImgPickerArea.style.display = 'none';
	canvas.style.display = 'none';
	video.style.display = 'none';
}

function openCreatePostPage() {
	createPostForm.style.display = 'block';
	initializeMedia();
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

fetch(url)
	.then(res => {
		return res.json();
	})
	.then(data => {
		networkData = true;
		console.log(data);
		clearCard;
		//create-card
	});

if(window.caches){
	caches.match(url)
		.then(res => {
			if(res) return res.json();
		})
		.then(data => {
			console.log(data);
			if(!networkData){
			clearCard();
			//create-card
			}
		});
}

addBtn.addEventListener('click' , openCreatePostPage);