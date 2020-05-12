const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KOMBrowseListItem: '.KOMBrowseListItem',
	
	KOMBrowseListItemQuestion: '.KOMBrowseListItemQuestion',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KOMBrowseListItem_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KOMBrowseListItemQuestion: 'bravo',
		});
	});

	it('shows KOMBrowseListItem', function () {
		browser.assert.elements(KOMBrowseListItem, 1);
	});

	it('shows KOMBrowseListItemQuestion', function () {
		browser.assert.elements(KOMBrowseListItemQuestion, 1);
	});

});
