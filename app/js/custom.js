// This is called before kill confirms JSON has loaded if neat top of page.js
// Move script call back to characters.js instead

var Custom = function(){

	// Setting some cross-browser terms
	var _requestAnimationFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame;

	var animEndEventNames = {
		'WebkitAnimation' : 'webkitAnimationEnd',
		'OAnimation' : 'oAnimationEnd',
		'msAnimation' : 'MSAnimationEnd',
		'animation' : 'animationend'
	},
	// animation end event name
	animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
	// support css animations
	support = Modernizr.cssanimations;

	function _fadeIn(el, callback){
		el.style.opacity = 0;
		el.style.display = '';
		var last = +new Date();
		var tick = function(){
			el.style.opacity = +el.style.opacity + (new Date() - last) / 200;
			last = +new Date();

			if(+el.style.opacity < 1){
				(window._requestAnimationFrame && _requestAnimationFrame(tick)) || setTimeout(tick,16);
			} else {
				if(callback){ callback() };
			}
		};
		tick();
	}
	function _fadeOut(el, callback){
		el.style.opacity = 1;
		var last = +new Date();
		var tick = function(){
			el.style.opacity = +el.style.opacity - (new Date() - last) / 200;
			last = +new Date();

			if(+el.style.opacity > 0){
				(window._requestAnimationFrame && _requestAnimationFrame(tick)) || setTimeout(tick,16);
			} else {
				if(callback){ callback() };
			}
		};
		tick();
	}

	// Analytics tracking function
	function setSendPageView(page){
		ga('set', 'page', page);
		ga('send', 'pageview');
	}

	// Detect if page is desktop or mobile
	function detectWidth(){
		var winWidth = $(window).width();
		if((winWidth) > 768){
			$('body').addClass('viewport-desktop').removeClass('viewport-mobile');
		} else {
			$('body').removeClass('viewport-desktop').addClass('viewport-mobile');
		}
	}
	detectWidth();
	$(window).resize(function(){
		detectWidth();
	})


	function reassignIndexes(){
		console.log('reindexing!');
		var elements = document.querySelectorAll('.character-box');
		/*Array.prototype.forEach.call(elements, function(el, i){
			//var $this = $(this);
			var theIndex = nodeList.el.index();
			console.log(theIndex);
			//el.children('.grid-index span').text(theIndex + 1);
		});*/
		$('.character-box').each(function(){
			var $this = $(this);
			var theIndex = parseInt($this.index());
			$this.find('.grid-index span').text(theIndex + 1);
		})
	}
	// Initialise the reindexing
	reassignIndexes();


	// These sort buttons are now done via jQuery rather than Knockout
	// Reason being that the troublesome difficulty sort function won't work with Knockout, due to the values being derived dynamically through JSON loaded via jQuery
	// Need to redo all sort functions to work with jQuery, since Knockout and jQuery sort functions don't play nice together
	// http://trentrichardson.com/2013/12/16/sort-dom-elements-jquery/

	function sortName(self){
		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');

		if(self.hasClass('asc')){
			$gridItem.sort(function(left, right){
				// Ascending order
				return $(right).data('name') == $(left).data('name') ? 0 : ($(right).data('name') < $(left).data('name') ? -1 : 1)
			});
		} else {
			$gridItem.sort(function(left, right){
				return $(left).data('name') == $(right).data('name') ? 0 : ($(left).data('name') < $(right).data('name') ? -1 : 1)
			});
			
		}
		$gridItem.detach().appendTo($grid);
		reassignIndexes();
	};

	function sortWeight(self){
		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');

		if(self.hasClass('asc')){
			$gridItem.sort(function(lower, higher){
				return $(higher).data('weight') - $(lower).data('weight');
			});
		} else {
			$gridItem.sort(function(lower, higher){
				return $(lower).data('weight') - $(higher).data('weight');
			});
		}
		$gridItem.detach().appendTo($grid);
		reassignIndexes();
	};

	function sortDifficulty(self){
		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');

		// If the character selected is Zelda
		if($('.moveBtn.active').attr('id') != 'zelda-dthrow-up-air'){

			if(self.hasClass('asc')){
				$gridItem.sort(function(lower, higher){
					return $(higher).find('.text-percRange').text() - $(lower).find('.text-percRange').text();
				});
			} else {
				$gridItem.sort(function(lower, higher){
					return $(lower).find('.text-percRange').text() - $(higher).find('.text-percRange').text();
				});
			}

		} else {

			if(self.hasClass('asc')){
				$gridItem.sort(function(lower, higher){
					return $(higher).data('airdodgestart') - $(lower).data('airdodgestart');
				});
			} else {
				$gridItem.sort(function(lower, higher){
					return $(lower).data('airdodgestart') - $(higher).data('airdodgestart');
				});
			}

		};

		$gridItem.detach().appendTo($grid);
		reassignIndexes();
	};

	function sortFallspeed(self){
		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');

		if(self.hasClass('asc')){
			$gridItem.sort(function(lower, higher){
				return $(higher).data('fallspeed') - $(lower).data('fallspeed');
			});
		} else {
			$gridItem.sort(function(lower, higher){
				return $(lower).data('fallspeed') - $(higher).data('fallspeed');
			});
		}
		$gridItem.detach().appendTo($grid);
		reassignIndexes();
	};

	function sortGravity(self){
		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');

		if(self.hasClass('asc')){
			$gridItem.sort(function(lower, higher){
				return $(higher).data('gravity') - $(lower).data('gravity');
			});
		} else {
			$gridItem.sort(function(lower, higher){
				return $(lower).data('gravity') - $(higher).data('gravity');
			});
		}
		$gridItem.detach().appendTo($grid);
		reassignIndexes();
	};

	// Detect if Sort Name filter is active
	function executeActiveFilter(self){
		var filterId = $('.filter-btn.active').attr('id');
		//var $this = this;
		// Only need to execute this if a filter other than sortName is active
		// Actually, the only dynamic filter is sortDifficulty...
		if(filterId == 'sort-difficulty'){
			sortDifficulty($('#sort-difficulty'));
		};
	};

	// Need to trigger this on button click now
	// Needs to be done via callback so I can control exactly WHEN the data switches over. It'll be transitioning now, see - it can be changed mid-transition
	function activateCharacterGrid(self){
		$this = self;
		if(!$this.hasClass('active')){
		
			$('.moveBtn').removeClass('active');
			$this.addClass('active');
			var characterId = $this.closest('.card-deck').data('index');
			var moveId = $this.data('moveid'); // Needed for each loop below
			//console.log('card-deck: ' + characterId + ' moveId: ' + moveId);
			var characterName = $this.closest('.card-deck').data('name');
			$('#nav-title').text(characterName);
			$('.rageModifier h3').text(characterName + ' Rage Modifier');
			//$('body').addClass('character-grid-active');

			var moveName = $this.html();

			var id = $this.attr('id');
			$('#side-menu .nav-moves a').removeClass('active');
			$('#side-menu a[data-ref=' + id + ']').addClass('active');

			/* --- */

			// Check for how many buttons in the card
			// If more than one, then display the move-switcher dropdown in secondarynav
			var btnCount = $this.parent().find('.moveBtn').length;
			if(btnCount > 1){
				$('#secondarynav #moveName').hide();
				var $dropdown = $('#secondarynav-dropdown');
				var $dropdownMenu = $('#secondarynav-dropdown-menu');
				$('#secondarynav .dropdown').show();
				// adjust the dropdown title
				$dropdown.html(moveName);

				// nuke the existing contents of the dropdown menu
				$dropdownMenu.empty()

				// Need to see if the generated button has the same id as the current move
				// If it does, add a class of 'active' to it so we know that it's already selected
				function checkIdAndAddActive(moveId, buttonId){
					var className = "";
					if(moveId == buttonId){
						className = "active";
					}
					return className;
				}

				// generate those dropdown items
				$this.parent().find('.moveBtn').each(function(){
					$button = $(this);
					var name = $button.html();
					var href = $button.attr('href');
					var moveUrl = $button.data('moveurl');
					var buttonId = $button.attr('id');
					$dropdownMenu.append('<a class="dropdown-item ' + checkIdAndAddActive(id, buttonId) + '" data-ident=' + buttonId + '>' + name + '</a>');
					$('body').addClass('show-secondary-dropdown');
				});
			} else {
				$('#secondarynav #moveName').html(moveName).show();
				$('#secondarynav .dropdown').hide();
				$('body').removeClass('show-secondary-dropdown');
			}

			var percentDifferences = [];
			var percentSum = 0;
			var minPercentSum = 0;
			var maxPercentSum = 0

			$.each(killConfirmsJSON[characterId]['moves'][moveId]['percents'], function(index, value){
				// Push these min/max percent values to an array so I can calculate an average between all of them
				// Need this to calculate difficulties in a uniform manner
				var minPercent = value[0];
				var maxPercent = value[1];

				percentDifferences.push(maxPercent - minPercent);
				percentSum += ((maxPercent + 1) - minPercent);
				minPercentSum += minPercent;
				maxPercentSum += maxPercent;
			});
		
			$.each(killConfirmsJSON[characterId]['moves'][moveId]['percents'], function(index, value){

				// this is good!
				// https://stackoverflow.com/questions/4329092/multi-dimensional-associative-arrays-in-javascript
				var $character = $('.' + index + '.character-box');
				var minPercent = value[0];
				var maxPercent = value[1];
				//console.log(index + 's attrs are: min percent is: ' + minPercent + ' and max percent is: ' + maxPercent);

				$character.find('.grid-minPercent').text(minPercent);
				$character.find('.grid-maxPercent').text(maxPercent);
				// Need to update characterModal percents too
				$('#characterModal').find('.minPerc').text(minPercent);
				$('#characterModal').find('.maxPerc').text(maxPercent);

				$character.attr('data-minpercent', minPercent);
				$character.attr('data-maxpercent', maxPercent);
				// IT WOOOOOORKS!!!

				var $difficulty = $character.find('.difficulty');
				$difficulty.find('.text-percRange').text(parseInt(maxPercent) - parseInt(minPercent) + 1);

				// Need to disable/hide icons that the combo is not possible on, or have no data...
				// IMPORTANT STANDARD
				// [minPercent 0, maxPercent 0] = NO DATA AVAILABLE, so HIDE THE BOX
				// [minPercent 1, maxPercent 1] = COMBO IS IMPOSSIBlE, so GREY OUT THE BOX AND DISABLE IT
				$character.removeClass('hide').removeClass('disabled');

				// Need hidden elements to also not mess up the margins
				// https://stackoverflow.com/questions/32355054/how-to-get-nth-child-selector-to-skip-hidden-divs
				if(minPercent == 0 && maxPercent == 0){
					$character.addClass('hide');
				};
				if(minPercent == 1 && maxPercent == 1){
					$character.addClass('disabled');
				};


				// Difficult iterator for characters other than Zelda. Feck
				// Zelda needs an alternative difficulty calculator based on the opponent's airdodge frame. Feck
				// Also need to redo the Difficulty sort since it's now sorting by airdodge frame. Triple feck
				if(id != 'zelda-dthrow-up-air'){
				
					var percentAverage = percentSum/percentDifferences.length;

					// Now calculate the percents to iterate by. Assuming there are 5 difficulty levels, take sum and divide by midway for average. So sum/2.5.
					// This calculates how much to iterate each percent by
					var diffIterator = Math.floor(percentAverage/2.5);
					// console.log(diffIterator);

					var diff = "";
					var percentDiff = (maxPercent - minPercent) + 1;

					// Now compute that difficulty
					if(0 <= percentDiff && percentDiff <= diffIterator){diff = 'very-hard'};
					if(diffIterator <= percentDiff && percentDiff <= diffIterator*2){diff = 'hard'};
					if(diffIterator*2 <= percentDiff && percentDiff <= diffIterator*3){diff = 'average'};
					if(diffIterator*3 <= percentDiff && percentDiff <= diffIterator*4){diff = 'easy'};
					if(diffIterator*4 <= percentDiff){diff = 'very-easy'};

					// Map that difficulty
					// Regretably I'll need to run through the JSON twice now, because gotta calculate an average from all values, THEN apply based off those values

					$difficulty.attr('class', 'difficulty').addClass(diff);
					$difficulty.find('.text-difficulty').text(diff);


				} else {
					// Hello Zelda
					//console.log('hello zelda');
					var $character = $('.' + index + '.character-box');
					var airdodgeStart = $character.data('airdodgestart');
					var airdodgeEnd = $character.data('airdodgeend');

					var diff = "";

					// Time to recalulate difficulty based on airdodge frames
					if(airdodgeStart == 1){diff = 'very-hard'};
					if(airdodgeStart == 2){diff = 'hard'};
					if(airdodgeStart == 3){diff = 'average'};
					if(airdodgeStart == 4){diff = 'easy'};


					$difficulty.attr('class', 'difficulty').addClass(diff);
					$difficulty.find('.text-difficulty').text(diff);
				};
			});

			// Christ this is garbage... Utter garbage

			// Map those modifiers to the Info section. Gotta run through one last time, but only a small run
			$.each(killConfirmsJSON[characterId]['moves'][moveId], function(index, value){
				$('.modifiers-stages').find('.' + index).text(value);
			});

			var rageModifier = [
				self.data('rage50'),
				self.data('rage60'),
				self.data('rage80'),
				self.data('rage100'),
				self.data('rage125'),
				self.data('rage150')
			];

			$('.modifiers-rage .col-4').each(function(){
				var theIndex = $(this).index();
				$(this).find('.minRage').text(rageModifier[theIndex][0]);
				$(this).find('.maxRage').text(rageModifier[theIndex][1]);
			});

			///////

			$('body').addClass('character-grid-active');

			// Refilter the menu based on pre-selected filter (only really applicable with difficulty, since is determined dynamically. All other attrs static)
			executeActiveFilter(self);

			// Ensure the correct 'Special Info' box is displayed, but only if it's not empty!
			var $specialInfo = $('#info-' + id);
			// console.log($specialInfo.text());
			if($specialInfo.text().trim().length){
				$specialInfo.addClass('active');
			} else {
				$('.special-info').removeClass('active');
			}

			// Update the URL
			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			var dataUrl = id;
			window.location.hash = '/' + dataUrl + '/';

			// Window to go to top on click, pretty much just for the sake of mobile and table viewports
			window.scrollTo(0, 0);
		};
	};

	function retrieveCharUrl(self){
		// Place the character's name in #page-wrapper so I can target and do things with it
		var $pagewrapper = $('#page-wrapper');
		var charUrl = self.closest('.card-deck').data('url');
		$pagewrapper.addClass(charUrl);
	};
	function pageTransition(self, transitionToAnotherGrid){

		// Need to turn off sidemenu on mobile first if a grid button is clicked!
		// if($(window).width() < 768){
		// 	$('body').removeClass('toggle-sidedrawer');
		// };

		/* --- Animate the navigation transition -- */
		var	$wrapper = $('#page-wrapper'),
			$currPage = $wrapper.children('div.pt-page-current'),
			$nonCurrPage = $wrapper.children('div.pt-page').not('div.pt-page-current');

		// Need to delay open/close function in case it's already animating. Some spastic might hit ESC twice quickly
		// Add class of 'animating' to body and remove when the animation is finished
		$('body').addClass('animating').removeClass('fixed-navbar');

		if(!$('body').hasClass('character-grid-active')){
			activateCharacterGrid(self);
			retrieveCharUrl(self);
			// variables for transition it forwards
			/* FANCIER TRANSITIONS
			outClass = 'pt-page-scaleDown',
			inClass = 'pt-page-moveFromRight pt-page-ontop';
			*/
			outClass = 'pt-page-moveToLeft';
			inClass = 'pt-page-moveFromRight pt-page-ontop';

		} else {
			if(transitionToAnotherGrid == true){
				// variables for transition it to the same screen
				// The only way this is gonna happen is if the grid is on screen and a sidemenu button is clicked, which in turn is like a card button click
				$nonCurrPage = $currPage;
			} else {

				// variables for transition it backwards
				// Remember this!

				// This is surely causing an issue
				//$('body').removeClass('character-grid-active');
				//

			 	/*FANCIER TRANSITIONS
				outClass = 'pt-page-moveToRight pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				*/
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				outClass = 'pt-page-moveToRight';
			}
		}
		// Now execute the transition with those variables from earlier
		// If we're transitioning to another character grid, the switchCharacter function needs to be invoked midway between transitions
		if(transitionToAnotherGrid == true){
			// Need to ALSO check if we're just transitioning to a different move of the same character. Different transition for that (just a fade)
			var charUrl = self.closest('.card-deck').data('url');
			if(charUrl == $('#page-wrapper').attr('class')){
				console.log('we have a match!');

				// Initiate transition between MOVES OF SAME CHARACTER
				$('#secondarynav-dropdown-menu').removeClass('show');
				_fadeOut(document.getElementById('characterGrid'), function(){
					activateCharacterGrid(self);
					console.log('transitioning between same character!');
					_fadeIn(document.getElementById('characterGrid'));
					$('body').removeClass('animating');
				});

			} else {

				// Initiate transition BETWEEN DIFFERENT CHARACTERS

				// Initiate transition between MOVES OF SAME CHARACTER
				$('#secondarynav-dropdown-menu').removeClass('show');
				_fadeOut(document.getElementById('character-wrapper'), function(){
					activateCharacterGrid(self);
					console.log('transitioning between different characters!');
					$('#page-wrapper').removeClass();
					retrieveCharUrl(self);
					_fadeIn(document.getElementById('character-wrapper'));
					$('body').removeClass('animating');
				});
			}

		} else {
			// Initiate STANDARD transition
			// $nonCurrPage.removeClass('pt-page-current');
			// $currPage.addClass('pt-page-current');
			//$('#card-wrapper').removeClass('pt-page-current');
			if($('body').hasClass('viewport-desktop')){
				$('#primarynav .navbar-nav').hide();
			}
			$currPage.addClass(outClass).on(animEndEventName, function() {

				$(this).removeClass().addClass('pt-page');
				$currPage.off( animEndEventName );
				$('body').removeClass('animating');

				console.log('transitioning standard!');

				// Nuke that character class from the page-wrapper AFTER the 'transition-out'
				if(!$('body').hasClass('character-grid-active')){
					$('#page-wrapper').removeClass();
				}
			});
			$nonCurrPage.removeClass().addClass('pt-page pt-page-current').addClass(inClass).on(animEndEventName, function() {
				
				var $this = $(this);
				$this.attr('class', 'pt-page pt-page-current');
				$nonCurrPage.off( animEndEventName );
				$('body').addClass('fixed-navbar');
				if($('body').hasClass('viewport-desktop')){
					// what was this for??
					// fading in the top-right nav!
					//$('#primarynav .navbar-nav').fadeIn('fast');
					// var primNav = document.getElementById('primarynav');
					 _fadeIn(document.getElementById('top-right-nav'));
					//_fadeOut(document.getElementById('notification'));
				}
			});
		}
	};


	function deactivateCharacterGrid(){
		if(!$('body').hasClass('animating')){
			pageTransition();
			$('#nav-title').text('Select a Kill Confirm');
			$('.moveBtn.active').removeClass('active');
			$('.nav-moves a.active').removeClass('active');
			$('#secondarynav-dropdown .dropdown-item.active').removeClass('active');

			$('body').removeClass('filtersActive');
			$('#filter-toggle').removeClass('active');

			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			var constructedUrl = baseUrl + '/#/';
			window.location.replace(constructedUrl);
		};
	}


	// RAGE MODIFIER STICKY
	// The was originally within activateCharacter(), but after serveral transitions it begins to lag the app
	// The requestAnimatonFrame references may have been stacking and causing scroll jank, so it's been moved
	// here and is declared only once.
	
	var $charContainer = $('#characterModal .characterContainer');
	function fixedRagebar(self){
		
		var windowTop = self.scrollTop();
		
		containerWidth = $charContainer.innerWidth();
		marginOffset = $charContainer.css('margin-top');
		if(120 < windowTop){
			$('#characterModal .sticky').addClass('stuck');
			$('.stuck').css({ top: marginOffset, width: containerWidth });
			$('.stickyName').slideDown('fast');

		} else {
			$('.stuck').css({ top: 0, width: '100%' }); // restore the original top value of the sticky element
			$('.sticky').removeClass('stuck');
			$('.stickyName').hide();
		}
	}

	// Limiting min execution interval on scroll to help prevent scroll jank
	// http://joji.me/en-us/blog/how-to-develop-high-performance-onscroll-event
	var scroll = function(){
		fixedRagebar($charContainer);

		// Need secondary nav scroll functions here!
		////////////////////////////////////////////
	}
	var $window = $charContainer;
	var lastScrollTop = $window.scrollTop();

	if (_requestAnimationFrame) {
		loop();
	}
	function loop() {
		var scrollTop = $window.scrollTop();
		if (lastScrollTop === scrollTop) {
			_requestAnimationFrame(loop);
			return;
		} else {
			lastScrollTop = scrollTop;
			// fire scroll function if scrolls vertically
			scroll();
			_requestAnimationFrame(loop);
		}
	}
	fixedRagebar($charContainer);

	// Using traditional 'click()' bindings will not work on dynamically generated character boxes!
	// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements

	// http://api.jquery.com/trigger/

	// $('#characterGrid').on('activateCharBox', function(event){
	// 	activateCharacter($(this));
	// });

	// THIS IS THE CHARACTER DATA CONTROLLER, RIGHT HERE!
	$('body').on('click', '.moveBtn', function(){

		// Check if the grid is already out
		// If the grid is out and the moveBtn is clicked, that means we're just transitioning between character grids and need a different kind of transition
		// This is for the side menu, which has buttons that trigger a click for its counterpart .moveBtn in card grid

		// check to see if it already has a class of 'active' first. Don't want people clicking the same button twice
		if(!$(this).hasClass('active')){
			// Update the URL
			//var moveUrl = $('.moveBtn.active').attr('id');
			var moveUrl = $(this).attr('id');
			var hashUrl = '/' + moveUrl;
			render(hashUrl);
			/*if($('body').hasClass('character-grid-active')){
				// Rather than this, check if there are already two parts of the URL that exist...

				//pageTransition($(this), characterGridActive = true);
			} else {
				pageTransition($(this));
			}*/
		};
	});

	$('#characterGrid').on('click', '.character-box:not(.disabled)', function(){
		//activateCharacter($(this));
		// Update the URL
		console.log('clicked!');
		var moveUrl = $('.moveBtn.active').attr('id');
		var charUrl = $(this).data('url');
		var hashUrl = '/' + moveUrl + '/' + charUrl;
		console.log('hash url is: ' + hashUrl);
		render(hashUrl);
	});


	function render(url){

		// Get the keywords from the url
		var temp = url.split('/')[0];
		var parts = url.split('/')

		// If 'homescreen' does NOT exist in URL...
		//if(baseUrl != currentUrl && baseUrl + '#' != currentUrl && baseUrl + '#/' != currentUrl && !(currentUrl.indexOf('homescreen') > -1)){

			// Current URL is not the base URL
			console.log('urls do not match! With new function');
		//};

			// Target the moveBtn with the ID defined in the URl
			// Also check if it exists. URL may be invalid
			var characterGrid = "";
			if(parts[1]){
				characterGrid = parts[1];
			};
			var characterBox = "";
			if(parts[2]){
				characterBox = $('#characterGrid .character-box.' + parts[2]);
			};

			// and activate it
			if(parts[1]){
				console.log('trying to transition character from URL');
				if(!$('body').hasClass('character-grid-active')){
					console.log('char grid not active');
						if(parts[1] == 'about'){
							// activate About box
							activateMenuBox('page-about');
						} else if (parts[1] == 'credits'){
							// activate Credits box
							activateMenuBox('page-credits');
						} else {
							pageTransition($('#' + parts[1]));
						}
							
				} else {
					console.log('char grid active');
					pageTransition($('#' + parts[1]), characterGridActive = true);


				} else if(parts[2] && parts[2] != 'info'){

					// Working
					//activateCharacter($('#characterGrid .character-box.bayonetta'));
					log
					activateCharacter(characterBox);
					//function pageTransition(self, transitionToAnotherGrid){
					//pageTransition(characterBox);

				} else if(parts[2] == 'info'){
					activateInfoBox();
				}
			} else {



				// It needs to fallback though in case the character is undefined.
				console.log('This character does not exist, yo');
				$('#notification').html('Looks like this move or character does not exist.<br>Please check the URL.').show();
				setTimeout(function(){
					_fadeOut(document.getElementById('notification'));
				}, 3000)
			}
		}
		setSendPageView(url);
	};
	render(decodeURI(window.location.hash));

	$(window).on('hashchange', function(){
        // On every hash change the render function is called with the new hash.
        // This will navigate the app and allow native back/forward functionality
        render(decodeURI(window.location.hash));
	});

	// The URL constructers/deconstructers are back to haunt me
	function deconstructUrl(){
		var baseUrl = window.location.protocol + "//" + window.location.host + '/';
		var currentUrl = $(location).attr('href');
		console.log('base url is ' + baseUrl + ' and current url is ' + currentUrl);

		// Putting in a condition to see if app is run from homescreen
		// URL will look like baseUrl + '/?utm_source=homescreen'
		//
		// If 'homescreen' does NOT exist in URL...
		if(baseUrl != currentUrl && baseUrl + '#' != currentUrl && baseUrl + '#/' != currentUrl && !(currentUrl.indexOf('homescreen') > -1)){

			// Current URL is not the base URL
			console.log('urls do not match!');

			// Time to deconstruct that sucker
			var parts = decodeURI(window.location.hash).split('/');

			// Need to check if they're dialling one of the menu links, or a character
			// for(i=0; i<parts.length; i++){
			// 	console.log('url part is: ' + i + ' ' + parts[i]);
			// }
			// Everything after index 3 is relevant.
			// Index 1 == moveName || About || Credits
			// Index 2 == characterName || info

			if(parts[1] == 'about'){
				// activate About box
				activateMenuBox('page-about');
			} else if (parts[1] == 'credits'){
				// activate Credits box
				activateMenuBox('page-credits');
			} else {

				// Target the moveBtn with the ID defined in the URl
				// Also check if it exists. URL may be invalid
				var characterGrid = parts[1].length ? parts[1] : "";
				console.log(characterGrid);
				var characterBox = parts[2].length ? $('#characterGrid .character-box.' + parts[2]) : "";

				// and activate it
				if(parts[1].length){
					console.log('trying to transition character from URL');
					pageTransition($('#' + parts[1]));
					if(parts[2].length && parts[2] != 'info'){

						// Working
						//activateCharacter($('#characterGrid .character-box.bayonetta'));
						activateCharacter(characterBox);

					} else if(parts[2] == 'info'){
						activateInfoBox();
					}
				} else {
					// It needs to fallback though in case the character is undefined.
					console.log('This character does not exist, yo');
					$('#notification').html('Looks like this move or character does not exist.<br>Please check the URL.').show();
					setTimeout(function(){
						_fadeOut(document.getElementById('notification'));
					}, 3000)
				}

				// Need to activate the correct rage button depending on the URL...
				//var rageAmount = current
				//rageAdjustment($(urlCharacter).find('.rageBtn[data-rage='));
			}
		}
	}
	// For some reason this fires incorrectly if left unwrapped?
	// setTimeout(function(){
	// 	deconstructUrl();
	// }, 0);

	function activateCharacter(self){

		// Add class of 'selected' to the clicked character box. This is used for transitioning between characters while the modal box is open
		self.addClass('selected');

		//$charModal.find('.backButton').addClass('active');
		$('body').addClass('no-scroll character-active');

		// Grab the data-index attr added by Knockout for each box. This is used to link the box to the JSON data that's generated in the modal
		var $charBox = self.closest('.character-box.selected');
		var $index = $charBox.data('index');

		// Character Modal initialisers
		// I want these outside the 'getJSON' request so they're loaded before the JSON is, otherwise there is NO IMAGE for a brief moment.
		var $charModal = $('#characterModal');

		// Need to strip all classes from 'characterImageContainer' to remove the applied character class
		// https://stackoverflow.com/questions/5363289/remove-all-classes-except-one
		$charModal.find('.characterImageContainer').attr('class', 'characterImageContainer');

		$charModal.removeClass('animate');

		// Firstly, generate a request for the JSON file
		// This is referring to the JSON var created earlier

		// Begin the mapping

		var name = self.data('name'),
			urlName = self.data('url'),
			bgColour = self.data('bgcolour'),
			weight = parseInt(self.data('weight')),
			fallspeed = self.data('fallspeed'),
			gravity = self.data('gravity'),
			airdodgeStart = parseInt(self.data('airdodgestart')),
			airdodgeEnd = parseInt(self.data('airdodgeend')),
			textContrast = self.data('textcontrast'),
			airdodge = airdodgeStart + ' - ' + airdodgeEnd,
			minPercent = parseInt(self.attr('data-minpercent')),
			maxPercent = parseInt(self.attr('data-maxpercent'));

		// console.log('min perc is:' + minPercent + ' and max perc is: ' + maxPercent);

		var $moveBtnActive = $('.moveBtn.active');

		var bfNormalMin = parseInt($moveBtnActive.data('bfnormalmin')),
			bfLowPlatMin = parseInt($moveBtnActive.data('bflowplatmin')),
			bfTopPlatMin = parseInt($moveBtnActive.data('bftopplatmin')),
			dlLowPlatMin = parseInt($moveBtnActive.data('dllowplatmin')),
			dlTopPlatMin = parseInt($moveBtnActive.data('dltopplatmin')),

			svNormalMin = parseInt($moveBtnActive.data('svnormalmin')),
			svPlatMin = parseInt($moveBtnActive.data('svplatmin')),

			tcNormalMin = parseInt($moveBtnActive.data('tcnormalmin')),
			tcLowPlatMin = parseInt($moveBtnActive.data('tclowplatmin')),
			tcSidePlatMin = parseInt($moveBtnActive.data('tcsideplatmin')),
			tcTopPlatMin = parseInt($moveBtnActive.data('tctopplatmin'));

		// Time to activate the Character Modal
		$charModal.addClass('active');

		if(textContrast){
			$charModal.addClass(textContrast);
		}
		$charModal.addClass(urlName);

		$('#character-underlay').css('backgroundColor', bgColour);
		$charModal.find('.characterImageContainer, .stickyName').css('backgroundColor', bgColour);
		$charModal.find('.legend-keys--shift, .legend-keys--escape').css('color', bgColour);

		// Trick to restart the CSS animation for the characterImage slideIn. What a headache.
		// https://css-tricks.com/restart-css-animation/
		// https://stackoverflow.com/questions/31028479/restarting-css-animation-via-javascript
		var returnID = function(id){
			return document.getElementById(id);
		}
		var $charImage = $('#characterModalImage');
		returnID('characterModal').offsetWidth = returnID('characterModal').offsetWidth;
		returnID('characterModal').classList.add('animate');

		$charModal.find('.grid-percRange .minPerc').text(minPercent);
		$charModal.find('.grid-percRange .maxPerc').text(maxPercent);

		$charModal.find('span[data-ref="name"], .stickyName').text(name);

		// Generating the difficulty text via the global function in characters.js
		//var difficultyAmount = computeDifficulty(minPercent, maxPercent);
		// Fuck calculating difficulty again, just grab it from the charBox HTML like a good chap
		
		//$charModal.find('.grid-difficulty').html('<span class="' + difficultyAmount + '">' + difficultyAmount + ' - ' + percRange + '%</span>');
		$charModal.find('.grid-difficulty').html($charBox.find('.grid-difficulty').html());
		$charModal.find('.characterName').text(name);

		var $charOverviewItem = $charModal.find('.characterOverview');
		$charOverviewItem.find('li[data-ref="weight"]').html('Weight' + '<span class="value">' + weight + '</span>');
		$charOverviewItem.find('li[data-ref="fallspeed"]').html('Fallspeed' + '<span class="value">' + fallspeed + '</span>');
		$charOverviewItem.find('li[data-ref="airdodge"]').html('Airdodge' + '<span class="value">' + airdodge + '</span>');
		$charOverviewItem.find('li[data-ref="gravity"]').html('Gravity' + '<span class="value">' + gravity + '</span>');

		// Map those mf-ing values

		var $fd = $charModal.find('.stage-fd');
		$fd.find('span[data-ref="fdNormalMin"]').text(minPercent).attr('data-defaultmin', minPercent);
		$fd.find('span[data-ref="fdNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		console.log('min percent is: ' + minPercent + ' and max percent is: ' + maxPercent);

		var $bf = $charModal.find('.stage-bf');
		$bf.find('span[data-ref="bfNormalMin"]').text(minPercent + bfNormalMin).attr('data-defaultmin', minPercent + bfNormalMin);
		$bf.find('span[data-ref="bfNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$bf.find('span[data-ref="bfLowPlatMin"]').text(minPercent + bfLowPlatMin).attr('data-defaultmin', minPercent + bfLowPlatMin);
		$bf.find('span[data-ref="bfLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$bf.find('span[data-ref="bfTopPlatMin"]').text(minPercent + bfTopPlatMin).attr('data-defaultmin', minPercent + bfTopPlatMin);
		$bf.find('span[data-ref="bfTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

		var $dl = $charModal.find('.stage-dl');
		$dl.find('span[data-ref="dlNormalMin"]').text(minPercent).attr('data-defaultmin', minPercent);
		$dl.find('span[data-ref="dlNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$dl.find('span[data-ref="dlLowPlatMin"]').text(minPercent + dlLowPlatMin).attr('data-defaultmin', minPercent + dlLowPlatMin);
		$dl.find('span[data-ref="dlLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$dl.find('span[data-ref="dlTopPlatMin"]').text(minPercent + dlTopPlatMin).attr('data-defaultmin', minPercent + dlTopPlatMin);
		$dl.find('span[data-ref="dlTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

		var $sv = $charModal.find('.stage-sv');
		$sv.find('span[data-ref="svNormalMin"]').text(minPercent + svNormalMin).attr('data-defaultmin', minPercent + svNormalMin);
		$sv.find('span[data-ref="svNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$sv.find('span[data-ref="svPlatMin"]').text(minPercent + svPlatMin).attr('data-defaultmin', minPercent + svPlatMin);
		$sv.find('span[data-ref="svPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

		var $tc = $charModal.find('.stage-tc');
		$tc.find('span[data-ref="tcNormalMin"]').text(minPercent + tcNormalMin).attr('data-defaultmin', minPercent + tcNormalMin);
		$tc.find('span[data-ref="tcNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$tc.find('span[data-ref="tcLowPlatMin"]').text(minPercent + tcLowPlatMin).attr('data-defaultmin', minPercent + tcLowPlatMin);
		$tc.find('span[data-ref="tcLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$tc.find('span[data-ref="tcSidePlatMin"]').text(minPercent + tcSidePlatMin).attr('data-defaultmin', minPercent + tcSidePlatMin);
		$tc.find('span[data-ref="tcSidePlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
		$tc.find('span[data-ref="tcTopPlatMin"]').text(minPercent + tcTopPlatMin).attr('data-defaultmin', minPercent + tcTopPlatMin);
		$tc.find('span[data-ref="tcTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

		// Now to render % differences... Better to take care of them all in one loop
		// I want to see if rage button is not at default first though, to avoid double-handling the percent range calculations
		// This causes the code to loop through twice - once for rendering the numbers and another for animating them. Is inefficent, really
		// This could probably be optimised later

		// setTimeout(function(){
		rageAdjustment($charModal.find('.rageBtn.active'));
		// }, 500);

		var $activeMoveBtn = $('.moveBtn.active');
		$('#modalTitle span').html($activeMoveBtn.closest('.card-deck').data('name') + ' - ' + $activeMoveBtn.html());

		// Need to resize based on window.innerHeight due to mobile address bar sizings.
		// https://developers.google.com/web/updates/2016/12/url-bar-resizing
		$(window).resize(function(e){
			fixedRagebar($('#characterModal .characterContainer'));
		})

	}

	function deactivateCharacter(){
		var $body = $('body');
		$body.removeClass('no-scroll');
		$('#character-underlay').css('backgroundColor', 'transparent');

		// Page does not force reload if '#' is in the URL
		// https://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
		// Update the URL
		var locationHost = window.location.host;
		var baseUrl = window.location.protocol + "//" + locationHost;
		var dataUrl = $('.moveBtn.active').attr('id');
		var constructedUrl = baseUrl + '/#/' + dataUrl + '/';

		// determine if body has clas 'character-active', to see if we're deactivating a character or a menu page
		if($body.hasClass('character-active')){
			var $charModal = $('#characterModal');
			$charModal.removeClass();
			$charModal.find('.rageModifier').removeClass('stuck');
			$charModal.find('.characterBorder').css('height', 'auto');
			$('#characterGrid .character-box.selected').removeClass('selected');
			$body.removeClass('character-active');
		} else {
			if($body.hasClass('show-info-box')){
				$body.removeClass('show-info-box');
			};
			$('.infoModal').hide();
			$('#sidedrawer-underlay').css('backgroundColor', 'transparent');
			$('#menuBackButton').removeClass('active');
			$('#page-info .giphy iframe').attr('src', '');

		};
		window.location.hash = '/' + dataUrl + '/';
	};

	function transitionCharacter(){
		var $charModal = $('#characterModal');
		$charModal.attr('class', 'active');
		$('#characterGrid .character-box.selected').removeClass('selected');
	}



	function rageAdjustment(self, animateNumbers){
		var rageAmount = self.attr("data-rage");
		
		self.siblings('.rageBtn').removeClass('active');
		self.addClass('active');
		var rageAdjMin = 0;
		var rageAdjMax = 0;

		var $moveBtnActive = $('.moveBtn.active');
		var rage50 = $moveBtnActive.data('rage50'),
			rage60 = $moveBtnActive.data('rage60'),
			rage80 = $moveBtnActive.data('rage80'),
			rage100 = $moveBtnActive.data('rage100'),
			rage125 = $moveBtnActive.data('rage125'),
			rage150 = $moveBtnActive.data('rage150');

		if(rageAmount == "0"){ rageAdjMin = 0; rageAdjMax = 0 }
		if(rageAmount == "50"){ rageAdjMin = rage50[0]; rageAdjMax = rage50[1] }
		if(rageAmount == "60"){ rageAdjMin = rage60[0]; rageAdjMax = rage60[1] }
		if(rageAmount == "80"){ rageAdjMin = rage80[0]; rageAdjMax = rage80[1] }
		if(rageAmount == "100"){ rageAdjMin = rage100[0]; rageAdjMax = rage100[1] }
		if(rageAmount == "125"){ rageAdjMin = rage125[0]; rageAdjMax = rage125[1] }
		if(rageAmount == "150"){ rageAdjMin = rage150[0]; rageAdjMax = rage150[1] }

		// Hmm, if min percent goes below zero, this will affect the max percent range, right???? NO, IT PROBABLY SHOULDN'T (I think...)
		$('#characterModal .stage .table').each(function(){
			var $this = $(this);

			var $minPerc = $this.find('.minPerc');
			var $maxPerc = $this.find('.maxPerc');
			var $percRange = $this.find('.percRange');
			// Why does this not work??
			/*var defaultMinPercent = $minPerc.data('defaultmin');
			var defaultMaxPercent = $maxPerc.data('defaultmax');*/
			// But this does?!
			var defaultMinPercent = $minPerc.attr('data-defaultmin');
			var defaultMaxPercent = $maxPerc.attr('data-defaultmax');

			// console.log($this.find('.stage-part-name').text() + ': MinPercent is: ' + $minPerc.text() + ' MaxPercent is: ' + $maxPerc.text() + '\ndefaultMinPercent is: ' + defaultMinPercent + ' and defaultMaxPercent is: ' + defaultMaxPercent);

			var adjustedMinPercent = parseInt(defaultMinPercent) + rageAdjMin;
			var adjustedMaxPercent = parseInt(defaultMaxPercent) + rageAdjMax;

			//console.log('adjustedMinPercent is: ' + adjustedMinPercent + ' and adjustedMaxPercent is: ' + adjustedMaxPercent);

			// Some min %'s go below zero at max rage (wtf). Need to round to 0
			// Adjusting min percent last in case it goes below zero and fucks the percRange var
			adjustedMinPercent = Math.max(0, adjustedMinPercent);
			var percRange = (adjustedMaxPercent - adjustedMinPercent) + 1;
			// console.log(percRange);

			if(adjustedMaxPercent < adjustedMinPercent ){
				// On some stages, DingDong is impossible to kill with on some characters (like Satan on Battlefield)
				// Will need to render 'N/A' in those cases
				console.log('dingdong is impossible!');
				$minPerc.text('N/A').addClass('nosymbol');
				$maxPerc.text('N/A').addClass('nosymbol');
				$percRange.text('-').addClass('nosymbol');
			} else {
				$minPerc.removeClass('nosymbol');
				$maxPerc.removeClass('nosymbol');
				$percRange.removeClass('nosymbol');

				if(animateNumbers == true){
					$minPerc
						.prop('number', $minPerc.text())
						.animateNumber({ number : adjustedMinPercent }, 200);
					$maxPerc
						.prop('number', $maxPerc.text())
						.animateNumber({ number : adjustedMaxPercent }, 200);
					$percRange
						.prop('number', $percRange.text())
						.animateNumber({ number : percRange }, 200);
				} else {
					$minPerc.text(adjustedMinPercent);
					$maxPerc.text(adjustedMaxPercent);
					$percRange.text(percRange);
				}
			}
		});

	};

	function activateMenuBox(target, urlPart){
		// check to see if a character is currently active
		// realisitically this will probably never be executed...
		if($('body').hasClass('active-character')){
			deactivateCharacter();
		}

		// Rewrite the URL and append the section to the end
		if(urlPart){
			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			window.location.hash = '/' + urlPart;
			setSendPageView(urlPart);
		};
		$('body').addClass('no-scroll').removeClass('text-dark');
		$('#sidedrawer-underlay').css('backgroundColor', 'rgb(136,136,136)');
		$('#menuBackButton').addClass('active');
		$('#' + target).show();
	}

	// Transitions
	function transitionRageForward($activeRageButton){
		if(!$activeRageButton.is(':last-of-type')){
			rageAdjustment($activeRageButton.next(), animateNumbers = true);
		} else {
			rageAdjustment($('.rageModifier .rageBtn:first-of-type'), animateNumbers = true);
		}
	}
	function transitionRageBackward($activeRageButton){
		if(!$activeRageButton.is(':first-of-type')){
			rageAdjustment($activeRageButton.prev(), animateNumbers = true);
		} else {
			rageAdjustment($activeRageButton.siblings('.rageBtn:last-of-type'), animateNumbers = true);
		}
	}
	function transitionCharacterForward(activeContainer){
		var $activeContainer = $(activeContainer);
		// Loop back to first character if press right key on last character
		// WAIT, first check to see if it HAS visible siblings. The search box may remove them and mess up this code
		// Welp, next() will only return the VERY NEXT element. Need to return the next :visible element, regardless
		// of whether the element is a direct sibling or not.
		// Using nextAll and prevAll in the cases where a next() and prev() relative to :visible is required.
		// https://stackoverflow.com/questions/6823842/select-the-next-element-with-a-specific-attribute-jquery
		if($activeContainer.siblings('.character-box').is(':visible')){
			if($activeContainer.nextAll('.character-box').is(':visible')){
				transitionCharacter();
				//activateCharacter($activeContainer.siblings('.character-box:visible'));
				//activateCharacter($activeContainer.nextAll('.character-box:visible'));
				var $nextVisibleChar = $activeContainer.nextAll('.character-box:not(.disabled):visible').first();
				activateCharacter($nextVisibleChar);
			} else {
				// Loop backward to first VISIBLE character if press right key on last character
				transitionCharacter();
				activateCharacter($activeContainer.siblings('.character-box:not(.disabled):visible').first());
			}
		}
	}
	function transitionCharacterBackward(activeContainer){
		var $activeContainer = $(activeContainer);
		if($activeContainer.siblings('.character-box').is(':visible')){
			//console.log('siblings are visible');
			if($activeContainer.prevAll('.character-box').is(':visible')){
				//console.log('previous visible box exists')
				transitionCharacter();
				// PrevAll is working, but is not determining is the element is fucking VISIBLE or not!
				// :visible:last will return Bayo
				// :visible:first will work until elements are separated
				var $prevVisibleChar = $activeContainer.prevAll('.character-box:not(.disabled):visible').first();
				activateCharacter($prevVisibleChar);
			} else {
				// Loop backward to first VISIBLE character if press right key on last character
				transitionCharacter();
				activateCharacter($activeContainer.siblings('.character-box:not(.disabled):visible').last());
			}
		}
	}

	// Filter box functions
	// Earlier this was in page.js after much work, but Knockout wipes out the generated
	// index numbers when removing/adding character boxes. No solution could be found to permanently
	// store observable knockout values for the index numbers. Rip.
	// https://forum.jquery.com/topic/dynamically-filter-a-list-based-on-an-entry-in-a-text-box
	function searchList(value){
		$('.character-box').each(function(){
			var theName = $(this).find('.characterTitleBar span').text().toLowerCase();
			(theName.indexOf(value) >= 0) ? $(this).show() : $(this).hide();
		})
	}
	$('#search').keyup(function(){
		var valThis = $(this).val().toLowerCase();
		$searchbox = $(this).closest('.search-box');
		if($(this).val() == ""){
			console.log('does not have value');
			$searchbox.removeClass('active');
		} else {
			console.log('has value');
			$(this).closest('.search-box').addClass('active');
		}
		searchList(valThis);
	});

	$('.search-box .clear-input').click(function(){
		$('.search-box #search').val('').closest('.search-box').removeClass('active');
		searchList('');
	});


	// Character key events

	// Include handlers for if SHIFT is held for rage button shifting
	var shiftKey = 16; // SHIFT
	var isShiftActive = false;
	var keyleft = 37;
	var keyright = 39;
	var key1 = 49;
	var key2 = 50;
	var key3 = 51;
	var key4 = 52;
	var key5 = 53;
	var key6 = 54;
	var key7 = 55;
	var keyi = 73;

	$(document).keyup(function(e){

		if(e.which == shiftKey) isShiftActive = false;

	}).keydown(function(e){
		e = e || window.event;

		// Need modal to close on ESC
		// https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
		var isEscape = false;
		if ("key" in e){
			isEscape = (e.key == "Escape" || e.key == "Esc");
		} else {
			isEscape = (e.keyCode == 27);
		}
		if (isEscape){
			// if character is active, deactivate it
			if($('body').hasClass('no-scroll')){
				deactivateCharacter();
			} else if ($('body').hasClass('character-grid-active')){
				deactivateCharacterGrid();
			} else {
				// else toggle the sidemenu instead
				toggleSidebar();
			}
			
		}
		if(e.which == shiftKey) isShiftActive = true;

		// I want to be able to access info with 'I' if a characterGrid is out
		// Need to detect if search field is focussed first though
		// https://stackoverflow.com/questions/967096/using-jquery-to-test-if-an-input-has-focus
		if(e.which == keyi){
			if($('.moveBtn').hasClass('active') && !$('#search').is(':focus')){
				$('body').addClass('show-info-box');
				activateInfoBox();
			};
		}

		// Need to check if character is currently active.
		if($('#characterModal.active').length){
			var $this = $(this);
			//console.log('modal is active!');
			// Need to check if SHIFT is held.
			if(isShiftActive){
				if(e.which == keyright){
					//console.log('shift held and right');
					transitionRageForward($this.find('.rageBtn.active'), animateNumbers = true);
				}
				if(e.which == keyleft){
					//console.log('shift held and left');
					transitionRageBackward($this.find('.rageBtn.active'), animateNumbers = true);
				}

			} else {
				if(e.which == keyright){transitionCharacterForward($('.character-box.selected'))};
				if(e.which == keyleft){transitionCharacterBackward($('.character-box.selected'))};

				if(e.which == key1){rageAdjustment($this.find('.rageBtn:nth-child(1)', animateNumbers = true))};
				if(e.which == key2){rageAdjustment($this.find('.rageBtn:nth-child(2)', animateNumbers = true))};
				if(e.which == key3){rageAdjustment($this.find('.rageBtn:nth-child(3)', animateNumbers = true))};
				if(e.which == key4){rageAdjustment($this.find('.rageBtn:nth-child(4)', animateNumbers = true))};
				if(e.which == key5){rageAdjustment($this.find('.rageBtn:nth-child(5)', animateNumbers = true))};
				if(e.which == key6){rageAdjustment($this.find('.rageBtn:nth-child(6)', animateNumbers = true))};
				if(e.which == key7){rageAdjustment($this.find('.rageBtn:nth-child(7)', animateNumbers = true))};
			}
		}

	});

	function toggleSidebar(){
		$('body').toggleClass('toggle-sidedrawer');
	}
	$('#sidedrawer-overlay').click(function(){
		toggleSidebar();
	});
	$('.navbar-header').on('click', '#navbar-toggler', function(){
		console.log('toggler clicked!');
		toggleSidebar();
	});

	$('#characterModal').on('click', '.rageBtn', function(){
		rageAdjustment($(this), animateNumbers = true);
	});


	/* --- */

	$('#filter-toggle').click(function(e){
		e.stopPropagation();
		var $this = $(this);
		$this.toggleClass('active');
		//$this.next('.btn-group.mobile').toggleClass('active');
		$('body').toggleClass('filtersActive');
	});

	$('#character-wrapper-back').click(function(){
		deactivateCharacterGrid();
	});

	$('#icon-next').click(function(){
		transitionCharacterForward($('.character-box.selected'));
	});
	$('#icon-prev').click(function(){
		transitionCharacterBackward($('.character-box.selected'));
	});
	$('.backButton').click(function(){
		deactivateCharacter();
	});

	$('#about').click(function(e){
		e.preventDefault();
		activateMenuBox('page-about', 'about');
	});
	$('#credits').click(function(e){
		e.preventDefault();
		activateMenuBox('page-credits', 'credits');
	});
	function activateInfoBox(){
		$('#page-info .detailed-info').hide();
		$('body').addClass('show-info-box');
		activateMenuBox('page-info');
		var $moveBtnActive = $('.moveBtn.active');
		var currentMove = $moveBtnActive.attr('id');
		var giphyVid = $moveBtnActive.data('giphy');
		var giphySource = $moveBtnActive.data('giphy-source');

		// Giphy stuff here
		//console.log(giphyVid);
		$('#page-info iframe').attr('src', giphyVid);
		$('#page-info .giphy a').attr('href', giphySource);
		$('#page-info .' + currentMove).show();
		//var theUrl = window.location.href + 'info/';
		//window.location = theUrl;
		window.location.hash = '/' + currentMove + '/info/';
		setSendPageView(currentMove + '/info');
	};

	$('#info').click(function(){
		$('body').addClass('show-info-box')
		activateInfoBox();
	});

	$('#characterGrid').on('click', '.character-box.disabled', function(){
		// $('body').addClass('show-info-box')
		// activateInfoBox();
		var moveUrl = $('.moveBtn.active').attr('id');
		var hashUrl = '/' + moveUrl + 'info/';
		console.log(hashUrl);
		render(hashUrl);
	});

	$('#filter-dropdown-btn').click(function(e){
		e.stopPropagation();
		$this = $(this);
		$this.toggleClass('active');
		$this.closest('.navbar-top-links').toggleClass('open');
	});

	$('#secondarynav-dropdown').click(function(e){
		e.stopPropagation();
		$('#secondarynav-dropdown-menu').toggleClass('show');	
	});

	$('#secondarynav').on('click', '.dropdown-item', function(e){
		e.preventDefault();
		var $this = $(this);
		var ident = $this.data('ident');
		$('.moveBtn[id=' + ident + ']').trigger('click');
	});

	$('#about-menu-toggler').click(function(e){
		e.stopPropagation();
		$('body').toggleClass('toggle-aboutmenu');
	});

	$('#logo-link').click(function(e){
		e.preventDefault();
		toggleSidebar();
		if($('body').hasClass('character-grid-active')){
			deactivateCharacterGrid();
		};
	});

	function ascendingOrDescendingFilter(self){
		var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
		var $element = self;

		if($element.hasClass('active')){
			$element.toggleClass('asc');
		} else {
			$filterButtons.removeClass('active asc');
			$element.addClass('active');
		};

		var $grid = $('#characterGrid');
		var $gridItem = $grid.children('.character-box');
	};

	$('#sort-name').click(function(){
		ascendingOrDescendingFilter($(this));
		sortName($(this));
	});
	$('#sort-weight').click(function(){
		ascendingOrDescendingFilter($(this));
		sortWeight($(this));
	});
	$('#sort-difficulty').click(function(){
		ascendingOrDescendingFilter($(this));
		sortDifficulty($(this));
	});
	$('#sort-fallspeed').click(function(){
		ascendingOrDescendingFilter($(this));
		sortFallspeed($(this));
	});
	$('#sort-gravity').click(function(){ 
		ascendingOrDescendingFilter($(this));
		sortGravity($(this));
	});

	/////////////////////////////////////////////////////////////////////////////
	// Reset dropdowns on document click
	// https://craigmdennis.com/articles/close-dropdowns-clicking-outside-jquery/
	/////////////////////////////////////////////////////////////////////////////

	$(document).click(function(){
		$('#secondarynav-dropdown-menu').removeClass('show');
		$('#filter-dropdown-btn').removeClass('active');
		//$('#sort').removeClass('open');


		// Deactivate the filter toggle
		$('#secondarynav .dropdown').removeClass('show');
		$('#secondarynav #secondarynav-dropdown-menu').removeClass('show');
		$('body').removeClass('toggle-aboutmenu');
		$('body').removeClass('filtersActive');
		$('#filter-toggle').removeClass('active');
	});
	$('#sort').click(function(e){
		e.stopPropagation();
	});
	// $('#filter-toggle').on('focusout', function(){
	// 	$(this).removeClass('open');
	// 	$('body').removeClass('filtersActive');
	// 	console.log('now close the menu!');
	// })

	//////////////////////////////////////////////////////////////////////////////


	function toggleCheck(self){
		$checkbox = self.find('.checkbox');
		if($checkbox.hasClass('fa-check')){
			$checkbox.removeClass('fa-check').addClass('fa-times');
		} else {
			$checkbox.removeClass('fa-times').addClass('fa-check');
		};
	};
	$('.add-extra-info').click(function(){
		$this = $(this);
		if($this.hasClass('add-info-grid')){
			// $this.toggleClass('active');
			// $this.find('.checkbox').removeClass;
			toggleCheck($this);

			$('body').toggleClass('show-extra-info');

		}
	});

	$('#side-menu').on('click', '.components a', function(e){
		e.preventDefault();
		var dataref = $(this).data('ref');
		$('.card-deck #' + dataref).trigger('click');
	});
};