<template>
	<div>
		<div v-show='hasContent && !collapsed' style=" position: absolute; height: 100%; left: 0; top: 0; overflow-y: auto; box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); z-index: 1000; background-color: white; user-select: text" :style="{ width: width + 'px' }">
			<div v-if="isFullFront">
				<transition name="fade" mode='out-in'>
					<feature-list :featureInfo='Full' v-if='isFullList' :enabled="enabled" @clickClose='doClose'/>
					<feature-info :featureInfo='Full' v-if='isFullInfo' :enabled="enabled" @clickClose='doClose'/>
				</transition>
			</div>
			<div id="panTop" class="split" v-if="!isFullFront">
				<transition name="fade" mode='out-in'>
					<feature-list :featureInfo='Top' v-if='isTopList' :enabled="enabled" @clickClose='doClose'/>
					<feature-info :featureInfo='Top' v-if='isTopInfo' :enabled="enabled" @clickClose='doClose'/>
				</transition>
			</div>
			<div id="panBottom" class="split" v-if="!isFullFront">
				<transition name="fade" mode='out-in'>
					<feature-list :featureInfo='Bottom' v-if='isBottomList' :enabled="enabled" @clickClose='doClose'/>
					<feature-info :featureInfo='Bottom' v-if='isBottomInfo' :enabled="enabled" @clickClose='doClose'/>
				</transition>
			</div>
		</div>
		<collapse-button v-if='hasContent' :startLeft='width' tooltip="panel" class="exp-hiddable-block" :collapsed='collapsed' @click="doToggle" />
	</div>
</template>

<script>
import FeatureInfo from '@/public/components/widgets/features/featureInfo';
import FeatureList from '@/public/components/widgets/features/featureList';
import PanelType from '@/public/enums/PanelType';
import CollapseButton from '@/public/components/controls/collapseButton';
import Split from 'split.js';
import dom from '@/common/framework/dom';

