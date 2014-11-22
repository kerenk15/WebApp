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

for (var i = 0; i < links.length; i++) {
	links[i].addEventListener('click',checkIcon);
}

function checkIcon(e){
	var targetTab = e.currentTarget.parentNode, //tab node / form
		targetLink = e.target;// img / cancel link
		console.log( targetTab ,targetLink.className);

	if (targetLink.parentNode.className === 'settings'){ //if clicked settings in 'a' node
		settings(targetTab);
	}

	if (targetLink.parentNode.className === 'expand'){
		console.log('expand');
	}

	if (targetLink.className === 'cancel'){
		settings(targetTab.parentNode); //tab node
	}

}

//seeting icon
function settings(targetTab){
	var classNameArr = [],// form class array
		tabID = targetTab.id, // tab ID
		form = document.querySelector( '#pre-fix-quick-reports > form');//call form under spesific tab

	classNameArr = form.className.split(" "); // add to array class name

	if (hideForm(classNameArr)) //if hidden
		form.className = (classNameArr);
	else{
		form.className = (form.className + ' ' + 'hidden');
	}
		console.log(form.className);
}


//hide form
function hideForm(classNameArr){
	for (var j = 0; j < classNameArr.length; j++) {
		if (classNameArr[j] === 'hidden'){
			classNameArr.pop().toString();// delete hidden and turn to string
			return true; // if class name hidden
		}
	}
	return false;
}

//cancel button
var cancel = document.querySelectorAll(".buttons");
console.log(cancel);
for (var i = 0; i < cancel.length; i++) {
	cancel[i].addEventListener('click',checkIcon);
}

//form validation ------------- understand how to make validation only when start writing

/*function test(e){
	var target = e.target;
	console.log( target);
    if (target.nodeName == 'INPUT') {
    	console.log('INPUT');*/

 /*   var x = document.forms["myForm"]["fname"].value;
    if (x == null || x == "") {
    form.email.focus();
        return false;
          if (form.email.value == "") */
//   }
// }

/*function validateForm(){
    var input = document.querySelector("input");
	console.log(input);
	input.addEventListener('input',test);
}*/


// open iframe only after validation
// gatElementById(variable?)
// add several reports - close old iframe + ceate only one select field + add option
var link = document.querySelectorAll("fieldset input");
console.log(link);
for (var i = 0; i < link.length; i++) {
	link[i].addEventListener('change',newIframe);
}

function newIframe(e){
	var target = e.target,
		tabID = e.currentTarget.parentNode;
	console.log(target.name , target.value , tabID.parentNode);

	if (target.name == 'url'){
		var iframe = document.createElement('iframe');

		iframe.frameBorder=0;
		iframe.width="95%";
		iframe.height="100%";
		iframe.marginwidth="30%";
		iframe.setAttribute("src", target.value);
		document.getElementById("pre-fix-quick-reports").appendChild(iframe);

		tabID.parentNode.className = (tabID.parentNode.className + ' ' + 'hidden');

	    var sel = document.createElement('select');
			sel.id = 'reportsList';
			document.getElementById('pre-fix-quick-reports').appendChild(sel);

	    var opt = document.createElement('option');
	    	opt.index = 1;
		    opt.value = target.value;
		    opt.innerHTML = target.value;
		    document.getElementById('reportsList').appendChild(opt);
	}

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
