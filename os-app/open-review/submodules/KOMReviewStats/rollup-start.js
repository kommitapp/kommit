import RollupStart from './main.svelte';

import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const KOMReviewStats = new RollupStart({
	target: document.body,
	props: Object.assign({
		KOMReviewTodayTotalCards: 0,
		KOMReviewTodayTimeMinutes: 0,
		KOMReviewTodayReviewAccuracy: 0,
		KOMReviewGeneralSpacings: [],
		KOMReviewChartCompositionCollectionData: {
			KOMSpacingGroupingTotal: 1,
			KOMSpacingGroupingUnseen: 2,
			KOMSpacingGroupingDeveloping: 3,
			KOMSpacingGroupingMature: 4,
			KOMSpacingGroupingSuspended: 5,
		},
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['KOMReviewGeneralSpacings', 'KOMReviewChartCompositionCollectionData'].includes(e[0])) {
			e[1] = JSON.parse(e[1])
		}

		if (['KOMReviewGeneralSpacings'].includes(e[0])) {
			e[1] = e[1].map(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse).map(function (e) {
				if (e.KOMSpacingChronicles) {
					e.KOMSpacingChronicles.forEach(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse);
				}
				
				return e;
			});
		}

		return e;
	}))),
});

export default KOMReviewStats;
