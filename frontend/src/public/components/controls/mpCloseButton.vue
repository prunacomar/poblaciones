<template>
	<button :title="title" type="button" class="close buttonMargin" @click="onClose">
		<close-icon title="Quitar" />
	</button>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue';


export default {
	name: 'mpCloseButton',
	props: {
		title: {
			type: String,
			default: 'Quitar'
		},
	},
	components: {
		CloseIcon
	},
	data() {
		return {
		};
	},
	methods: {
		onClose(e) {
			this.$emit('click', e);
		},
	},
};
</script>

<style scoped>
	.buttonMargin {
		margin-right: -2px;
		margin-top: -4px;
		margin-left: -3px;
	}
</style>

