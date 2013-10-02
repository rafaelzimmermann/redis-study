var redis = require("redis"),
	client = redis.createClient(),
	value;

var test = function() {

	value = client.get("foo", redis.print);
	
	value = client.incrby("foo", 15);
	console.log(value);

	value = client.get("foo", redis.print);
	
	client.set("foo", 10, redis.print);
	value = client.incr("foo", redis.print);
	
	value = client.get("foo", redis.print);

	client.set("monkey","Spike");
	client.append("monkey", "Spiegel", redis.print);
	client.get("monkey",redis.print);
	client.set("horse","Gooo", redis.print);
	client.setrange("horse",2,"Horse", redis.print);
	client.get("horse",redis.print);
	client.bitcount("horse", redis.print);
	client.substr("horse", 2, 7, redis.print);

	client.quit();
};

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("connect", test);
