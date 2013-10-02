var redis = require("redis"),
	client = redis.createClient(),
	print = redis.print,
	value;

var test = function() {
	client.del("foo-list");
	client.rpush("foo-list", "last", print);
	client.lpush("foo-list", "first", print);
	client.rpush("foo-list", "new-last", print);
	client.lrange("foo-list", 0, -1, print);

	client.rpush("foo-list", "a", "b", "c");
	client.lrange("foo-list", 0, -1, print);

	client.rpush("foo-list", ["a", "b", "c"]);
	client.lrange("foo-list", 0, -1, print);

	client.ltrim("foo-list", 0, -1);
	client.lrange("foo-list", 2, -1, print);
	
	client.quit();
};

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("connect", test);