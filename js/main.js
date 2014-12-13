//loading notifications//
window.onload = (function() {
	'use strict';

	UTILS.ajax('../js/notification.txt', {
		method:'GET',
		done: function(response){
				console.log(response);
				var p = '<p>' + response + '</p>';

				if(response.length <= 1){
					UTILS.qs('#notifications').style.display = 'none';
					}
				else{
					UTILS.qs('#notifications').innerHTML = p;
				}
		}
	});
})();

//Global veriables
var funcRef,
	activeTab,
	checkIcon,
	settings,
	expand,
	hideForm,
	validation,
	newIframe,
	addToSelect,
	searchBox,
	iframe,
	changeOption,
	links,
	names,
	url,
	buttons,
 	sel,
	opt,
	iframe,
	search,
	tabs_list,
	addToStorage;

names = UTILS.qsa('input[name="Name"]');
url = UTILS.qsa('input[name="url"]');
links = UTILS.qsa('.links');
buttons = UTILS.qsa('.buttons');
search = UTILS.qs('.search-box');
tabs_list = UTILS.qs('.tabs_list');

//FUNCTIONS//

//tabs//
funcRef = function(){
	'use strict';
	var hash = location.hash.slice(1), // returns the string we have after the # in the tab link, not including the #

		tabs = UTILS.qsa('.tabs > div'), //returns an array of the tab content
		link = UTILS.qs('.tabs > ul > li > a'); // returns the first tab link

	//if there is no #, open the first tab
	if (hash === '') {
		hash = link.href.split('#')[1];
		console.log(hash);
	}

	// hides all the tab content
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].className = 'hidden';
		activeTab(hash,i);
	}

	// change the className of the relevent tab content
	UTILS.qs('#pre-fix-' + hash).className = '';
};

//active tab
activeTab = function(hash,i){
	'use strict';
	var Activelink = UTILS.qsa('.tabs > ul > li > a'); // returns an array of all the tab links

	Activelink[i].parentNode.id = ''; // put no id at all tab links
	if (Activelink[i].href.split('#')[1] === hash){ // if link = to the current #
		Activelink[i].parentNode.id = 'active'; // become active link
	}
};

//check if local storage is supported
var localStorageSupported = function () {
	'use strict';
	if (!Modernizr.localstorage) {
		console.error('Your browser does not support localStorage');
		return false;
	}
	return true;
};

//icon functionality//
function checkIcon(e){
	'use strict';
	var targetTab = e.currentTarget.parentNode, //tab node / form
		targetLink = e.target;// img / cancel link / save button
		console.log( targetTab ,targetLink.className, targetLink);

	e.preventDefault();
	if (targetLink.parentNode.className === 'settings'){ //if clicked settings in 'a' node
		settings(targetTab);
	}

	if (targetLink.parentNode.className === 'expand'){
		expand(targetTab);
	}

	if (targetLink.className === 'cancel'){
		settings(targetTab.parentNode); //tab node
	}

	if (targetLink.className === 'save'){
		validation(targetTab);
	}

}

//setting icon
settings = function (targetTab){
	'use strict';
	var classNameArr = [],// form class array
		tabID = '#' + targetTab.id, // tab ID
		form = UTILS.qs(tabID + '> form');//call form under spesific tab

	classNameArr = form.className.split(' '); //add to array class name

	if (hideForm(classNameArr)) {//if hidden
		form.className = (classNameArr);
	}
	else{
		form.className = (form.className + ' ' + 'hidden');
	}
		console.log(form.className);
};

//expand icon
expand = function (tab){
	'use strict';
	iframe = document.getElementById('iframe-' + tab.id);
	window.open(iframe.src,'_blank');
};

//hide form
function hideForm(classNameArr){
	'use strict';
	for (var j = 0; j < classNameArr.length; j++) {
		if (classNameArr[j] === 'hidden'){
			classNameArr.pop().toString();// delete hidden and turn to string
			return true; // if class name hidden
		}
	}
	return false;
}

//form validation
//add focus on the first invalid input
validation = function (targetTab){
	'use strict';
	var	index = -1, // to know the last url entered
		re =/http(s)?:\/\/w{0,3}.+\.\w{2,4}(.+)?/;

	for (var i = 0; i < names.length; i++) {
		//only if the name is in the current tab
		if(names[i].parentNode.parentNode.parentNode.id === targetTab.parentNode.id){
			if ((names[i].value !== '') && (url[i].value === '')){
			url[i].style.border = '1px solid red';
			}
			if ((names[i].value === '') && (url[i].value !== '')){
				names[i].style.border = '1px solid red';
			}
			if ((names[i].value !== '') && (url[i].value !== '')){
				names[i].style.border = 'none';
				if (url[i].value.substring(0, 4) !== 'http'){ // http protocol
						url[i].value = 'http://' + url[i].value;
				}
				if (re.test(url[i].value)){ // url validation
	    			url[i].style.border = 'none';
					addToSelect(names[i] , index , targetTab.parentNode);
					index = i;
					addToStorage(names[i] , url[i] , targetTab.parentNode , index);
				}else{
	  				url[i].style.border = '1px solid red';
	  			}
			}
		/*	if ((names[i].value === '') && (url[i].value === '')){ // remove option
				removeFromSelect(names[i]);
				index --;
			}*/
		}
	}

	if (index > -1){// open iframe only to the last index
		newIframe(url[index] , targetTab.parentNode);
	}
};

