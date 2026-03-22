/*
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// Sidebar.
		var $sidebar = $('#sidebar'),
			$sidebar_inner = $sidebar.children('.inner');

		// Inactive by default on <= large.
			breakpoints.on('<=large', function() {
				$sidebar.addClass('inactive');
			});

			breakpoints.on('>large', function() {
				$sidebar.removeClass('inactive');
			});

		// Hack: Workaround for Chrome/Android scrollbar position bug.
			if (browser.os == 'android'
			&&	browser.name == 'chrome')
				$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
					.appendTo($head);

		// Toggle.
			$('<a href="#sidebar" class="toggle">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Toggle.
						$sidebar.toggleClass('inactive');

				});

		// Events.

			// Link clicks.
				$sidebar.on('click', 'a', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Vars.
						var $a = $(this),
							href = $a.attr('href'),
							target = $a.attr('target');

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Check URL.
						if (!href || href == '#' || href == '')
							return;

					// Hide sidebar.
						$sidebar.addClass('inactive');

					// Redirect to href.
						setTimeout(function() {

							if (target == '_blank')
								window.open(href);
							else
								window.location.href = href;

						}, 500);

				});

			// Prevent certain events inside the panel from bubbling.
				$sidebar.on('click touchend touchstart touchmove', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Prevent propagation.
						event.stopPropagation();

				});

			// Hide panel on body click/tap.
				$body.on('click touchend', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Deactivate.
						$sidebar.addClass('inactive');

				});

		// Scroll lock.
		// Note: If you do anything to change the height of the sidebar's content, be sure to
		// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

			$window.on('load.sidebar-lock', function() {

				var sh, wh, st;

				// Reset scroll position to 0 if it's 1.
					if ($window.scrollTop() == 1)
						$window.scrollTop(0);

				$window
					.on('scroll.sidebar-lock', function() {

						var x, y;

						// <=large? Bail.
							if (breakpoints.active('<=large')) {

								$sidebar_inner
									.data('locked', 0)
									.css('position', '')
									.css('top', '');

								return;

							}

						// Calculate positions.
							x = Math.max(sh - wh, 0);
							y = Math.max(0, $window.scrollTop() - x);

						// Lock/unlock.
							if ($sidebar_inner.data('locked') == 1) {

								if (y <= 0)
									$sidebar_inner
										.data('locked', 0)
										.css('position', '')
										.css('top', '');
								else
									$sidebar_inner
										.css('top', -1 * x);

							}
							else {

								if (y > 0)
									$sidebar_inner
										.data('locked', 1)
										.css('position', 'fixed')
										.css('top', -1 * x);

							}

					})
					.on('resize.sidebar-lock', function() {

						// Calculate heights.
							wh = $window.height();
							sh = $sidebar_inner.outerHeight() + 30;

						// Trigger scroll.
							$window.trigger('scroll.sidebar-lock');

					})
					.trigger('resize.sidebar-lock');

				});

	// Menu.
		var $menu = $('#menu'),
			$menu_openers = $menu.children('ul').find('.opener');

		// Openers.
			$menu_openers.each(function() {

				var $this = $(this);

				$this.on('click', function(event) {

					// Prevent default.
						event.preventDefault();

					// Toggle.
						$menu_openers.not($this).removeClass('active');
						$this.toggleClass('active');

					// Trigger resize (sidebar lock).
						$window.triggerHandler('resize.sidebar-lock');

				});

			});

		// Search (client-side filter, option 2)
			$(function() {
				var $searchForm = $('#search form');
				var $searchInput = $('#query');
				var $searchResultInfo = $('<p id="search-result-info" style="margin: 0.5rem 0; font-size: 0.9rem; color: #8B0000;"></p>').appendTo('#search');
				var $searchResultBlock = $('<div id="search-results" style="margin-top: 0.5rem; font-size: 0.9rem; color: #8B0000;"></div>').appendTo('#search');
				// Full site index ensures same results on every page
				var $items = $('.post, #main .inner section');

				// Static global site post index that is available on every page.
				var sitePostIndex = [
					{url: 'rpost2.html', title: 'Geographic Distribution of Kratom Vendors', text: 'This project analyzes the geographic distribution of kratom vendors across the United States using a combination of data cleaning, geospatial processing, and population-based normalization.'},
					{url: 'rpost1.html', title: 'Survival Analysis of Lung Cancer Patients', text: 'This project applies classical biostatistical survival analysis methods to examine factors associated with time to death among patients with advanced lung cancer.'},
					{url: 'pythonpost2.html', title: 'Immunization Information System Data Quality Audit', text: 'Data quality audit for immunization information systems to improve reporting, validation, and completeness.'},
					{url: 'pythonpost1.html', title: 'Risk-Adjusted Portfolio Optimization and Stability Analysis', text: 'Portfolio risk-adjustment and stability evaluation using quantitative techniques and Monte Carlo simulation.'},
					{url: 'tabpost2.html', title: 'Cardiovascular Risk Profiles Among Female Patients', text: 'Mapping cardiovascular risk factors, demographics, and outcomes of female cohorts using Tableau.'}
				];

				var postCandidates = [];

				$('.posts article').each(function() {
					var $article = $(this);
					var $a = $article.find('a[href]').first();
					if (!$a.length) return;
					postCandidates.push({
						url: $a.attr('href'),
						title: $article.find('h3').text().trim() || $a.text().trim(),
						text: ($article.text() || '').trim()
					});
				});

				$('.mini-posts article').each(function() {
					var $article = $(this);
					var $a = $article.find('a[href]').first();
					if (!$a.length) return;
					postCandidates.push({
						url: $a.attr('href'),
						title: $article.find('p').text().trim() || $a.text().trim(),
						text: ($article.text() || '').trim()
					});
				});

				var currentUrl = window.location.pathname.split('/').pop() || 'index.html';
				var currentTitle = $('#main .inner h1').first().text().trim();
				if (currentTitle) {
					postCandidates.push({
						url: currentUrl,
						title: currentTitle,
						text: $('#main .inner').text().trim() || ''
					});
				}

				function renderPostLinks(matches) {
					if (!matches.length) {
						$searchResultBlock.html('');
						return;
					}
					var html = '<ul style="padding-left: 1rem; margin: 0.2rem 0;">';
					matches.forEach(function(item) {
						html += '<li><a href="' + item.url + '" style="color:#8B0000; text-decoration:underline;">' + item.title + '</a></li>';
					});
					html += '</ul>';
					$searchResultBlock.html(html);
				}

				function filterItems(query) {
					var q = query.trim().toLowerCase();
					if (!q) {
						$searchResultInfo.text('');
						$searchResultBlock.html('');
						return;
					}

					var allCandidates = sitePostIndex.concat(postCandidates);
					var submissionMatches = [];
					var seenUrls = {};
					allCandidates.forEach(function(p) {
						var haystack = (p.title + ' ' + p.text).toLowerCase();
						if (haystack.indexOf(q) !== -1 && !seenUrls[p.url]) {
							seenUrls[p.url] = true;
							submissionMatches.push(p);
						}
					});

					renderPostLinks(submissionMatches);

					if (!submissionMatches.length) {
						$searchResultInfo.html('No matches found across the site index.');
					} else {
						$searchResultInfo.html(submissionMatches.length + ' result' + (submissionMatches.length === 1 ? '' : 's') + ' found.');
					}
				}

				if ($searchForm.length && $searchInput.length && $items.length) {
					$searchForm.on('submit', function(e) {
						e.preventDefault();
						filterItems($searchInput.val());
					});

					$searchInput.on('input', function() {
						filterItems($(this).val());
					});

					filterItems('');
				}
			});

})(jQuery);