
var Page = (function(){

	// declare the view model used within the page
	function RenderViewModel(){

		var self = this;
		self.character = ko.observableArray([]);
		self.killConfirm = ko.observableArray([]);
		self.stage = ko.observableArray([]);
		
		// This is new!
		//self.moves = ko.observableArray([]);
		//self.percents = ko.obserableArray([]);

		// !!!
		// This could also be important in allowing the Moves to be iterated
		// !!!
		// Probably not though. It's just var declaration


		//self.moves = ko.observableArray(moves);
		/*var moves = function(moveName){
			this.moveName = moveName;
		}*/


		// Filter is finally bloody working. Ty based 'super cool'
		// https://stackoverflow.com/questions/36283070/search-filter-with-knockoutjs
		// Can't use this after all, as Knockout doesn't store the index numbers
		// Refactored code is in custom.js
		/*self.query = ko.observable('');

		self.filterCharacters = ko.computed(function(){
			var search = self.query().toLowerCase();
			if(!search){
				return self.character();
			} else {
				return ko.utils.arrayFilter(self.character(), function(item){
					return item.name.toLowerCase().indexOf(search) !== -1;
				});
			}
		})*/

		// Need to turn off sidemenu on mobile first if a grid button is clicked!
		// if($(window).width() < 768){
		// 	$('body').removeClass('toggle-sidedrawer');
		// };
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

		self.sortName = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			var $grid = $('#characterGrid');
			var $gridItem = $grid.children('.character-box');

			if($element.hasClass('asc')){
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

		self.sortWeight = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			var $grid = $('#characterGrid');
			var $gridItem = $grid.children('.character-box');

			if($element.hasClass('asc')){
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

		self.sortDifficulty = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			var $grid = $('#characterGrid');
			var $gridItem = $grid.children('.character-box');

			if($element.hasClass('asc')){
				$gridItem.sort(function(lower, higher){
					return $(higher).find('.text-percRange').text() - $(lower).find('.text-percRange').text();
				});
			} else {
				$gridItem.sort(function(lower, higher){
					return $(lower).find('.text-percRange').text() - $(higher).find('.text-percRange').text();
				});
			}
			$gridItem.detach().appendTo($grid);
			reassignIndexes();
		};


		self.sortFallspeed = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			var $grid = $('#characterGrid');
			var $gridItem = $grid.children('.character-box');

			if($element.hasClass('asc')){
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

		self.sortGravity = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			var $grid = $('#characterGrid');
			var $gridItem = $grid.children('.character-box');

			if($element.hasClass('asc')){
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

		// All BELOW MIGRATED OVER FROM custom.js
		// Now no more BS with the JSON being loaded twice


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
					// console.log(index);
					var minPercent = value[0];
					var maxPercent = value[1];
					//console.log(index + 's attrs are: min percent is: ' + minPercent + ' and max percent is: ' + maxPercent);

					$character.find('.grid-minPercent').text(minPercent);
					$character.find('.grid-maxPercent').text(maxPercent);
					$character.attr('data-minpercent', minPercent);
					$character.attr('data-maxpercent', maxPercent);
					// IT WOOOOOORKS!!!
					
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
					var $difficulty = $character.find('.difficulty');

					$difficulty.attr('class', 'difficulty').addClass(diff);
					$difficulty.find('.text-difficulty').text(diff);
					$difficulty.find('.text-percRange').text(parseInt(maxPercent) - parseInt(minPercent) + 1);

					// Need to disable/hide icons that the combo is not possible on, or have no data...
					// IMPORTANT STANDARD
					// [minPercent 0, maxPercent 0] = NO DATA AVAILABLE, so HIDE THE BOX
					// [minPercent 1, maxPercent 1] = COMBO IS IMPOSSIBlE, so GREY OUT THE BOX AND DISABLE IT
					$character.removeClass('hide').removeClass('disabled');

					// Need this to also not mess up the margins
					// https://stackoverflow.com/questions/32355054/how-to-get-nth-child-selector-to-skip-hidden-divs
					if(minPercent == 0 && maxPercent == 0){
						$character.addClass('hide');
					}
					if(minPercent == 1 && maxPercent == 1){
						$character.addClass('disabled');
					}

				});


				// Christ this is garbage... Utter garbage
				/*var fdNormal = 0,
					bfNormal = parseInt(self.data('bfnormalmin')),
					bfLowPlat = parseInt(self.data('bflowplatmin')),
					bfTopPlat = parseInt(self.data('bftopplatmin')),
					dlLowPlat = parseInt(self.data('dllowplatmin')),
					dlTopPlat = parseInt(self.data('dltopplatmin')),

					svNormal = parseInt(self.data('svnormalmin')),
					svPlat = parseInt(self.data('svplatmin')),

					tcNormal = parseInt(self.data('tcnormalmin')),
					tcLowPlat = parseInt(self.data('tclowplatmin')),
					tcSidePlat = parseInt(self.data('tcsideplatmin')),
					tcTopPlat = parseInt(self.data('tctopplatmin'));*/

				// Map those modifiers to the Info section. Gotta run through one last time, but only a small run
				$.each(killConfirmsJSON[characterId]['moves'][moveId], function(index, value){
					//$('.modifiers-stages .minperc:nth-child(' + index + ')').hide();
					//console.log(index + ' ' + value);
					$('.modifiers-stages').find('.' + index).text(value);

					//$('.modifiers-stages').find('.bfNormal').hide();
					// $(selector).hide();
					//$('.modifiers-stages .col-4:nth-child(' + (index+1) + ') .minperc').hide();
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


				// Update the URL
				var locationHost = window.location.host;
				var baseUrl = window.location.protocol + "//" + locationHost;
				var dataUrl = self.attr('id');
				var constructedUrl = baseUrl + '/#/' + dataUrl + '/';
				window.location.replace(constructedUrl);

				console.log(constructedUrl);

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
				$nonCurrPage = $wrapper.children('div.pt-page').not('div.pt-page-current'),
				animEndEventNames = {
					'WebkitAnimation' : 'webkitAnimationEnd',
					'OAnimation' : 'oAnimationEnd',
					'msAnimation' : 'MSAnimationEnd',
					'animation' : 'animationend'
				},
				// animation end event name
				animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
				// support css animations
				support = Modernizr.cssanimations;

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
					$('body').removeClass('character-grid-active');
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
					$('#characterGrid').fadeOut('fast', function(){
						activateCharacterGrid(self);
						console.log('transitioning between same character!');
						$('#characterGrid').fadeIn('fast');
						$('body').removeClass('animating');
					});

				} else {

					// Initiate transition BETWEEN DIFFERENT CHARACTERS

					// Initiate transition between MOVES OF SAME CHARACTER
					$('#secondarynav-dropdown-menu').removeClass('show');
					$('#character-wrapper').fadeOut('fast', function(){
						activateCharacterGrid(self);
						console.log('transitioning between different characters!');
						$('#page-wrapper').removeClass();
						retrieveCharUrl(self);
						$('#character-wrapper').fadeIn('fast');
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
						$('#primarynav .navbar-nav').fadeIn('fast');
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

		// THIS IS THE CHARACTER DATA CONTROLLER, RIGHT HERE!
		$('body').on('click', '.moveBtn', function(){

			// Check if the grid is already out
			// If the grid is out and the moveBtn is clicked, that means we're just transitioning between character grids and need a different kind of transition
			// This is for the side menu, which has buttons that trigger a click for its counterpart .moveBtn in card grid

			// check to see if it already has a class of 'active' first. Don't want people clicking the same button twice
			if(!$(this).hasClass('active')){
				if($('body').hasClass('character-grid-active')){
					pageTransition($(this), characterGridActive = true);
				} else {
					pageTransition($(this));
				}
			};
		});


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
		var raf = window.requestAnimationFrame ||
		    window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.msRequestAnimationFrame ||
		    window.oRequestAnimationFrame;
		var $window = $charContainer;
		var lastScrollTop = $window.scrollTop();

		if (raf) {
    		loop();
		}
		function loop() {
		    var scrollTop = $window.scrollTop();
		    if (lastScrollTop === scrollTop) {
		        raf(loop);
		        return;
		    } else {
		        lastScrollTop = scrollTop;
		        // fire scroll function if scrolls vertically
		        scroll();
		        raf(loop);
		    }
		}
		fixedRagebar($charContainer);




		// The URL constructers/deconstructers are back to haunt me
		function constructUrl(self){
			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			var dataUrl = "";
			
			// Need to check if we're clicking on a:
			// characterGrid item
			// character item
			// info button ....

			if($(self).hasClass('moveBtn')){
				dataUrl = self.attr('id');
				var constructedUrl = baseUrl + '/#/' + dataUrl + '/';
				window.location.replace(constructedUrl);
				console.log('constructed url is:' + constructedUrl);
			}
			//var rageAmount = self.find('.rageBtn.active').attr('data-rage');
			//console.log('current rage is ' + rageAmount);
			/*if(rageAmount != '0' && rageAmount != 'undefined' && locationHost != 'dev.glideagency.com/'){
				rageAmount = '?rage=' + rageAmount;
			} else {
				rageAmount = "";
			}*/
		}


		// Using traditional 'click()' bindings will not work on dynamically generated character boxes!
		// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements

		// Need to use a custom event, since this is also being used for the URL deconstructor, and a click binding cannot be used for it
		// http://api.jquery.com/trigger/
		$('#characterGrid').on('click', '.character-box:not(.disabled)', function(){
			activateCharacter($(this));
		});
		$('#characterGrid').on('activateCharBox', function(event){
			activateCharacter($(this));
			//$(this).hide;
		});
		/*$('#characterGrid').click(function(){
			//'.character-box:not(.disabled)'
			var box = $(this).find('.character-box:not(.disabled)');
			box.trigger('activateCharBox');
		});*/

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
				var parts = currentUrl.split('/');

				// Need to check if they're dialling one of the menu links, or a character
				// for(i=0; i<parts.length; i++){
				// 	console.log('url part is: ' + i + ' ' + parts[i]);
				// }
				// Everything after index 3 is relevant.
				// Index 4 == moveName || About || Credits
				// Index 5 == characterName || info

				if(parts[4] == 'about'){
					// activate About box
					activateMenuBox('page-about');
				} else if (parts[4] == 'credits'){
					// activate Credits box
					activateMenuBox('page-credits');
				} else {

					// This is working...
					//console.log(character);
					console.log(parts[4]);

					// Target the moveBtn with the ID defined in the URl
					// Also check if it exists. URL may be invalid
					var characterGrid = parts[4].length ? $('#' + parts[4]) : "";
					var characterBox = parts[5].length ? $('#characterGrid .character-box.' + parts[5]) : "";

					// and activate it
					if(parts[4].length && characterGrid.length){
						pageTransition(characterGrid);
						if(parts[5].length && characterBox.length && parts[5] != 'info'){

							// Working
							//activateCharacter($('#characterGrid .character-box.bayonetta'));
							activateCharacter(characterBox);

						} else if(parts[5] == 'info'){
							activateInfoBox();
						}
					} else {
						// It needs to fallback though in case the character is undefined.
						console.log('This character does not exist, yo');
						$('#notification').html('Looks like this move or character does not exist.<br>Please check the URL.').show();
						$('#notification').delay(3000).fadeOut();
					}

					// Need to activate the correct rage button depending on the URL...
					//var rageAmount = current
					//rageAdjustment($(urlCharacter).find('.rageBtn[data-rage='));

				}
			}
		}
		// For some reason this fires incorrectly if left unwrapped?
		setTimeout(function(){
			deconstructUrl();
		}, 0);

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
				minPercent = parseInt(self.data('minpercent')),
				maxPercent = parseInt(self.data('maxpercent')),
				textContrast = self.data('textcontrast'),
				airdodge = airdodgeStart + ' - ' + airdodgeEnd;

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
			// Ideally these should all be pushed to an array and mapped all at once, but eh

			var $fd = $charModal.find('.stage-fd');
			$fd.find('span[data-ref="fdNormalMin"]').text(minPercent).attr('data-defaultmin', minPercent);
			$fd.find('span[data-ref="fdNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

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

			// var locationHost = window.location.host;
			// var baseUrl = window.location.protocol + "//" + locationHost;
			// var constructedUrl = baseUrl + '/#/' + self.data('url') + '/';
			// window.location.replace(constructedUrl);

			// Update the URL
			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			var dataUrl = $('.moveBtn.active').attr('id');
			var constructedUrl = baseUrl + '/#/' + dataUrl + '/' + self.data('url');
			window.location.replace(constructedUrl);

			// var url = window.location.href + self.data('url') + '/';
			// window.location = url;

		}

		function deactivateCharacter(){
			var $body = $('body');
			$body.removeClass('no-scroll');
			$('#character-underlay').css('backgroundColor', 'transparent');
			// determine if body has clas 'character-active', to see if we're deactivating a character or a menu page
			if($body.hasClass('character-active')){
				var $charModal = $('#characterModal');
				$charModal.removeClass();
				$charModal.find('.rageModifier').removeClass('stuck');
				$charModal.find('.characterBorder').css('height', 'auto');
				$('#characterGrid .character-box.selected').removeClass('selected');
				$body.removeClass('character-active');
			} else {
				// Hide any info/about boxes
				//$('.menu-page > div').hide();
				$('#sidedrawer-underlay').css('backgroundColor', 'transparent');
				$('#menuBackButton').removeClass('active');
				$('#page-info .giphy iframe').attr('src', '');
			}
			
			// Page does not force reload if '#' is in the URL
			// https://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
			// var baseUrl = window.location.protocol + "//" + window.location.host + '/#/';
			// window.location.replace(baseUrl);

			// Update the URL
			var locationHost = window.location.host;
			var baseUrl = window.location.protocol + "//" + locationHost;
			var dataUrl = $('.moveBtn.active').attr('id');
			var constructedUrl = baseUrl + '/#/' + dataUrl + '/';
			window.location.replace(constructedUrl);
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

			// According to the data, characters with ... dunno, I got nothing
			// There seems to be no distinct pattern of how rage causes the min and max% windows to decay
			// Earlier, I put a rough spreadsheet was put together to try and measure the variance of decay relative to DK's rage between characters --> https://docs.google.com/spreadsheets/d/10YmEZihWk6oPPXnynnfIpyEApfl0ANPRlCq4WnHv3Ls/edit#gid=0
			// The stuff in red measures accumulated decay. Doesn't seem to be a pattern, so an average value is taken

			if(rageAmount == "0"){rageAdjMin = 0; rageAdjMax = 0 }
			if(rageAmount == "50"){rageAdjMin = rage50[0]; rageAdjMax = rage50[1] }
			if(rageAmount == "60"){rageAdjMin = rage60[0]; rageAdjMax = rage60[1] }
			if(rageAmount == "80"){rageAdjMin = rage80[0]; rageAdjMax = rage80[1] }
			if(rageAmount == "100"){rageAdjMin = rage100[0]; rageAdjMax = rage100[1] }
			if(rageAmount == "125"){rageAdjMin = rage125[0]; rageAdjMax = rage125[1] }
			if(rageAmount == "150"){rageAdjMin = rage150[0]; rageAdjMax = rage150[1] }

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

		function activateMenuBox(target){
			// check to see if a character is currently active
			// realisitically this will probably never be executed...
			if($('body').hasClass('active-character')){
				deactivateCharacter();	
			}
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
					//$('body').toggleClass('toggle-sidedrawer');

				   
				    //$('#sidebar').toggleClass('active');
				    toggleSidebar();
				}
				
			}
			if(e.which == shiftKey) isShiftActive = true;

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

			// If on mobile and at top of screen, the filter row covers the content! Not good.
			// This detects if the user is partly down the page, and if not will offset the grid by the height of header + height of filter row

			// if($('body').hasClass('filtersActive')){
			// 	// First check to see if the filters are active. If they aren't, then proceed
			// 	var scrollTop = $(window).scrollTop();
			// 	var headerHeight = $('header').height() + $('.btn-group.mobile.active').innerHeight();
			// 	if(scrollTop < 140){
			// 		$('#main').css('margin-top', headerHeight);
			// 	} else {
			// 		$('#main').css('margin-top', '');
			// 	}
			// 	// If they aren't active and the button is clicked, remove the jQuery offset if present
			// } else {
			// 	$('#main').css('margin-top', '');
			// }
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
			activateMenuBox('page-about');
		});
		$('#credits').click(function(e){
			e.preventDefault();
			activateMenuBox('page-credits');
		});
		function activateInfoBox(){
			$('#page-info .detailed-info').hide();
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
			var url = window.location.href + 'info/';
			window.location = url;
		}
		$('#info').click(function(){
			activateInfoBox();
		});
		$('#characterGrid').on('click', '.character-box.disabled', function(){
			activateInfoBox();
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
		})
		// Need to close About menu if item is clicked
		// $('#primarynav .nav-item').click(function(){
		// 	$('body').removeClass('toggle-aboutmenu');
		// });


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
		});

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


		// $('body.toggle-aboutmenu #primarynav').click(function(){
		// 	console.log('primary nav clicked!');
		// })

		// $('body.toggle-aboutmenu #primarynav .nav-item').click(function(){
		// 	$('body').toggleClass('toggle-aboutmenu');
		// });


	};

	return {
		vm: new RenderViewModel(),

		hideOfflineWarning: function(){
			// enable the live data
			document.querySelector('body').classList.remove('loading')
			// remove the offline message
			document.getElementById('notification').style.display = 'none';
			// load the live data
		},
		showOfflineWarning: function(){
			// disable the live data
			document.querySelector('body').classList.add('loading')
			// load html template informing the user they are offline
			var request = new XMLHttpRequest();
			request.open('GET', '/offline.html', true);

			request.onload = function(){
				if(request.status === 200){
					// success
					// create offline element with HTML loaded from offline.html template

					document.getElementById('notification').innerHTML = request.responseText;
					document.getElementById('notification').style.display = 'block';
					setTimeout(function(){
						document.getElementById('notification').style.display = 'none';
					}, 3000);

                } else {
                    // error retrieving file
                    console.warn('Error retrieving offline.html');
                }
            };

            request.onerror = function(){
                // network errors
                console.error('Connection error');
            };

            request.send();
        }
   }

})();