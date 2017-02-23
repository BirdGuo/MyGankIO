var Constant = require('../../utils/constants.js');
var Util = require('../../utils/util.js');

Page({
	data: {
		hidden: false,
		toastHidden: true,
		modalHidden: true,
		toastText: "数据无法正常显示，请将此问题上报管理员进行处理",
		loadingText: "加载中..."
	},
	onLoad: function (options) {
		that = this;
		if (options == null
			|| options.publishTime == null
			|| options.publishTime.split("-").length != 3) {
			that.setData({
				hidden: true,
				toastHidden: false
			});
			return
		}

		requestData(options.publishTime.split("-"))

	},
	onReady: function () {

	},
	onShow: function () {

	},
	onHide: function () {

	},
	onUnload: function () {

	},
	onPullDownRefresh: function () {

	},
	onReachBottom: function () {

	},

	onImageClick: function (event) {
		this.setData({ modalHidden: false })
	},

	onSaveClick: function (event) {
		// this.setData()
		saveImage()
	},

	onCancelClick: function (event) {
		this.setData({ modalHidden: true });
	},

	onToastChanged: function (event) {
		this.setData({ modalHidden: true });
	}

});

var that;
var mImageUrl = "";
var mVideoUrl = "";

function requestData(timeArray) {

	// console.log(Constant.BASE_URL + "/history/content/day/" + timeArray[0] + "/" + timeArray[1] + "/" + timeArray[2])

	wx.request({

		url: Constant.BASE_URL + "/history/content/day/" + timeArray[0] + "/" + timeArray[1] + "/" + timeArray[2],
		header: {
			"Content-Type": "application/json"
		},
		success: function (res) {

			// console.log(res)

			if (res == null || res.data == null || res.data.results == null || res.data.results.length <= 0) {
				console.error(Constant.ERROR_DATA_IS_NULL)
				return;
			}
			parseHtml(res.data.results[0].content)
		}

	})

}

function saveImage() {
	that.setData({
		hidden: false,
		toastHidden: true,
		modalHidden: true,
		loadingText: "下载中..."
	});
	wx.downloadFile({
		url: mImageUrl,
		type: 'image',
		success: function (res) {
			console.log("download success");
			that.setData({
				hidden: true,
				toastHidden: false,
				toastText: "图片已下载成功"
			})
		},
		fail: function (res) {
			console.log("download fail");
			that.setData({
				hidden: true,
				toastHidden: false,
				toastText: "下载失败，请重试"
			})
		}
	})
}

function parseHtml(htmlBlock) {
	var re = new RegExp("[a-zA-z]+://[^\"]*")
	var title = htmlBlock.split("img alt=")[1].match(re)[0]
	if (-1 != title.search("//ww")) {
		mImageUrl = title.require("//ww", "//ws")
	} else {
		mImageUrl = title;
	}

	var tags = [];
	var items = [];

	var doc = Util.parseHtml(htmlBlock)
	var tagElements = doc.getElementsByTagName("ul")

	console.log("doc")
	console.log(doc)
	console.log("tagElements")
	console.log(tagElements)
	
	for (var i = 0; i < tagElements.length; i++) {
		var value = tagElements[i]

		// console.log("value")
		// console.log(value)

		if (value.innerText.trim().length == 0) {
			continue;
		}

		var valueChildren = value.children
		// var j = 0
		var singleItems = [];
		for (var j = 0; j < valueChildren.length; j++) {
			// Things[i]
			var singleItem = [];
			singleItem.push(valueChildren[j].innerText.trim())
			singleItem.push(valueChildren[j].children[0].href.trim())
			singleItems.push(singleItem)
		}
		items.push(singleItems)
	}

	var h3s = doc.getElementsByTagName("h3")
	for (var i = 0; i < h3s.length; i++) {
		// h3s[i]
		tags.push(h3s[i].innerText)
	}

	if (tags.length != items.length) {
		console.log("not right")
	}

	// console.log(tags.length+" "+items.length)

	var finalData = [];
	for (var i = 0; i < tags.length; i++) {
		// tags[i]
		var node = []
		node.push(tags[i])
		node.push(items[i])
		finalData.push(node)
	}

	var itemList = []

	// console.log(items)
	console.log(items[0])
	console.log(items[0][1])

	for (var i = 0; i < tags.length; i++) {
		// items[i]
		var singleItemList = []
		for (var j = 0; j < items[i].length; j++) {
			// items[i]
			singleItemList.push({
				title: items[i][j][0], 
				url: items[i][j][1]
			})
			if (i == tags.length - 1) {
				mVideoUrl = items[i][j][1]
			}
		}
		itemList.push({tag: tags[i], singleItems: singleItemList});
	}

	that.setData({
		data: itemList,
		imageUrl: mImageUrl,
		mVideoUrl: mVideoUrl,
		hidden: true
	})

	console.log(finalData)

}
