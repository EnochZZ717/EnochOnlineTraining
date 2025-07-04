const compareVersion = (v1, v2) => {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}

	return 0
}

Component({
	externalClasses: ['item-wrap-class'],
	options: {
		multipleSlots: true
	},
	properties: {
		extraNodes: {            // 额外节点
			type: Array,
			value: []
		},
		listData: {              // 数据源
			type: Array,
			value: []
		},
		columns: {               // 列数
			type: Number,
			value: 1
		},
		topSize: {               // 顶部固定高度
			type: Number,
			value: 0
		},
		bottomSize: {            // 底部固定高度
			type: Number,
			value: 0
		},
		itemHeight: {            // 每个 item 高度, 用于计算 item-wrap 高度
			type: Number,
			value: 0
		},
		scrollTop: {             // 页面滚动高度
			type: Number,
			value: 0
		},
	},
	data: {
		baseData: {},
		pageMetaSupport: false,                                 
		platform: '',                                          
		listWxs: [],                                           
		rows: 0,                                              
		wrapStyle: '',                                         
		list: [],                                             
		dragging: false,
	},
	methods: {
		vibrate() {
			if (this.data.platform !== "devtools") wx.vibrateShort();
		},
		pageScroll(e) {
			if (this.data.pageMetaSupport) {
				this.triggerEvent("scroll", {
					scrollTop: e.scrollTop
				});
			} else {
				wx.pageScrollTo({
					scrollTop: e.scrollTop,
					duration: 300
				});
			}
		},
		drag(e) {
			this.setData({
				dragging: e.dragging
			})
		},
		listChange(e) {
			this.data.listWxs = e.list;
		},
		itemClick(e) {
			let index = e.currentTarget.dataset.index;
			let item = this.data.listWxs[index];

			this.triggerEvent('click', {
				key: item.realKey,
				data: item.data,
				extra: e.detail
			});
		},
		initDom() {
			let {windowWidth, windowHeight, platform, SDKVersion} = wx.getSystemInfoSync();
			let remScale = (windowWidth || 375) / 375;

			this.data.pageMetaSupport = compareVersion(SDKVersion, '2.9.0') >= 0;
			this.data.platform = platform;

			let baseData = {};
			baseData.windowHeight = windowHeight;
			baseData.realTopSize = this.data.topSize * remScale / 2;
			baseData.realBottomSize = this.data.bottomSize * remScale / 2;
			baseData.columns = this.data.columns;
			baseData.rows =  this.data.rows;

			const query = this.createSelectorQuery();
			query.select(".item").boundingClientRect();
			query.select(".item-wrap").boundingClientRect();
			query.exec((res) => {
				baseData.itemWidth = res[0].width;
				baseData.itemHeight = res[0].height;
				baseData.wrapLeft = res[1].left;
				baseData.wrapTop = res[1].top + this.data.scrollTop;
				this.setData({
					dragging: false,
					baseData
				});
			});
		},
		
		columnChange() {
			this.setData({
				list: []
			})
			this.init();
		},
		init() {
			this.setData({dragging: true});

			let delItem = (item, extraNode) => ({
				id: item.dragId,
				extraNode: extraNode,
				fixed: item.fixed,
				slot: item.slot,
				data: item
			});

			let {listData, extraNodes} = this.data;
			let _list = [], _before = [], _after = [], destBefore = [], destAfter = [];

			extraNodes.forEach((item, index) => {
				if (item.type === "before") {
					_before.push(delItem(item, true));
				} else if (item.type === "after") {
					_after.push(delItem(item, true));
				} else if (item.type === "destBefore") {
					destBefore.push(delItem(item, true));
				} else if (item.type === "destAfter") {
					destAfter.push(delItem(item, true));
				}
			});

			// 遍历数据源增加扩展项, 以用作排序使用
			listData.forEach((item, index) => {
				destBefore.forEach((i) => {
					if (i.data.destKey === index) _list.push(i);
				});
				_list.push(delItem(item, false));
				destAfter.forEach((i) => {
					if (i.data.destKey === index) _list.push(i);
				});
			});

			let i = 0, columns = this.data.columns;
			let list = (_before.concat(_list, _after) || []).map((item, index) => {
				item.realKey = item.extraNode ? -1 : i++; // 真实顺序
				item.sortKey = index; // 整体顺序
				item.tranX = `${(item.sortKey % columns) * 100}%`;
				item.tranY = `${Math.floor(item.sortKey / columns) * 100}%`;
				return item;
			});

			this.data.rows = Math.ceil(list.length / columns);

			this.setData({
				list,
				listWxs: list,
				wrapStyle: `height: ${this.data.rows * this.data.itemHeight}px;`
			});
			if (list.length === 0) return;

			setTimeout(() => this.initDom(), 0);
		}
	},
	ready() {
		this.init();
	}
});
