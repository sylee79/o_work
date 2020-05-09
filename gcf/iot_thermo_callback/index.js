/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const mysql = require('mysql');
const request1 = require('request');
const request2 = require('request');
const request3 = require('request');

const mysqlConfig = {
    //connectionName: process.env.INSTANCE_CONNECTION_NAME || 'dev-guild-255401:asia-southeast1:iot-poc',
    //host: process.env.INSTANCE_HOST_NAME || '127.0.0.1',
    // connectTimeout: 60000,
    // acquireTimeout: 60000,
    // connectionLimit: 50 ,
    user: 'root',
    password: 'tEster123',
    database: 'poc',
  	socketPath: `/cloudsql/dev-guild-255401:asia-southeast1:iot-poc`
};

exports.callback = (req, res) => {
	let reqBody = JSON.stringify(req.body);
	sql="INSERT INTO iot_data(raw_data) values( ? )";
	console.log(reqBody);
	console.log(sql);
	let mysqlPool = mysql.createConnection(mysqlConfig);
	try{
		mysqlPool.query(sql, [reqBody], (err, results) => {
			mysqlPool.end();
			if(req.body.registrations && req.body.registrations[0] && (req.body.registrations[0].ep))
			{
				console.log("Send Subscription request");
				var headers = {	'Authorization': 'Bearer ak_1MDE2ZjA5Y2MwYzI2OTI1YWFiNDc0ODJkMDAwMDAwMDA016fdc583c244a68f16ae84400000000yGPHzCb9kapx1n7VAtiCbY8CZHlfMWv2' };
				/*
				request1({
					url: 'https://api.us-east-1.mbedcloud.com/v2/subscriptions/'+ req.body.registrations[0].ep +'/5001/0/1',
					method: 'PUT',
					headers: headers
				}, function(error, response, body){
					if (!error && response.statusCode == 200) {
						console.log(body);
					}else{
						console.error(error);
					}
				});
				request2({
					url: 'https://api.us-east-1.mbedcloud.com/v2/subscriptions/'+ req.body.registrations[0].ep +'/5002/0/1',
					method: 'PUT',
					headers: headers
				}, function(error, response, body){
					if (!error && response.statusCode == 200) {
						console.log(body);
					}else{
						console.error(error);
					}
				});
				request3({
					url: 'https://api.us-east-1.mbedcloud.com/v2/subscriptions/'+ req.body.registrations[0].ep +'/5003/0/1',
					method: 'PUT',
					headers: headers
				}, function(error, response, body){
					if (!error && response.statusCode == 200) {
						console.log(body);
					}else{
						console.error(error);
					}
				});
				*/  
			}

			if(req.body.notifications && req.body.notifications[0] )
			{
				console.log("Payload", req.body.notifications[0].payload);
				let query = (new Buffer(req.body.notifications[0].payload, 'base64').toString('ascii'));
				let mysqlPool2 = mysql.createConnection(mysqlConfig);
				
				try{
					if (req.body.notifications[0].path == '/5001/0/1'){
						console.log("INSERT New IoT Thermo Record For Environment Temperature", query);
						mysqlPool2.query("INSERT INTO iot_thermo (created_at, env_temperature) VALUE(now(3), ?);",[(query<100)?query:query/100],(err, result)=>{
							mysqlPool2.end();
						});
					}else if (req.body.notifications[0].path == '/5002/0/1'){
						console.log("INSERT New IoT Thermo Record For Human Temperature: ", query);
						let mysqlPool2 = mysql.createConnection(mysqlConfig);
							mysqlPool2.query("INSERT INTO iot_thermo (created_at, human_temperature) VALUE(now(3),?);",[(query<100)?query:query/100],(err, result)=>{
							mysqlPool2.end();
						});
					}else if (req.body.notifications[0].path == '/5003/0/1'){
						console.log("INSERT New IoT Thermo Record For Distance: ", query);
						let mysqlPool2 = mysql.createConnection(mysqlConfig);
						mysqlPool2.query("INSERT INTO iot_thermo (created_at, detected_range) VALUE(now(3),?);",[query],(err, result)=>{
							mysqlPool2.end();
						});
					}else if (req.body.notifications[0].path == '/5004/0/1'){
						console.log("Update value of turnstiles status: ", query);
						let mysqlPool2 = mysql.createConnection(mysqlConfig);
						mysqlPool2.query("UPDATE turnstile_status set status =?;",[query],(err, result)=>{
							if(err){
								console.log("ERROR:", err);
							}
							mysqlPool2.end();
						});
					}
				}catch(error){
					if(mysqlPool2 != null)
					mysqlPool2.end();		
				}
			}

			res.status(200).send("OK");
		});
	}catch(error){
		if(mysqlPool != null)
			mysqlPool.end();
	}
};
