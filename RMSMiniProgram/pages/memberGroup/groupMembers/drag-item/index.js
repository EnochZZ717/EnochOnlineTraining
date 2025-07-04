Component({
	properties: {
		columns: {
			type: Number,
			value: 1
		},
		itemData: {
			type: Object,
			value: {}
		},
		activeUser: {
			type: Object,
			value: {}
		}
	},
	methods: {
		itemClick(e) {
			this.triggerEvent('click', {
				test: "这是一个来自 drag-item 的测试信息"
			});
		},
		onShowOperation(e) {
			this.setData({activeUser:e.currentTarget.dataset['index']});
			this.triggerEvent('click', {
				e: e
			});
		}
	},
	ready() {

	}
})