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


var settings = document.querySelectorAll('.settings');
console.log(settings);

for (var i = 0; i < settings.length; i++) {
	settings[i].addEventListener('click',checkClass);
}

var checkClass =  function(e){
	console.log('setting clicked');
	console.log(settings[i].className);
	/* = className + hidden;e.preventDefault();*/








};


})();


var funcRef = function(){
var hash = location.hash.slice(1),
	tabs = document.querySelectorAll('.tabs > div'),
	link = document.querySelector('.tabs > ul > li > a'),
	Activelink = document.querySelectorAll('.tabs > ul > li > a');

if (hash === '') {
	hash = link.href.split('#')[1];
}

for (var i = 0; i < tabs.length; i++) {
	tabs[i].className = 'hidden';
	Activelink[i].parentNode.id = '';
	if (Activelink[i].href.split('#')[1] === hash)
		Activelink[i].parentNode.id = 'active';
}

document.querySelector('#pre-fix-' + hash).className = '';
};

/*var tabs_list = document.querySelectorAll('.tabs > ul > li > a');
console.log(tabs_list);
tabs_list.addEventListener('keyup', function(){
console.log(e.keyCode);
	if (e.keyCode === 13 || e.keyCode === 32){
		e.preventDefault();
		funcRef();
	}
});*/

/*
for (var i = 0; i < tabs.length; i++) {
	UTILS.className(tabs[i] , hidden);
}

UTILS.className(document.querySelector('#' + hash) , '');
};*/



var expand = document.querySelectorAll('.expand');
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

};
