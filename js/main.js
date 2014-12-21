//loading notifications//
/*window.onload = (function() {
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
})();*/

(function($){
	'use strict';
	var notif = $('#notifications');

	$.ajax({
	  type: 'GET',
	  url: '../js/notification.txt'
	}).done(function(response) {
		console.log(response);
		var p = '<p>' + response + '</p>';

		if(response.length <= 1){
			notif.style.display = 'none';
		}else{
			notif.html(p);
		}
	});
})(jQuery);

//Global veriables
var funcRef,
	activeTab,
	checkIcon,
	settings,
	expand,
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

names = $('input[name="Name"]');
url = $('input[name="url"]');
links = $('.links');
buttons = $('.buttons');
search = $('.search-box');
tabs_list = $('.tabs_list').eq(0);

//FUNCTIONS//

//tabs//
funcRef = function(){
	'use strict';
	var hash = location.hash.slice(1), // returns the string we have after the # in the tab link, not including the #

		tabs = $('.tabs > div'), //returns an array of the tab content
		link = $('.tabs > ul > li > a').eq(0); // returns the first tab link

	//if there is no #, open the first tab
	if (hash === '') {
		hash = link.href.split('#')[1];
		console.log(hash);
	}

	// hides all the tab content
	$.each( tabs, function( i, value ) {
		value = $(value);
	 	value.addClass('hidden');
	 	activeTab(hash , i);
	});

	// change the className of the relevent tab content
	var tabName = $('#pre-fix-' + hash);
	tabName.removeClass('hidden');
};

//active tab
activeTab = function(hash , i){
	'use strict';
	var Activelink = $('.tabs > ul > li > a'); // returns an array of all the tab links

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
	var tabID = '#' + targetTab.id, // tab ID
		form = $(tabID + '> form');//call form under spesific tab

		$(form).toggleClass('hidden');
		console.log(form);
};

//expand icon
expand = function (tab){
	'use strict';
	iframe = document.getElementById('iframe-' + tab.id);
	window.open(iframe.src,'_blank');
};

//form validation
//add focus on the first invalid input
validation = function (targetTab){
	'use strict';
	var	index = -1, // to know the last url entered
		re =/http(s)?:\/\/w{0,3}.+\.\w{2,4}(.+)?/,
		coloredBorder = 0;

	$.each(names, function( i,value ) {

		//only if the name is in the current tab
		if(value.parentNode.parentNode.parentNode.id === targetTab.parentNode.id){
			if ((names[i].value !== '') && (url[i].value === '')){
				url[i].style.border = '1px solid red';
				coloredBorder = 1;
			}
			if ((names[i].value === '') && (url[i].value !== '')){
				names[i].style.border = '1px solid red';
				coloredBorder = 1;
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
	  				coloredBorder = 1;
	  			}
			}
		/*	if ((names[i].value === '') && (url[i].value === '')){ // remove option
				removeFromSelect(names[i]);
				index --;
			}*/
		}
	});

	if ((index > -1) && (coloredBorder === 0)){// open iframe only to the last index and all the valus are validate
		newIframe(url[index] , targetTab.parentNode);
	}
};

//open new iframe
newIframe = function (url , tab){
	'use strict';
	var formID = url.parentNode.parentNode;
	console.log(formID.className);

	iframe = document.getElementById('iframe-' + tab.id);

	if (iframe === null){
		iframe = document.createElement('iframe');
		iframe.frameBorder=0;
		iframe.width='95%';
		iframe.height='100%';
		iframe.marginwidth='30%';
		iframe.id = 'iframe-' + tab.id;
		$('#'+ tab.id).append(iframe); // tabID as global veriable
	}

	iframe.setAttribute('src', url.value);
	$(formID).addClass('hidden'); //hides the previous iframe
};

//adding new options to the select + to the local storage
addToSelect = function (urlName , index , tab){
	'use strict';
	sel = document.getElementById('reportsList' + tab.id);

	// create select field only once
    if (sel === null){
	    sel = document.createElement('select');
		sel.id = 'reportsList' + tab.id;
		$('#' + tab.id).append(sel);
		$(sel).change(changeOption);
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

	$.each(target, function(i){
		if (target[i].nodeName === 'INPUT'){
			$.each(names, function(j){
				if (names[j].value === target[i].value){
					expand(names[j].parentNode.parentNode.parentNode);// open the relevant found site in a new window
					return;
				}
			});
		UTILS.qs('#notifications > p').innerHTML =
		('The searched report ' + target[i].value + ' was not found');
		}
	});
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
	$.each(links, function( i,value ) {
		$(value).click(checkIcon);
	});

	//cancel / save button
	$.each(buttons, function( i,value ) {
		$(value).click(checkIcon);
	});

	//search button
	$(search).submit(searchBox);

	initReports(storageFolders);
	initReports(storageReports);

})();


//accessibility with keyboard
$(tabs_list).keydown(function(e){
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


//remove options+ move with keyboard + local storage

