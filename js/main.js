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
	var hash = location.hash.slice(1), // returns the string we have after the # in the tab link, not including the #
		tabs = document.querySelectorAll('.tabs > div'), //returns an array of the tab content
		link = document.querySelector('.tabs > ul > li > a'); // returns the first tab link

		//if there is no #, open the first tab
	if (hash === '') {
		hash = link.href.split('#')[1];
		console.log(hash);
	}

	for (var i = 0; i < tabs.length; i++) {
		tabs[i].className = 'hidden'; // hides all the tab content
		activeTab(hash,i);
	}

	document.querySelector('#pre-fix-' + hash).className = '';// change the className of the relevent tab content
};

//active tab
var activeTab = function(hash,i){
	var Activelink = document.querySelectorAll('.tabs > ul > li > a'); // returns an array of all the tab links

	Activelink[i].parentNode.id = ''; // put no id at all tab links
	if (Activelink[i].href.split('#')[1] === hash) // if link = to the current #
		Activelink[i].parentNode.id = 'active'; // become active link
};

//accessibility with keyboard
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
		targetLink = e.target;// img / cancel link / save button
		console.log( targetTab ,targetLink.className, targetLink);

	e.preventDefault();
	if (targetLink.parentNode.className === 'settings'){ //if clicked settings in 'a' node
		settings(targetTab);
	}

	if (targetLink.parentNode.className === 'expand'){
		expand();
	}

	if (targetLink.className === 'cancel'){
		settings(targetTab.parentNode); //tab node
	}

	if (targetLink.className === 'save'){
		validation();
	}

}

//seeting icon
function settings(targetTab){
	var classNameArr = [],// form class array
		tabID = '#' + targetTab.id, // tab ID
		hash = location.hash.slice(1),
		Activelink = document.querySelectorAll('.tabs > ul > li > a'), // returns an array of all the tab links
		form = document.querySelector(tabID + '> form');//call form under spesific tab

	classNameArr = form.className.split(" "); // add to array class name

	if (hideForm(classNameArr)) //if hidden
		form.className = (classNameArr);
	else{
		form.className = (form.className + ' ' + 'hidden');
	}
		console.log(form.className);
}

//expand icon
function expand(){
	window.open(iframe.src,'_blank');
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

//cancel / save button
var buttons = document.querySelectorAll(".buttons");
console.log(buttons);
for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click',checkIcon);
}

//form validation
//add focus on the first invalid input
function validation(e){
	var	index = 0; // to know the last url entered

	for (var i = 0; i < names.length; i++) {
		if ((names[i].value !== "") && (url[i].value === ""))
			url[i].style.border = '1px solid red';
		if ((names[i].value === "") && (url[i].value !== ""))
			names[i].style.border = '1px solid red';
		if ((names[i].value !== "") && (url[i].value !== "")){
			names[i].style.border = 'none';
			url[i].style.border = 'none';
			addToSelect(names[i]);
			index ++;
		}
	/*	if ((names[i].value === "") && (url[i].value === "")){ // remove option
			removeFromSelect(names[i]);
			index --;
		}*/
	}

	if (index > 0) // open iframe only to the last index
		newIframe(url[index-1]);
}

//Global veriables
var iframe,
	names = document.querySelectorAll('input[name="Name"]'),
	url =  document.querySelectorAll('input[name="url"]');

// gatElementById(variable?) + add only new option + remove options+ move with keyboard

function newIframe(url){
	var formID = url.parentNode.parentNode,
			tabID = formID.parentNode.id;
/*			console.log(tabID);
			console.log(document.getElementById('#'+tabID));*/
	if (iframe === undefined){
		iframe = document.createElement('iframe');
		iframe.frameBorder=0;
		iframe.width="95%";
		iframe.height="100%";
		iframe.marginwidth="30%";
		document.getElementById("pre-fix-quick-reports").appendChild(iframe);
	}

	iframe.setAttribute("src", url.value);

	if (hideForm(formID.className.split(" "))) //if hidden
		formID.className = (formID.className);
	else{
		formID.className = (formID.className + ' ' + 'hidden');
	}

}

function addToSelect(urlName){
	var sel = document.getElementById("reportsList"),
	    opt;

    if (sel === null){ // create select field only once
	    sel = document.createElement('select');
		sel.id = 'reportsList';
		document.getElementById("pre-fix-quick-reports").appendChild(sel);
		sel.addEventListener('change', changeOption);
	}

	opt = document.createElement('option');
    opt.value = urlName.value;
    opt.innerHTML = urlName.value;
    opt.selected = true;
    sel.add(opt,sel[0]);
}

var changeOption = function(e){
	var target = e.target,
		selectedOption = target[target.selectedIndex];

	for (var i = 0; i < names.length; i++) {
		if (names[i].value === selectedOption.value)
			newIframe(url[i]);
	}
};

/*function removeFromSelect(urlName){
	sel.remove(opt,sel);
}
*/



