import RollupStart from './main.svelte';

import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const KOMReviewGeneral = new RollupStart({
	target: document.body,
	props: Object.assign({
		KOMReviewGeneralSpacings: [],
		KOMReviewGeneralUpcomingData: [],
		KOMReviewGeneralHistoricalData: [],
		KOMReviewChartCompositionCollectionData: {
			KOMSpacingGroupingTotal: 1,
			KOMSpacingGroupingUnseen: 2,
			KOMSpacingGroupingDeveloping: 3,
			KOMSpacingGroupingMature: 4,
			KOMSpacingGroupingSuspended: 5,
		},
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['KOMReviewGeneralSpacings', 'KOMReviewGeneralUpcomingData', 'KOMReviewGeneralHistoricalData', 'KOMReviewChartCompositionCollectionData'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		if (['KOMReviewGeneralSpacings'].includes(e[0])) {
			e[1] = e[1].map(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse);
		}

		return e;
	}))),
});

export default KOMReviewGeneral;
