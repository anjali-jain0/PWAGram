
var addBtn = document.querySelector('#addbtn') ;
var createPostForm = document.querySelector('#createpost') ;

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

function openCreatePostPage() {
	createPostForm.style.display = 'block';
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