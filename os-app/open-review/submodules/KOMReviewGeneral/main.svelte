<script>
export let KOMReviewGeneralUpcomingData;
export let KOMReviewGeneralHistoricalData;
export let KOMReviewChartCompositionCollectionData;

import { OLSKLocalized } from 'OLSKInternational';
import KOMReviewGeneralLogic from './ui-logic.js';

import KOMReviewChartCompositionCollection from '../KOMReviewChartCompositionCollection/main.svelte';
import KOMReviewChartElementDateBarTable from '../KOMReviewChartElementDateBarTable/main.svelte';
</script>

<div class="KOMReviewGeneral">

{#if KOMReviewGeneralUpcomingData.length }

<div class="KOMReviewGeneralUpcoming">
	<h2 class="KOMReviewGeneralUpcomingHeading">{ OLSKLocalized('KOMReviewGeneralUpcomingHeadingText') }</h2>

	<KOMReviewChartElementDateBarTable KOMReviewChartElementDateBarTableData={ KOMReviewGeneralUpcomingData } KOMReviewChartElementHorizontalStackedBarColors={ KOMReviewGeneralLogic.KOMReviewGeneralUpcomingColors() } />
</div>
	
{/if}

{#if KOMReviewGeneralHistoricalData.length }

<div class="KOMReviewGeneralHistorical">
	<h2 class="KOMReviewGeneralHistoricalHeading">{ OLSKLocalized('KOMReviewGeneralHistoricalHeadingText') }</h2>

	<KOMReviewChartElementDateBarTable KOMReviewChartElementDateBarTableData={ KOMReviewGeneralHistoricalData } KOMReviewChartElementHorizontalStackedBarColors={ KOMReviewGeneralLogic.KOMReviewGeneralHistoricalColors() } />
</div>
	
{/if}

<div class="KOMReviewGeneralCollection">
	<h2 class="KOMReviewGeneralCollectionHeading">{ OLSKLocalized('KOMReviewGeneralCollectionHeadingText') }</h2>

	<KOMReviewChartCompositionCollection
		KOMReviewChartCompositionCollectionData={ KOMReviewChartCompositionCollectionData }
		KOMReviewChartElementHorizontalStackedBarColors={ KOMReviewGeneralLogic.KOMReviewGeneralCollectionColors() } />
</div>

</div>
