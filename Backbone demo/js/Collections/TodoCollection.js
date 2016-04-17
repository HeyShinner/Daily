var app = app || {};
// 模型集合
app.TodoList = Backbone.Collection.extend({
	model: app.Todo,
	localStorage: new Backbone.LocalStorage("todo"),

	getCompleted: function() {
		return this.filter(function(todo) {
			return todo.get("completed") === true;
		});
	},

	getRemaining: function() {
		return this.filter(function(todo) {
			return todo.get("completed") === false;
		});
	}
});

app.todoList = new app.TodoList;