//open new iframe
newIframe = function (url , tab){
	'use strict';
	var formID = url.parentNode.parentNode;

	iframe = document.getElementById('iframe-' + tab.id);

	if (iframe === null){
		iframe = document.createElement('iframe');
		iframe.frameBorder=0;
		iframe.width='95%';
		iframe.height='100%';
		iframe.marginwidth='30%';
		iframe.id = 'iframe-' + tab.id;
		UTILS.qs('#'+ tab.id).appendChild(iframe); // tabID as global veriable
	}

	iframe.setAttribute('src', url.value);

	if (hideForm(formID.className.split(' '))){ //if hidden
		formID.className = (formID.className);
	}
	else{
		formID.className = (formID.className + ' ' + 'hidden');
	}
};

//adding new options to the select + to the local storage
addToSelect = function (urlName , index , tab){
	'use strict';

	sel = document.getElementById('reportsList' + tab.id);

    if (sel === null){ // create select field only once
	    sel = document.createElement('select');
		sel.id = 'reportsList' + tab.id;
		UTILS.qs('#' + tab.id).appendChild(sel);
		UTILS.addEvent(sel , 'change' , changeOption);
	}

// check that its not the first time we prass save +
// if it's the first value in the select we remove all options

	if ((opt !== null) && (index === -1)){
		for (opt in sel){
			sel.remove(opt);
		}
	}

	opt = document.createElement('option');
    opt.value = urlName.value;
    opt.innerHTML = urlName.value;
    opt.selected = true;
    sel.add(opt,sel[0]);
};

var local,
	storageReports = [],
	storageFolders = [];

addToStorage = function(urlName , url , tab, index){
	'use strict';
	console.log(storageReports , storageFolders , index);

	if (localStorageSupported()){

		//adding form parameters to the relevant local storage
		local = {
	    	name: urlName.value,
	    	url: url.value
	    	};

    	if (tab.id ==='pre-fix-quick-reports'){
    		if (index === 0){
    			storageReports = [];
    		}
	    	//Add new local to the beggining of the array
	    	storageReports.unshift(local);
	    	// Put the array into storage
			localStorage.setItem('storageReports', JSON.stringify(storageReports));
    	}
   		 if (tab.id ==='pre-fix-my-team-folders'){
   		 	if (index === 3){
			    storageFolders = [];
			}
    		//Add new local to the beggining of the array
    		storageFolders.unshift(local);
    		// Put the array into storage
			localStorage.setItem('storageFolders', JSON.stringify(storageFolders));
   		}
	}
};


//searcing in the site
searchBox = function (e){
	'use strict';
	e.preventDefault();
	var target = e.target.childNodes;

	for (var i = 0; i < target.length; i++) {
		if (target[i].nodeName === 'INPUT'){
			for (var j = 0; j < names.length; j++) {
				if (names[j].value === target[i].value){
					console.log('find');
					return;
				}
			}
		UTILS.qs('#notifications > p').innerHTML =
		('The searched report ' + target[i].value + ' was not found');
		}
	}
};

//open relevent option if there has been a change in the select
changeOption = function(e){
	'use strict';
	var target = e.target,
		selectedOption = target[target.selectedIndex];

	for (var i = 0; i < names.length; i++) {
		if (names[i].value === selectedOption.value){
			newIframe(url[i] , target.parentNode);
		}
	}
};

/*function removeFromSelect(urlName){
	var sel = document.getElementById("reportsList"),
	    opt;
	sel.remove(opt,sel);
}
*/

// Setup the Reports-form if there is data saved in localStorage
var initReports = function (storage) {
	'use strict';
	var savedData;

	// Check if we have previously saved any Reports-form
	savedData = localStorage.getItem(storage);
	console.log(savedData);

	if (!savedData) {
		return false;
	}

	// Parse the data into an object (will throw on invalid JSON)
	try {
		savedData = JSON.parse(savedData);
	} catch (e) {
		console.error('The saved data was not in a valid JSON format');
		return false;
	}
};

//event listeners + init localStorage
var init = (function(){
	'use strict';
//icon functionality//
for (var i = 0; i < links.length; i++) {
	UTILS.addEvent(links[i] , 'click' , checkIcon);
}

//cancel / save button
for (i = 0; i < buttons.length; i++) {
	UTILS.addEvent(buttons[i] , 'click' , checkIcon);
}

//search button
UTILS.addEvent(search , 'submit' , searchBox);

initReports(storageFolders);
initReports(storageReports);

})();


//accessibility with keyboard

UTILS.addEvent(tabs_list , 'keydown' , function(e){
	'use strict';
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


//remove options+ move with keyboard + search + local storage