export default {
	name: 'leftPanel',
	components: {
		FeatureInfo,
		FeatureList,
		CollapseButton,
	},
	data() {
		return {
			width: 300,
			hasContent: false,
			collapsed: true,
			Top: null,
			Bottom: null,
			Full: null,
			enabled: true,
			isFullFront: true,
			onlyFull: false,
			split: null,
			topHeight: 50,
		};
	},
	// created () { },
	mounted() {
		this.initSplit();
		window.addEventListener('resize', this.onResize);
	},
	beforeDestroy () {
		window.removeEventListener('resize', this.onResize);
	},
	computed: {
		isFullList() {
			return this.Full !== null
				&& this.Full.panelType == PanelType.ListPanel;
		},
		isTopList() {
			return this.Top !== null
				&& this.Top.panelType == PanelType.ListPanel;
		},
		isBottomList() {
			return this.Bottom !== null
				&& this.Bottom.panelType == PanelType.ListPanel;
		},
		isFullInfo() {
			return this.Full !== null
				&& this.Full.panelType == PanelType.InfoPanel;
		},
		isTopInfo() {
			return this.Top !== null
				&& this.Top.panelType == PanelType.InfoPanel;
		},
		isBottomInfo() {
			return this.Bottom !== null
				&& this.Bottom.panelType == PanelType.InfoPanel;
		},
	},
	methods: {
		onResize() {
			this.onlyFull = window.innerHeight < 500;
		},
		initSplit() {
			if(this.isFullFront == false
				&& this.hasSplit()) {
				const loc = this;
				this.split = Split(['#panTop', '#panBottom'], {
					direction: 'vertical',
					sizes: [this.topHeight, 100 - this.topHeight],
					minSize: 100,
					gutterSize: 6,
					onDragEnd: function(sizes) {
						loc.topHeight = sizes[0];
						window.SegMap.SaveRoute.UpdateRoute();
					},
				});
			}
		},
		arrangeSplitter() {
			if(this.isFullFront == false
				&& this.hasSplit()) {
					this.initSplit();
			} else {
				if(this.split == null) {
					return;
				}
				this.split.destroy();
			}
		},
		hasAny() {
			return this.Top !== null
				|| this.Bottom !== null
				|| this.Full !== null;
		},
		hasSplit() {
			return this.Top !== null
				&& this.Bottom !== null;
		},
		getLocated(fid) {
			if(this.Top !== null
				&& this.Top.Key.Id === fid) {
				return 'Top';
			}
			if(this.Bottom !== null
				&& this.Bottom.Key.Id === fid) {
				return 'Bottom';
			}
			if(this.Full !== null
				&& this.Full.Key.Id === fid) {
				return 'Full';
			}
			return null;
		},
		Add(featureInfo, index) {
			this.isFullFront = true;
			this.doAdd(featureInfo, 'Full', index);
		},
		AddTop(featureInfo, index) {
			this.isFullFront = false;
			this.doAdd(featureInfo, 'Top', index);
		},
		AddBottom(featureInfo, index) {
			this.isFullFront = false;
			if(this.Top !== null
				&& this.Top.Key.Id === featureInfo.Key.Id) {
				if(index !== undefined
					&& this.Top.panelType == PanelType.ListPanel) {
					this.Top.detailIndex = index;
				}
				return;
			}
			this.doAdd(featureInfo, 'Bottom', index);
		},
		Enable() {
			this.enabled = true;
		},
		Disable() {
			this.enabled = false;
		},
		doAdd(featureInfo, panelPositionEnum, index) {
			if(this.onlyFull) {
				panelPositionEnum = 'Full';
				this.isFullFront = true;
				this.Top = null;
				this.Bottom = null;
			}

			this.hasContent = true;
			this.collapsed = false;
			this[panelPositionEnum] = featureInfo;

			if(index !== undefined
				&& this[panelPositionEnum].panelType == PanelType.ListPanel) {
				this[panelPositionEnum].detailIndex = index;
			}
			this.arrangePanels();
		},
		arrangePanels() {
			if(this.collapsed || this.hasAny() == false) {
				return;
			}
			if(this.Top === null
				&& this.Bottom !== null) {
				this.Top = this.Bottom;
				this.Bottom = null;
			}
			this.arrangeSplitter();
		},
		doClose(e, fid) {
			let panelPositionEnum = this.getLocated(fid);
			if(panelPositionEnum === null) {
				return;
			}
			this[panelPositionEnum] = null;

			if(this.Full === null) {
				this.isFullFront = false;
			}

			if(this.Top === null
				&& this.Bottom === null) {
				this.isFullFront = true;
			}
			if(this.hasAny() == false) {
				this.hasContent = false;
				this.collapsed = true;
			}
			this.arrangePanels();
			window.SegMap.SaveRoute.UpdateRoute();
		},
		doToggle() {
			this.collapsed = !this.collapsed;
			window.SegMap.Session.UI.ToggleLeftPanel(!this.collapsed);
		},
		updateMapTypeControl() {
			var css1 = dom.getCssRule(document, '.gm-style-mtc:first-of-type');
			var css2 = dom.getCssRule(document, '.gm-style-mtc');
			var css3 = dom.getCssRule(document, '.gm-style-mtc:last-of-type');
			var css4 = dom.getCssRule(document, '.leaflet-left .leaflet-control-scale');
			if(css1 === null) {
				css1 = { style: { transform: '' } };
				css2 = { style: { transform: '' } };
				css3 = { style: { transform: '' } };
			}
			if (css4 === null) {
				css4 = { style: { transform: '' } };
			}
			if (this.collapsed) {
				window.SegMap.SetTypeControlsDefault();
				css1.style.transform = 'translateX(9px) scale(0.8)';
				css2.style.transform = 'translateX(-8px) scale(0.8)';
				css3.style.transform = 'translateX(4px) scale(0.8)';
				css4.style.transform = '';
			} else {
				window.SegMap.SetTypeControlsDropDown();
				css2.style.transform = 'translateX(' + (this.width + 7) + 'px) scale(0.85)';
				css1.style.transform = '';
				css3.style.transform = '';
				css4.style.transform = 'translateX(' + (this.width + 7) + 'px)';
			}
		},
		setCss(el, collapsed, onValue, offValue) {
			var values = (collapsed ? offValue : onValue);
			for (var key in values) {
				el.style[key] = values[key];
			}
		},
		updateSuroundings(cssClass, onValue, offValue) {
			let el = document.getElementsByClassName(cssClass);
			if (el.length > 0) {
				this.setCss(el[0], this.collapsed, onValue, offValue);
			} else {
				const loc = this;
				var checkExist = setInterval(function() {
					let el = document.getElementsByClassName(cssClass);
					if (el.length > 0) {
						clearInterval(checkExist);
						loc.setCss(el[0], loc.collapsed, onValue, offValue);
					}
				}, 50);
			}
		},
	},
	watch: {
		onlyFull() {
			if(this.onlyFull) {
				if(this.Full == null) {
					this.Full = this.Top;
				}
				this.isFullFront = true;
				this.Top = null;
				this.Bottom = null;
				this.arrangePanels();
			}
		},
		collapsed() {
			this.arrangePanels();
			this.updateMapTypeControl();
			this.updateSuroundings('fab-wrapper',
				{ transform: 'translate('+ this.width + 'px)' },
				{ transform: '' }
			);
			this.updateSuroundings('edit-button',
				{ transform: 'translate(' + this.width + 'px)' },
				{ transform: '' }
			);
			this.updateSuroundings('searchBar',
				{ left: (this.width + 200) + 'px', width: '300px' },
				{ left: this.width + 'px', width: 'max(calc(100% - 500px), 400px)' }
			);
		},
	},
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity .35s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>

