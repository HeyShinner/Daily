var app = app || {};
// 模型
app.Todo = Backbone.Model.extend({
	defaults: {
		title: "",
		completed: false
	}
});