//loading notifications//
window.onload = (function() {
	'use strict';

	UTILS.ajax('../js/notification.txt', {
		method:'GET',
		done: function(response){
				console.log(response);
				var p = '<p>' + response + '</p>';

				if(response.length <= 1){
					document.querySelector('#notifications').style.display = 'none';
					}
				else{
					document.querySelector('#notifications').innerHTML = p;
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
	buttons;

//tabs//
funcRef = function(){
	'use strict';
	var hash = location.hash.slice(1), // returns the string we have after the # in the tab link, not including the #
		tabs = document.querySelectorAll('.tabs > div'), //returns an array of the tab content
		link = document.querySelector('.tabs > ul > li > a'); // returns the first tab link

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
	document.querySelector('#pre-fix-' + hash).className = '';
};

//active tab
activeTab = function(hash,i){
	'use strict';
	var Activelink = document.querySelectorAll('.tabs > ul > li > a'); // returns an array of all the tab links

	Activelink[i].parentNode.id = ''; // put no id at all tab links
	if (Activelink[i].href.split('#')[1] === hash){ // if link = to the current #
		Activelink[i].parentNode.id = 'active'; // become active link
	}
};

//accessibility with keyboard
var tabs_list = document.querySelector('.tabs_list');

tabs_list.addEventListener('keydown', function(e){
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

//icon functionality//
links = document.querySelectorAll('.links');

for (var i = 0; i < links.length; i++) {
	links[i].addEventListener('click',checkIcon);
}

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
		form = document.querySelector(tabID + '> form');//call form under spesific tab

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

//cancel / save button
buttons = document.querySelectorAll('.buttons');
for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click',checkIcon);
}

names = document.querySelectorAll('input[name="Name"]');
url = document.querySelectorAll('input[name="url"]');

//form validation
//add focus on the first invalid input
validation = function (targetTab){
	'use strict';
	var	index = -1, // to know the last url entered
		re =/http(s)?:\/\/w{0,3}.+\.\w{2,4}(.+)?/;

	for (var i = 0; i < names.length; i++) {
		//only if the name is in the cuurent tab
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

// expand 2 tabs + remove options+ move with keyboard + search + local storage

var iframe;

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
		document.querySelector('#'+ tab.id).appendChild(iframe); // tabID as global veriable
	}

	iframe.setAttribute('src', url.value);

	if (hideForm(formID.className.split(' '))){ //if hidden
		formID.className = (formID.className);
	}
	else{
		formID.className = (formID.className + ' ' + 'hidden');
	}
};

var sel,
	opt;

addToSelect = function (urlName , index , tab){
	'use strict';
	sel = document.getElementById('reportsList' + tab.id);

    if (sel === null){ // create select field only once
	    sel = document.createElement('select');
		sel.id = 'reportsList' + tab.id;
		document.querySelector('#' + tab.id).appendChild(sel);
		sel.addEventListener('change', changeOption);
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

var search = document.querySelector('.search-box');
console.log(search);
search.addEventListener('submit',searchBox);

function searchBox(e){
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
		document.querySelector('#notifications > p').innerHTML =
		('The searched report ' + target[i].value + ' was not found');
		}
	}
}

/*
var localStorageSupported = function () {
		if (!Modernizr.localstorage) {
			console.error('Your browser does not support localStorage');
			return false;
		}
		return true;
	};

var initReprots = function(){
    var savedData = localStorage.getItem('reports'),
    	allForms = UTILS.qsa('form');

    // If no localStorage, we can't retrieve any data
    if (!localStorageSupported()) {
    	return false;
    }

    try {
    	savedData = JSON.parse(savedData);
    	if(savedData){
	    	reports = savedData;
    	}

    } catch (e) {
    	console.error('The saved data was not in a valid JSON format');
    	return false;
    }


    for (var i = 0; i < allForms.length; i++) {
    	var inputs = allForms[i].getElementsByTagName('input');
    	for (var j = 0; j < inputs.length; j++) {
    		inputs[j].value = '';
    	}
    }

    // For each saved report
    for (var inx in savedData) {

    	// Prevent iterating inherited properties
    	if (savedData.hasOwnProperty(inx)) {

    		var name = UTILS.qsa('[data-settings="' + inx + '"] fieldset [type="text"]'),
    		    url = UTILS.qsa('[data-settings="' + inx + '"] fieldset [type="url"]');

		    for(var i = 0; i < savedData[inx].length; i++){
		    	if(name[i] && url[i]){
		    		name[i].value = savedData[inx][i].name;
		    		url[i].value = savedData[inx][i].url;
		    	}
		    }
		    // Pass the saveInput function context
			saveInput({target: UTILS.qs('[data-form="' + inx + '"]')});
    	}
    }
};





























(function () {
	var ReportsForm = UTILS.qs('.Reports-form'),
		initRereportsForms,
		reportsFormHandler,
		ReportsFormKey = 'ReportsForm',
		Reports-formVals = [],
		localStorageSupported;



	// Setup the Reports-form if there is data saved in localStorage
	initReportsForms = function () {
		var savedData,
			Input,
			InputClone,
			newInput;



		// Check if we have previously saved any Reports-form
		savedData = localStorage.getItem(ReportsFormKey);

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

		// Get the first todo item
		Input = ReportsForm.querySelector('.Reports-form input');
		console.log(input);
		// Make a clone of the first empty <LI>
		InputClone = Input.cloneNode(true);
		// Remove any present Reports-form
		Reports-form.innerHTML = '';

		// For each saved todo, create a new todo item
		for (var inx in savedData) {
			// Prevent iterating inherited properties
			if (savedData.hasOwnProperty(inx)) {
				// Add/Update the Reports-form values object
				Reports-formVals[inx] = savedData[inx];
				// Prepare a new todo item
				newInput = InputClone.cloneNode(true);
				newInput.innerHTML = Reports-formVals[inx];
				// Add it to the Reports-form list
				Reports-form.appendChild(newInput);
			}
		}
	};

	// On each todo text change
	reportsFormHandler = function (todo) {
		// Get latest todo items
		var lis = Reports-form.querySelectorAll('.Reports-form li');

		// Get all todo values
		[].forEach.call(lis, function (elm, inx, Reports-form) {
			// Get the index of the each todo, among the whole list
			var todoInx = [].indexOf.call(Reports-form, elm);
			// Add/Update the Reports-form values object
			Reports-formVals[todoInx] = elm.textContent;
		});

		if (localStorageSupported()) {
			// Save it in localStorage, as a string
			localStorage.setItem(Reports-formKey, JSON.stringify(Reports-formVals));
		}

	};

	UTILS.addEvent(Reports-form, 'input keydown', function (e) {
		var target = e.target,
			type = e.type,
			keyCode = e.keyCode,
			newTodo;

		if (target.nodeName.toUpperCase() === 'LI') {
			// Handle keys
			if (type.indexOf('keydown') > -1) {
				// Handle Enter key
				if (keyCode === 13 && !e.shiftKey) {
					e.preventDefault();

					newTodo = target.cloneNode(true);
					newTodo.innerHTML = '';
					Reports-form.appendChild(newTodo);
					newTodo.focus();
				}
			}

			if (type.indexOf('input') > -1) {
				reportsFormHandler(target);
			}
		}
	});

	initReports-form();
}());
*/
