var app = app || {};
// 应用视图
app.AppView = Backbone.View.extend({
	el: "#todoapp",
	// 绑定事件
	events: {
		"keypress #new-todo": "createOnEnter",
		"click #clear-completed": "clearCompleted",
		"click #toggle-all": "toggleAll"
	},
	//添加到模型里后需要在模型集合中监听add事件，从而触发，将模型传递给模型视图实例化过后的dom结构，添加到ul中的方法
	initialize: function() {
		this.listenTo(app.todoList,"add",this.addOne);
		this.listenTo(app.todoList,"all",this.render);
		this.listenTo(app.todoList,"filter",this.filterAll)
		app.todoList.fetch();
	},

	statsTemplate: _.template($("#stats-template").html()),

	render: function() {
		var completed = app.todoList.getCompleted().length;
		var remaining = app.todoList.getRemaining().length;

		this.$("#footer").html(this.statsTemplate({
			completed: completed,
			remaining: remaining
		}));

		this.$("#filters li a").removeClass("selected").filter('[href="#/' + (app.TodoFilter || '') + '"]').addClass("selected");
	},

	filterOne: function(todo) {
		todo.trigger("visible");
	},

	filterAll: function() {
		app.todoList.each(this.filterOne,this);
	},

	toggleAll: function() {
		var completed = this.$("#toggle-all")[0].checked;
		app.todoList.each(function(todo) {
			todo.save({
				completed: completed
			});
		});
	},

	clearCompleted: function() {
		_.invoke(app.todoList.getCompleted(),"destroy");
		return false;
	},

	addOne:function(todo) {
		var todoView = new app.TodoView({model: todo});
		$("#todo-list").append(todoView.render().el);
	},

	// 当输入框里按下回车键且输入框内容不为空时触发函数，将模型添加到模型集合里
	createOnEnter: function(event) {
		if (event.which !== 13 || this.$("#new-todo").val()=== "") {
			return;
		}

		app.todoList.create({
			title: $("#new-todo").val().trim(),
			completed: false
		});

		this.$("#new-todo").val("");
	}
});