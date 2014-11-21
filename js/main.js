//loading notifications//
window.onload = (function() {

	UTILS.ajax('../js/notification.txt', {
				method:'GET',
				done: function(response){
						console.log(response);
						var i , p = '<p>' + response + '</p>';
						console.log(p.length);

						if(response.length <= 1){
							document.querySelector('#notifications').style.display = 'none';
							}
						else{
							document.querySelector('#notifications').innerHTML = p;
						}
					}
			});
})();


//tabs//
var funcRef = function(){
var hash = location.hash.slice(1),
	tabs = document.querySelectorAll('.tabs > div'),
	link = document.querySelector('.tabs > ul > li > a'),
	Activelink = document.querySelectorAll('.tabs > ul > li > a');

if (hash === '') {
	hash = link.href.split('#')[1];
	console.log(hash);
}

for (var i = 0; i < tabs.length; i++) {
	tabs[i].className = 'hidden';
	Activelink[i].parentNode.id = '';
	if (Activelink[i].href.split('#')[1] === hash)
		Activelink[i].parentNode.id = 'active';
}

document.querySelector('#pre-fix-' + hash).className = '';
};


//accessibility with keyboard//
var tabs_list = document.querySelector('.tabs_list');
console.log(tabs_list);

tabs_list.addEventListener('keydown', function(e){
console.log(e.keyCode);
var target = e.target;

if (target.tagName.toUpperCase() === 'LI'){
	if (e.keyCode === 13 || e.keyCode === 32){
		e.preventDefault();
		console.log(target.tagName);
		funcRef();
	}
}
});

/*
for (var i = 0; i < tabs.length; i++) {
	UTILS.className(tabs[i] , hidden);
}

UTILS.className(document.querySelector('#' + hash) , '');
};*/

//icon functionality//
var links = document.querySelectorAll(".links");
console.log(links);

for (var i = 0; i < links.length; i++) {
	links[i].addEventListener('click',checkIcon);
}

function checkIcon(e){
	var targetTab = e.currentTarget.parentNode, //tab node
		targetLink = e.target.parentNode;//'A' node when clicking img
		/*console.log(targetLink.className , targetTab,tabID, form);*/

	if (targetLink.className === 'settings'){ //if clicked settings
		settings(targetTab);
	}

	if (targetLink.className === 'expand'){
		console.log('expand');
	}



}

function settings(targetTab){
	var z = false,// form not hidden
		addClass = [],// form class array
		form = document.querySelector('.reports-form'),//call form under spesific tab
		tabID = targetTab.id; // tab ID

	addClass = form.className.split(" "); // add to array class name
	console.log(addClass[0]);
	for (var j = 0; j < addClass.length; j++) {
		if (addClass[j] === 'hidden'){
			z = true; // if class name hidden
			addClass.pop().toString();// delete hidden and turn to string
		}
	}
	if (z === false) //if no hidden
		form.className = (form.className + ' ' + 'hidden');

	else{
		form.className = (addClass);
	}
		console.log(form.className);
}




/*var expand = document.querySelectorAll('.expand');
console.log(expand);
for (var j= 0; j < expand.length; j++) {
	expand[j].addEventListener('click',openURL);
}

var openURL = function (e){
	console.log(expand[j]);
var target = e.target,
	url = terget.href,
	iframe = window.frames['#ynet'];
e.preventDefault();
target = ('_blank');

url = iframe.src;

};*/
