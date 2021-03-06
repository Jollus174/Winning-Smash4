var killConfirmsJSON = '';

// Sort out character boxes
var characters = (function () {
	function killConfirmsViewModel() {
		var self = this;
	}
	function characterAttrsViewModel() {
		var self = this;
	}
	function stageListViewModel() {
		var self = this;
	}

	function CharacterApiService() {
		var self = this;

		// retrieves all kill confirms from the API
		self.getKillConfirms = function () {
			return new Promise(function (resolve, reject) {
				var killConfirmsRequest = new XMLHttpRequest();
				killConfirmsRequest.open('GET', 'api/kill-confirms.json');

				killConfirmsRequest.onload = function () {
					// success
					if (killConfirmsRequest.status === 200) {
						//var killConfirmsJSON = "";
						killConfirmsJSON = JSON.parse(killConfirmsRequest.response);
						resolve(killConfirmsJSON);
						console.log('got the kill confirms file!');
					} else {
						// error
						console.log('missing kill confirms file');
					}
				};
				killConfirmsRequest.onerror = function () {
					reject(Error('Network Error'));
				};

				killConfirmsRequest.send();
			});
		};

		self.getCharAttrs = function () {
			return new Promise(function (resolve, reject) {
				var charAttrsRequest = new XMLHttpRequest();
				// charAttrsRequest.open('GET', 'api/char-attrs.json');
				charAttrsRequest.open('GET', 'api/char-attrs-complete.json');

				charAttrsRequest.onload = function () {
					// success
					if (charAttrsRequest.status === 200) {
						// resolve the promise with the parsed response text (assumes JSON)
						var charAttrsJSON = '';
						charAttrsJSON = JSON.parse(charAttrsRequest.response);
						resolve(charAttrsJSON);
					} else {
						// error retrieving file
						console.log('missing character attributes file');
					}
				};
				charAttrsRequest.onerror = function () {
					// network errors
					reject(Error('Network Error'));
				};

				charAttrsRequest.send();
			});
		};

		self.getStageList = function () {
			return new Promise(function (resolve, reject) {
				var stageListRequest = new XMLHttpRequest();
				stageListRequest.open('GET', 'api/stage-list.json');

				stageListRequest.onload = function () {
					// success
					if (stageListRequest.status === 200) {
						// resolve the promise with the parsed response text (assumes JSON)
						var stageListJSON = '';
						stageListJSON = JSON.parse(stageListRequest.response);
						resolve(stageListJSON);
					} else {
						// error retrieving file
						console.log('missing stage list file');
					}
				};
				stageListRequest.onerror = function () {
					// network errors
					reject(Error('Network Error'));
				};

				stageListRequest.send();
			});
		};
	}

	function CharacterAdapter() {
		var self = this;

		self.toKillConfirmsViewModel = function (data) {
			if (data) {
				var vm = new killConfirmsViewModel();

				vm.name = data.name;
				vm.charId = data.charId;
				vm.hashUrl = ko.observable('#' + vm.charId);
				vm.index = parseInt(data.index);
				vm.moveIndex = parseInt(data.moveIndex);
				vm.moveId = data.moveId;

				// Deeper
				// https://jsfiddle.net/wfs569gf/
				vm.moves = data.moves;
				vm.stageModifiers = data.stageModifiers;

				vm.stageMinPercents = [
					data.bfNormalMin,
					data.bfLowPlatMin,
					data.bfTopPlatMin,

					data.dlLowPlatMin,
					data.dlTopPlatMin,

					data.svNormalMin,
					data.svPlatMin,

					data.tcNormalMin,
					data.tcLowPlatMin,
					data.tcSidePlatMin,
					data.tcTopPlatMin
				];

				// Credits
				vm.spreadsheetLink = data.spreadsheetLink;
				vm.spreadsheetName = data.spreadsheetName;
				vm.creditLink = data.creditLink;
				vm.creditName = data.creditName;
				// if(data.spreadsheetMethod){
				//     vm.spreadsheetMethod = data.spreadsheetMethod;
				// } else {
				// }
				vm.spreadsheetMethod = data.spreadsheetMethod;

				// WTF HOW IS THIS WORKING WITH THESE LINES COMMENTED OUT?!
				//vm.moveName = data.moveName;
				//vm.moveUrl = data.moveUrl;
				//vm.moveId = data.moveId;

				//vm.hashMoveUrl = ko.observable('#' + vm.moveUrl);
				// http://digitalbush.com/2013/12/11/knockout-js-href-binding/
				/*vm.hashFullUrl = ko.computed(function(){
                    return '#/' + $parent.vm.url + '/' + vm.moveUrl;
                });*/

				return vm;
			}
			return null;
		};
		self.toKillConfirmsViewModels = function (data) {
			if (data && data.length > 0) {
				return data.map(function (killConfirm) {
					return self.toKillConfirmsViewModel(killConfirm);
				});
			}
			return [];
		};

		self.toCharacterAttrsViewModel = function (data) {
			if (data) {
				var vm = new characterAttrsViewModel();

				vm.charIndex = parseInt(data.charIndex);
				vm.name = data.name;
				vm.weight = data.weight;
				vm.fallspeed = data.fallspeed;
				vm.gravity = data.gravity;
				vm.url = data.url;
				vm.id = data.id;

				vm.minPercent = parseInt(data.minPercent);
				vm.maxPercent = parseInt(data.maxPercent);
				vm.specialInfo = data.specialInfo;

				vm.difficultyValue = ko.computed(function () {
					var floatiness = vm.fallspeed * vm.gravity;
					var diffValue = vm.weight / floatiness;
					return Math.ceil(diffValue);
				}, this);

				vm.airdodgeStart = data.airdodgeStart;
				vm.airdodgeEnd = data.airdodgeEnd;

				if (data.imagePosition) {
					vm.imagePosition = data.imagePosition;
				} else {
					vm.imagePosition = '';
				}

				// Generating image properties
				vm.imageProperties = ko.observable(vm.imagePosition);

				// GENERATING CHARACTER MODAL BOX
				// vm.log = function(data, event){
				//     // Working!
				//     console.log('you clicked me!');
				//     var element = event.target;
				//     //var dataUrl =
				// };

				return vm;
			}
			return null;
		};
		// This block maps them out. Will repeat the functions for each element being called.
		self.toCharacterAttrsViewModels = function (data) {
			if (data && data.length > 0) {
				return data.map(function (character) {
					return self.toCharacterAttrsViewModel(character);
				});
			}
			return [];
		};

		self.toStageListViewModel = function (data) {
			if (data) {
				var vm = new stageListViewModel();

				vm.name = data.name;
				vm.className = data.className;
				vm.imageFile = data.imageFile;
				vm.colour = data.colour;
				vm.tables = data.tables;

				vm.stagePartName = data.stagePartName;
				vm.stagePartRef = data.stagePartRef;

				return vm;
			}
			return null;
		};
		self.toStageListViewModels = function (data) {
			if (data && data.length > 0) {
				return data.map(function (character) {
					return self.toStageListViewModel(character);
				});
			}
			return [];
		};
	}

	function CharacterController(characterApiService, CharacterAdapter) {
		var self = this;

		self.getKillConfirms = function () {
			// retrieve all the kill confirms from the API
			return characterApiService.getKillConfirms().then(function (response) {
				return CharacterAdapter.toKillConfirmsViewModels(response);
			});
		};
		self.getCharAttrs = function () {
			// retrieve all the character attrs from the API
			return characterApiService.getCharAttrs().then(function (response) {
				return CharacterAdapter.toCharacterAttrsViewModels(response);
			});
		};
		self.getStageList = function () {
			return characterApiService.getStageList().then(function (response) {
				return CharacterAdapter.toStageListViewModels(response);
			});
		};
	}

	// initialize the services and adapters
	var characterApiService = new CharacterApiService();
	var CharacterAdapter = new CharacterAdapter();

	// initialize the controller
	var characterController = new CharacterController(characterApiService, CharacterAdapter);

	return {
		loadData: function () {
			// retrieve all routes
			//document.querySelector("#main").classList.add('loading')
			characterController.getKillConfirms().then(function (response) {
				Page.vm.killConfirm(response);
				//console.log(Page.vm.killConfirm(response));
				//console.log('kill confirms loaded');
				Custom();
			});
			characterController.getStageList().then(function (response) {
				Page.vm.stage(response);
				//console.log('stage list loaded');
			});
			characterController.getCharAttrs().then(function (response) {
				// bind the characters to the UI
				Page.vm.character(response);
				document.getElementById('body').classList.remove('loading');
				// displays the grid now that shiz is loaded
				//document.getElementById('main').style.display = "block";
			});
		}
	};
})();
