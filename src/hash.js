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
		client.del("foo-hash", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.hmset("foo-hash", { "p1" : "hi", "p2" : 1000}, function(){
			next(null);
		});
	})
	.then(function(next) {
		client.hkeys("foo-hash", next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.hexists("foo-hash", "num", next);
	})
	.then(function(next, err, data) {
		console.log(data);
		client.hincrby("foo-hash", "num", 1, next);
	})
	.then(function(next) {
		client.hexists("foo-hash", "num", next);
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
