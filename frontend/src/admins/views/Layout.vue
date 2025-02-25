<template>
	<div>
		<TopWelcome welcomeMessage="Administración de Poblaciones" backColor='#5a8ae2' />
		<invoker ref="invoker">
		</invoker>


		<div class="app-singlebar app-container">
			<div class="md-layout">
				<div v-show="showTabs" class="md-layout-item md-size-80 md-small-size-100">
					<md-tabs md-sync-route ref="tabs">
						<template slot="md-tab" slot-scope="{ tab }">
							{{ tab.label }}
							<i class="badge" v-if="tab.data.badge">{{ tab.data.badge }}</i>
							<mp-help :text="tab.data.help" />
						</template>

						<md-tab class="transparentTab" id="public-tab" v-if="isAdminReader" to="/public" :md-active="isPath('/public')" md-label="Datos públicos">
							<works filter="P"></works>
						</md-tab>

						<md-tab class="transparentTab" id="works-tab" v-if="isDataAdmin" to="/works" md-label="Cartografías" :md-active="isPath('/works')">
							<works filter="R" ref="worksList"></works>
						</md-tab>

						<md-tab class="transparentTab" id="users-tab" v-if="isAdmin" to="/users" :md-active="isPath('/users') || isPath('/')" md-label="Usuarios">
							<users ref="usersList"></users>
						</md-tab>


						<md-tab class="transparentTab" id="boundaries-tab" v-if="isAdminReader" to="/boundaries" :md-active="isPath('/boundaries')" md-label="Delimitaciones">
							<boundaries></boundaries>
						</md-tab>

						<md-tab class="transparentTab" id="clipping-regions-tab" v-if="isAdminReader" to="/regions" :md-active="isPath('/regions')" md-label="Regiones">
							<clipping-regions></clipping-regions>
						</md-tab>

						<md-tab class="transparentTab" id="reviews-tab" v-if="isAdminReader" to="/reviews" :md-active="isPath('/reviews')" md-label="Revisiones"
										:md-template-data="{ badge: (pendingReviews ? pendingReviews : '') }">
							<reviews @pendingUpdated="pendingUpdated"></reviews>
						</md-tab>

						<md-tab class="transparentTab" id="stats-tab" v-if="isAdminReader" to="/stats" :md-active="isPath('/stats')" md-label="Estadísticas">
							<statistics></statistics>
						</md-tab>
					</md-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TopWelcome from '@/common/components/TopWelcome';

import Works from './Works/Works';
import Users from './Users/Users';
import Statistics from './Statistics/Statistics';
import Reviews from './Reviews/Reviews';
import ClippingRegions from './ClippingRegions/ClippingRegions';
import Boundaries from './Boundaries/Boundaries';

export default {
	name: 'Layout',
	components: {
		TopWelcome,
		Works,
		Boundaries,
		ClippingRegions,
		Statistics,
		Reviews,
		Users
	},
	mounted() {
		document.title = 'Poblaciones';
		window.Context.CurrentWork = null;
		window.Context.CurrentDataset = null;
		this.checkLazyLoading();
	},
	data() {
		return {
			pendingReviews: 0,
		};
	},
	computed: {
		isAdmin() {
			return window.Context.IsAdmin();
		},
		isDataAdmin() {
			return window.Context.IsDataAdmin();
		},
		isAdminReader() {
			return window.Context.IsAdminReader();
		},
		showTabs() {
			return (window.Context.Cartographies);
		},
		filter() {
			var isInPublic = (this.$route.path === '/public');
			return (isInPublic ? 'P' : 'R');
		},
		showPublic() {
			return (window.Context.Cartographies);
		},
		},
		beforeRouteUpdate(to, from, next) {
			next();
		},

		methods: {
			isPath(path) {
				return this.$route.path === path;
			},
			checkLazyLoading() {
				var tabPath = this.$route.path;
				if (tabPath == '/works') {
					this.$refs.worksList.loadData();
				} else if (tabPath == '/users') {
					this.$refs.usersList.loadData();
				}
			},
			pendingUpdated(pending) {
				this.pendingReviews = pending;
			},
		},
		watch:
		{
			'$route'(to, from) {
				this.checkLazyLoading();
			}
		}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 20px;
		line-height: 30px;
	}
}

.transparentTab {
	background-color: #fafafa;
	padding: 4px;
}

	.badge {
		padding: 2px 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 6px;
		right: 6px;
		background: #b7b7b7;
		border-radius: 6px;
		color: #fff;
		font-size: 10px;
		font-style: normal;
		font-weight: 600;
		letter-spacing: -.05em;
		font-family: 'Roboto Mono', monospace;
	}
</style>
