var redis = require("redis"),
	client = redis.createClient(),
	value;

var testCommands = function() {
	client.on("error", function (err) {
	    console.log("Error " + err);
	});


	value = client.get("foo", redis.print);
	
	value = client.incrby("foo", 15);
	console.log(value);

	value = client.get("foo", redis.print);
	
	client.set("foo", 10, redis.print);
	value = client.incr("foo", redis.print);
	
	value = client.get("foo", redis.print);
}

client.on("connect", testCommands);