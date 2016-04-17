var app = app || {};

app.TodoRouter = Backbone.Router.extend({
	routes: {
		"*filter": "setFilter"
	},

	setFilter: function(filter) {
		if (filter) {
			filter = filter.trim();
		}

		app.TodoFilter = filter || {};

		app.todoList.trigger("filter");
	}
});
app.todoRouter = new app.TodoRouter;

Backbone.history.start();