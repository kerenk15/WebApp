window.onload = UTILS.ajax('../js/notification.txt', {
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

var funcRef = function(){
var hash = location.hash.slice(1),
	tabs = document.querySelectorAll('.tabs > div'),
	link = document.querySelector('.tabs > ul > li > a');

if (hash === '') {
	hash = link.href.split('#')[1];
}

for (var i = 0; i < tabs.length; i++) {
	tabs[i].className = 'hidden';
}

document.querySelector('#pre-fix-' + hash).className = '';

};



/*if (hash === '') {
	hash = link.href.split('#')[1];
}

for (var i = 0; i < tabs.length; i++) {
	UTILS.className(tabs[i] , hidden);
}

UTILS.className(document.querySelector('#' + hash) , '');
};*/

/*var funcRef = function(){
var hash = location.hash.slice(1),
	tabs= document.querySelectorAll('.tabs > div');
for (var i = 0; i < tabs.length; i++) {
	tabs[i].className = 'hidden';
}
document.querySelector('#' + hash).className = '';
};*/
