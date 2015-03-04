(function($){
	'use strict';
	//declaring Functions
	var funcRef,
		activeTab,
		localStorageSupported,
		handleIconsClick,
		settings,
		expand,
		validateForm,
		newIframe,
		addToSelect,
		searchBox,
		changeOption,
		addToStorage;

	//declaring global veriables
	var notif = $('#notifications'),
		namesInput = $('input[name="Name"]'),
		urlInput = $('input[name="url"]'),
		globalStorage;


	//FUNCTIONS//

	//loading notifications//
	$.ajax({
	  type: 'GET',
	  url: '../../data/notification.txt'
	}).done(function(response) {
		console.log(response);
		var p = '<p>' + response + '</p>';

		if(!response.length){
			notif.hide();
		}else{
			notif.html(p);
		}
	}).fail(function() {
    	 notif.hide();
  	});

	//tabs//
	funcRef = function(){
		// returns the string we have after the # in the tab link, not including the #
		var hash = location.hash.slice(1),
			tabs = $('.tabs > div'), //returns an array of the tab content
			link = $('.tabs > ul > li > a').eq(0),// returns the first tab link
			tabName = $('#pre-fix-' + hash),
			iframe = $('#iframe-pre-fix-' + hash),
			src = iframe.attr('data-src');

		//if there is no #, open the first tab
		if (hash === '') {
			hash = link.href.split('#')[1];
		}

		// hides all the tab content
		$.each( tabs, function( i, value ) {
			value = $(value);
		 	value.addClass('hidden');
		 	activeTab(hash , i);
		});

		// change the className of the relevent tab content
		tabName.removeClass('hidden');

		//upload relavent iframe when clicking the relavent tab
		iframe.attr('src', src);

	};

	//active tab
	activeTab = function(hash , i){
		var Activelink = $('.tabs > ul > li > a'); // returns an array of all the tab links

		Activelink[i].parentNode.id = ''; // put no id at all tab links
		if (Activelink[i].href.split('#')[1] === hash){ // if link = to the current #
			Activelink[i].parentNode.id = 'active'; // become active link
		}
	};

	//check if local storage is supported
	localStorageSupported = function () {
		if (!Modernizr.localstorage) {
			console.error('Your browser does not support localStorage');
			return false;
		}
		return true;
	};

	//icon functionality//
	handleIconsClick = function (e){
		var target = e.currentTarget.parentNode, //tab node / form
			targetForm,
			targetTab,
			targetLink = e.target;// img / cancel link / save button
			console.log( target,targetLink.className, targetLink);

		e.preventDefault();
		if (targetLink.parentNode.className === 'settings'){ //if clicked settings in 'a' node
			targetTab = target;
			settings(targetTab);
		}

		if (targetLink.parentNode.className === 'expand'){
			targetTab = target;
			expand(targetTab);
		}

		if (targetLink.className === 'cancel'){
			targetTab = target.parentNode;//tab node
			settings(targetTab);
		}

		if (targetLink.className === 'save'){
			targetForm = target;
			validateForm(targetForm);
		}
	};

	//setting icon
	settings = function (targetTab){
		var tabID = '#' + targetTab.id, // tab ID
			form = $(tabID + '> form');//call form under spesific tab
			$(form).toggleClass('hidden');
	};

	//expand icon
	expand = function (tab , url){
		var curIframe = document.getElementById('iframe-' + tab.id);
		if (!curIframe){
			window.open(url.value,'_blank');
			return;
		}
		window.open(curIframe.src,'_blank');
	};

	//form validation
	validateForm = function (targetForm){
		var	urlPlace = -1, // to know the last url entered
			re =/http(s)?:\/\/w{0,3}.+\.\w{2,4}(.+)?/,
			coloredBorder = 0,
			local,
			storageReports = [],
			storageFolders = [];

		$.each(namesInput, function( i,value ) {

			//only if the name is in the current tab
			if($(value).parents('form')[0] === targetForm){
				if ((namesInput[i].value !== '') && (urlInput[i].value === '')){
					urlInput[i].style.border = '1px solid red';
					coloredBorder = 1;
				}
				if ((namesInput[i].value === '') && (urlInput[i].value !== '')){
					namesInput[i].style.border = '1px solid red';
					coloredBorder = 1;
				}
				if ((namesInput[i].value !== '') && (urlInput[i].value !== '')){
					namesInput[i].style.border = 'none';
					if (urlInput[i].value.substring(0, 4) !== 'http'){ // http protocol
							urlInput[i].value = 'http://' + urlInput[i].value;
					}
					if (re.test(urlInput[i].value)){ // url validation
		    			urlInput[i].style.border = 'none';
						addToSelect(namesInput[i] , urlPlace , targetForm.parentNode);
						urlPlace = i;
						addToStorage(namesInput[i] , urlInput[i] , targetForm.parentNode,
						 	 		local , storageReports , storageFolders);
					}else{
		  				urlInput[i].style.border = '1px solid red';
		  				coloredBorder = 1;
		  			}
				}
			/*	if ((namesInput[i].value === '') && (urlInput[i].value === '')){ // remove option
					removeFromSelect(namesInput[i]);
					urlPlace --;
				}*/
			}
		});

		// open iframe only to the last urlPlace and all the valus are validate
		if ((urlPlace > -1) && (coloredBorder === 0)){
			newIframe(urlInput[urlPlace] , targetForm.parentNode);
		}
	};

	//open new iframe
	newIframe = function (url , tab){
		var form = $(url).parents('form')[0],
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
		$(form).addClass('hidden'); //hides the previous iframe
	};

	//adding new options to the select + to the local storage
	addToSelect = function (urlName , urlPlace , tab){
		var sel = document.getElementById('reportsList' + tab.id),
			opt;

	    // create select field only once
	    if (sel === null){
		    sel = document.createElement('select');
			sel.id = 'reportsList' + tab.id;
			$('#' + tab.id).append(sel);
			$(sel).change(changeOption);
	}

	// if it's the first value in the select we remove all options
		if (urlPlace === -1){
			$.each(sel, function( index, value ) {
	  			sel.remove(opt);
			});
		}

		opt = document.createElement('option');
	    opt.value = urlName.value;
	    opt.innerHTML = urlName.value;
	    opt.selected = true;
	    sel.add(opt,sel[0]);
	};

	addToStorage = function(urlName , url , tab , local , storageReports , storageFolders){

		if (localStorageSupported()){

			//adding form parameters to the relevant local storage
			local = {
		    	name: urlName.value,
		    	url: url.value
		    	};

	    	if (tab.id ==='pre-fix-quick-reports'){
		    	//Add new local to the beggining of the array
		    	storageReports.unshift(local);
				}

			if (tab.id ==='pre-fix-my-team-folders'){
	    		//Add new local to the beggining of the array
	    		storageFolders.unshift(local);
	    		}

	    	globalStorage = {
	    		reports: storageReports,
	    		folders: storageFolders
	    	};

		    // Put the array into storage
			localStorage.setItem('globalStorage', JSON.stringify(globalStorage));

	   	}
	};

	//searcing in the site
	searchBox = function (e){
		e.preventDefault();
		var target = e.target.childNodes; //input + text under search

		$.each(target, function(i){
			if (target[i].nodeName === 'INPUT'){ //input entered in search field
				$.each(namesInput, function(j){
					if (namesInput[j].value === target[i].value){
						// open the relevant found site in a new window
						expand($(namesInput[j]).parents('form')[0].parentNode , urlInput[j]);
						return;
					}
				});
				notif.html
				('<p>The searched report ' + target[i].value + ' was not found</p>');
			}
		});
	};

	//open relevent option if there has been a change in the select
	changeOption = function(e){
		var target = e.target,
			selectedOption = target[target.selectedIndex];

		for (var i = 0; i < namesInput.length; i++) {
			if (namesInput[i].value === selectedOption.value){
				newIframe(urlInput[i] , target.parentNode);
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
	var initReports = function (globalStorage) {
		var savedData;

		// Check if we have previously saved any Reports-form
		savedData = localStorage.getItem('globalStorage');

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

		//insert values from local storage to reports form
		$.each(savedData.reports , function(index , rowObj){
			namesInput[index].value = rowObj.name;
			urlInput[index].value = rowObj.url;
		});

		//insert values from local storage to folders form
		$.each(savedData.folders , function(index , rowObj){
			namesInput[index+3].value = rowObj.name;
			urlInput[index+3].value = rowObj.url;
		});
	};

	//event listeners + init localStorage
	(function(){
		var links = $('.links'),
			buttons = $('.buttons'),
			search = $('.search-box');

		//icon functionality//
		$.each(links, function( i,value ) {
			$(value).click(handleIconsClick);
		});

		//cancel / save button
		$.each(buttons, function( i,value ) {
			$(value).click(handleIconsClick);
		});

		//search button
		$(search).submit(searchBox);

		//retrive from local storage
		initReports(globalStorage);

		//tab change
		$(window).on('hashchange', funcRef);

	})();

	//accessibility with keyboard
	var tabs_list = $('.tabs_list').eq(0);
	$(tabs_list).keydown(function(e){
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



})(jQuery);
	//remove options+ move with keyboard
