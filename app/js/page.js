var Page = (function () {
	// declare the view model used within the page
	function RenderViewModel() {
		var self = this;
		self.character = ko.observableArray([]);
		self.killConfirm = ko.observableArray([]);
		self.stage = ko.observableArray([]);
	}

	return {
		vm: new RenderViewModel(),

		hideOfflineWarning: function () {
			// enable the live data
			document.querySelector('body').classList.remove('loading');
			// remove the offline message
			document.getElementById('notification').style.display = 'none';
			// load the live data
		},
		showOfflineWarning: function () {
			// disable the live data
			//document.querySelector('body').classList.add('loading')
			// load html template informing the user they are offline
			var request = new XMLHttpRequest();
			request.open('GET', '../offline.html', true);

			request.onload = function () {
				if (request.status === 200) {
					// success
					// create offline element with HTML loaded from offline.html template

					document.getElementById('notification').innerHTML = request.responseText;
					document.getElementById('notification').style.display = 'block';
					setTimeout(function () {
						document.getElementById('notification').style.display = 'none';
					}, 3000);
				} else {
					// error retrieving file
					console.warn('Error retrieving offline.html');
				}
			};

			request.onerror = function () {
				// network errors
				console.error('Connection error');
			};

			request.send();
		}
	};
})();
