var app = app || {};
// 模型视图
app.TodoView = Backbone.View.extend({
	tagName: 'li',

	itemTemplate: _.template($("#item-template").html()),

	initialize: function() {
		this.listenTo(this.model,"change",this.render);
		this.listenTo(this.model,"destroy",this.remove);
		this.listenTo(this.model,"visible",this.toggleVisible);
	},

	events: {
		"click .toggle": "toggleCompleted",
		"click .destroy": "clear",
		"dblclick label": "edit",
		"blur .edit": "editCompleted",
		"keypress .edit": "updateCompleted"
	},

	isHidden: function() {
		var completed = this.model.get("completed");

		return (
			(!completed && app.TodoFilter === "completed") || (completed && app.TodoFilter === "active")
			);
	},

	toggleVisible: function() {
		this.$el.toggleClass("hidden",this.isHidden());
	},

	editCompleted: function() {
		var newTitle = this.$(".edit").val().trim();
		if (newTitle) {
			this.model.save({
				title: newTitle
		    });
		} else {
			this.clear();
		}
		this.$el.removeClass("editing");
	},

	updateCompleted: function(event) {
		if (event.which === 13) {
			this.editCompleted();
		}
	},

	edit: function() {
		this.$el.addClass("editing");
		this.$(".edit").focus();
	},

	clear: function() {
		this.model.destroy();
	},

	toggleCompleted: function() {
		this.model.save({
			completed: !this.model.get("completed")
		});
	},

	render: function() {

		this.$el.html(this.itemTemplate(this.model.attributes));
		this.$el.toggleClass("completed",this.model.get("completed"));
		//需要返回值
		return this;
	}
});