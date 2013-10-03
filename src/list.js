var redis = require("redis"),
	Futures = require("futures"),
	Join = require("join"),
	Sequence = Futures.sequence,
    sequence = Sequence(),
	client = redis.createClient(),
	print = redis.print,
	value;

var test = function() {
	sequence
		.then(function(next) {
			client.del("foo-list", function(){
				next(null);
			});
		})
		.then(function(next) {
			client.rpush("foo-list", "last", function(){
				next(null);
			});
		})
		.then(function(next) {
			client.lpush("foo-list", "first", function(){
				next(null);
			});
		})
		.then(function(next) {
			client.rpush("foo-list", "new-last", function(){
				next(null);
			});
		})
		.then(function(next) {
			client.lrange("foo-list", 0, -1, function(err, data){
				next(err, data);
			});
		})
		.then(function(next, err, data){
			console.log(data);
			var join = Join.create();
				callbackA = join.add(),
				callbackB = join.add();
			client.del("foo-list", callbackA);
			client.del("foo-list2", callbackB);
			join.when(next);
		})
		.then(function(next) {
			var join = Join.create();
				callbackA = join.add(),
				callbackB = join.add();
			client.rpush("foo-list", "a", "b", "c", callbackA);
			client.rpush("foo-list2", "x", "y", "z", callbackB);
			join.when(next);
		})
		.then(function(next) {
			client.brpoplpush("foo-list", "foo-list2", 1, function(){
				next(null);
			});
		})
		.then(function(next) {
			client.lrange("foo-list", 0, -1, function(err, data){
				next(err, data);
			});
		})
		.then(function(next, err, data) {
			console.log(data);
			client.lrange("foo-list2", 0, -1, function(err, data){
				next(err, data);
			});
		}).then(function(next, err, data){
			console.log(data);
			client.quit();
		});
};

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("connect", test);