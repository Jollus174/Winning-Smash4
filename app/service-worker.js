'use strict';
// use a cacheName for cache versioning
var cacheName = 'v3-1-3:static';

var addResourcesToCache = async (resources) => {
	var cache = await caches.open(cacheName);
	await cache.addAll(resources);
};

// during the install phase you usually want to cache static assets
self.addEventListener('install', function (e) {
	// once the SW is installed, go ahead and fetch the resources to make this work offline

	// https://stackoverflow.com/questions/45467842/how-to-clear-cache-of-service-worker
	// caches.keys().then(function(names){
	//     for(let name of names)
	//         caches.delete(name);
	//     console.log('caches deleted!')
	// });
	console.log(cacheName[0] + ' is now installing');
	e.waitUntil(
		addResourcesToCache([
			'/',
			'/offline.html',
			'/images/characters/webp/bayonetta.webp',
			'/images/characters/webp/bowser.webp',
			'/images/characters/webp/bowserjr.webp',
			'/images/characters/webp/cfalcon.webp',
			'/images/characters/webp/charizard.webp',
			'/images/characters/webp/cloud.webp',
			'/images/characters/webp/cloudlimit.webp',
			'/images/characters/webp/corrin.webp',
			'/images/characters/webp/darkpit.webp',
			'/images/characters/webp/diddykong.webp',
			'/images/characters/webp/donkeykong.webp',
			'/images/characters/webp/drmario.webp',
			'/images/characters/webp/duckhunt.webp',
			'/images/characters/webp/falco.webp',
			'/images/characters/webp/fox.webp',
			'/images/characters/webp/gameandwatch.webp',
			'/images/characters/webp/ganondorf.webp',
			'/images/characters/webp/greninja.webp',
			'/images/characters/webp/ike.webp',
			'/images/characters/webp/jigglypuff.webp',
			'/images/characters/webp/kingdedede.webp',
			'/images/characters/webp/kirby.webp',
			'/images/characters/webp/link.webp',
			'/images/characters/webp/littlemac.webp',
			'/images/characters/webp/lucario.webp',
			'/images/characters/webp/lucas.webp',
			'/images/characters/webp/lucina.webp',
			'/images/characters/webp/luigi.webp',
			'/images/characters/webp/mario.webp',
			'/images/characters/webp/marth.webp',
			'/images/characters/webp/megaman.webp',
			'/images/characters/webp/metaknight.webp',
			'/images/characters/webp/mewtwo.webp',
			'/images/characters/webp/miibrawler.webp',
			'/images/characters/webp/miigunner.webp',
			'/images/characters/webp/miiswordfighter.webp',
			'/images/characters/webp/ness.webp',
			'/images/characters/webp/olimar.webp',
			'/images/characters/webp/pacman.webp',
			'/images/characters/webp/palutena.webp',
			'/images/characters/webp/peach.webp',
			'/images/characters/webp/pikachu.webp',
			'/images/characters/webp/pit.webp',
			'/images/characters/webp/rob.webp',
			'/images/characters/webp/robin.webp',
			'/images/characters/webp/rosalina.webp',
			'/images/characters/webp/roy.webp',
			'/images/characters/webp/ryu.webp',
			'/images/characters/webp/samus.webp',
			'/images/characters/webp/sheik.webp',
			'/images/characters/webp/shulk.webp',
			'/images/characters/webp/shulkbuster.webp',
			'/images/characters/webp/shulkjump.webp',
			'/images/characters/webp/shulkshield.webp',
			'/images/characters/webp/shulksmash.webp',
			'/images/characters/webp/shulkspeed.webp',
			'/images/characters/webp/sonic.webp',
			'/images/characters/webp/toonlink.webp',
			'/images/characters/webp/villager.webp',
			'/images/characters/webp/wario.webp',
			'/images/characters/webp/wiifittrainer.webp',
			'/images/characters/webp/yoshi.webp',
			'/images/characters/webp/zelda.webp',
			'/images/characters/webp/zerosuitsamus.webp',

					'/images/stages/stage_bf.jpg',
					'/images/stages/stage_dl.jpg',
					'/images/stages/stage_fd.jpg',
					'/images/stages/stage_ly.jpg',
					'/images/stages/stage_sv.jpg',
					'/images/stages/stage_tc.jpg',

					'/images/spinner.svg',
					'/images/stripe.png',
					'/images/credits.jpg',
					'/images/progressive-web-app.jpg',
					'/images/icon-search.svg',
					'/images/icon-search-active.svg',
					'/images/logo-winning-at-smash4.png',

					'/css/style.min.css',

					'/js/main.min.js',

					'/api/kill-confirms.json',
					'/api/stage-list.json',
			'/api/char-attrs-complete.json'
				])
	);
});

self.addEventListener('activate', function (event) {
	// delete any caches that aren't in cacheName
	// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle

	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.map((key) => {
						if (!cacheName.includes(key)) {
							return caches.delete(key);
						}
					})
				)
			)
			.then(() => {
				console.log(cacheName[0] + ' now ready to handle fetches!');
			})
	);
});

// when the browser fetches a url
self.addEventListener('fetch', function (event) {
	// either respond with the cached object or go ahead and fetch the actual url
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				// retrieve from cache
				return response;
			}
			// fetch as normal
			return fetch(event.request);
		})
	);
});
