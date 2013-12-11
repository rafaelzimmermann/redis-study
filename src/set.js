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
		client.del("foo-set", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.del("foo-set2", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.sadd("foo-set", "a", "b", "c", "d", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.sadd("foo-set2", "e", "f", "c", "d", function(){
			next(null);
		});
	})
	.then(function(next) {
		client.sdiff("foo-set", "foo-set2", next);
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
