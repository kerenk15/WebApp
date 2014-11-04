
window.onload = UTILS.ajax('../js/notification.txt', {
				method:'GET',
				done: function(response){
						console.log(response);
						var words = response.split(" ");
						var i , p = '<p>';
						for (i=0; i<words.length; i++) {
							if (words[i]){
								p += words[i] + ' ';
							}
						}

						p += '<p>';
						if(words.length <= 1){
							document.querySelector('#notifications').style.display = 'none';
							}
						else{
							document.querySelector('#notifications').innerHTML = p;
						}
					}
			});
