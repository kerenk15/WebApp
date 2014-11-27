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
		console.log('expand');
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
	var names = document.querySelectorAll('input[name="Name"]'),
		url =  document.querySelectorAll('input[name="url"]'),
		index = 0;

	for (var i = 0; i < names.length; i++) {
		if ((names[i].value !== "") && (url[i].value === ""))
			url[i].style.border = '1px solid red';
		if ((names[i].value === "") && (url[i].value !== ""))
			names[i].style.border = '1px solid red';
		if ((names[i].value !== "") && (url[i].value !== "")){
			names[i].style.border = 'none';
			url[i].style.border = 'none';
			addToSelect(names[i] , index);
			index ++;
		}
	}

	if (index > 0) // open iframe only to the last index
		newIframe(url[index-1]);
}

// gatElementById(variable?) -- not working
// add several reports - close old iframe + add only new option + remove options+ conecctions between option and url
function newIframe(url){
	var formID = url.parentNode.parentNode,
		tabID = '#' + formID.parentNode.id,
		iframe = document.createElement('iframe');

		iframe.frameBorder=0;
		iframe.width="95%";
		iframe.height="100%";
		iframe.marginwidth="30%";
		iframe.setAttribute("src", url.value);
		document.getElementById("pre-fix-quick-reports").appendChild(iframe);

		formID.className = (formID.className + ' ' + 'hidden');
}

function addToSelect(urlName , index){
    var sel = document.getElementById("reportsList"),
    	opt;

	    if (sel === null){ // create select field only once
		    sel = document.createElement('select');
			sel.id = 'reportsList';
			document.getElementById("pre-fix-quick-reports").appendChild(sel);
		}

    	opt = document.createElement('option');
	    opt.value = urlName.value;
	    opt.innerHTML = urlName.value;
	    /*opt.selectedIndex = true;*/
	    /*opt.index = index-1;*/
	    sel.add(opt,sel[0]);
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
