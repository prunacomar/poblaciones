<template>
	<span v-if="text"
						 v-tooltip.bottom-start="{ content: text, autoHide: false,
																	classes : 'tooltipInTitleBar' + (large ? ' tooltipLarge' : '') }">
	<help-icon :size="14"
						 style="	margin-top: 10px;
																			margin-left: -7px;
																			color: #b1b1b1;
																			position: absolute;" />
	</span>
</template>

<script>

import HelpIcon from 'vue-material-design-icons/HelpCircleOutline.vue';

export default {
  name: 'MpHelp',
		components: {
			HelpIcon,
  },
		props: {
			text: String,
			large: Boolean
		}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
