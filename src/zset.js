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
		client.del("foo-zset", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.zadd("foo-zset", 1, "a", 2, "b", 3, "c", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.zcard("foo-zset", next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.zincrby("foo-zset", "c", 3, next);
	})
	.then(function(next) {
		client.zscore("foo-zset", "b", next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.zrank("foo-zset", "c", next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.zcount("foo-zset", 0, 3, next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.quit();
	});
};

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("connect", test);
