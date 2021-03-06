import RollupStart from './main.svelte';

const KOMReviewChartElementDateBarTableRow = new RollupStart({
	target: document.body,
	props: Object.assign({
		KOMReviewChartElementHorizontalStackedBarMaximum: 10,
		KOMReviewChartElementHorizontalStackedBarColors: ['alfa', 'bravo', 'charlie'],
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['KOMReviewChartElementDateBarTableRowData'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default KOMReviewChartElementDateBarTableRow;
