var util = require('../../utils/util.js');
var Constants = require('../../utils/constants.js');

Page({
	data: {
		items: [],
		hidden: false
	},
	onLoad: function (options) {

		var that = this;
		requestData(that, mCurrentPage + 1);
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

	}



})

var mTitles = [];
var mSrcs = [];
var mTimes = [];
var mCurrentPage = -1;

function requestData(that, targetPage) {
	console.log("targetPage:" + Constants.GET_URL.replace("(/\(\d+))$", targetPage));
	wx.request({
		url: Constants.GET_URL.replace("(/\(\d+))$", targetPage),
		header: {
			"Content-Type": "application/json"
		},
		success: function (res) {
			console.log("---------------1-----------------")
			if (res == null ||
				res.data == null ||
				res.data.results == null ||
				res.data.results.length <= 0) {
				console.error(Constants.ERROR_DATA_IS_NULL);
				return;
			}

			console.log(res)

			for (var i = 0; i < res.data.results.length; i++) {
				// Things[i]
				console.log(res.data.results[i])
				bindData(res.data.results[i]);
			}

			//将获得的各种数据写入itemList,用于setData
			var itemList = [];
			for (var i = 0; i < mTitles.length; i++) {
				// mTitles[i]
				itemList.push({ title: mTitles[i], src: mSrcs[i], time: mTimes[i] });
			}

			that.setData({
				items: itemList,
				hidden: true
			});
			mCurrentPage = targetPage;

		},

		fail: function () {
			// fail
			console.log("---------------2-----------------")
			// wx.hideNavigationBarLoading()
		},
		complete: function () {
			// complete
			console.log("---------------3-----------------")
		}
	})

}

function bindData(itemData) {
	//创建正则表达式
	var re = new RegExp("[a-zA-z]+://[^\"]*");
	//图片url标志之间是“img alt”
	var title = itemData.content.split("img alt=")[1].match(re)[0];
	if (-1 != (title.search("//ww"))) {
		var src = title.replace("//ww", "//ws");
	} else {
		var src = title;
	}

	mTitles.push(itemData.title);
	mTimes.push(itemData.publishedAt.split("T")[0]);
	mSrcs.push(src);


}