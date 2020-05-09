/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const mysql = require('mysql');
const { Client } = require('tplink-smarthome-api');

const client = new Client();
var mysqlConfig = {
    connectionName: process.env.INSTANCE_CONNECTION_NAME || 'dev-guild-255401:asia-southeast1:iot-poc',
    host: process.env.INSTANCE_HOST_NAME || '127.0.0.1',
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
  try{
    mysqlPool = mysql.createConnection(mysqlConfig);
    mysqlPool.query(sql, [reqBody], (err, results) => {
      if(err){
          mysqlPool.end();
      }
      if(req.body.notifications && req.body.notifications[0] && (req.body.notifications[0].path == '/3304/0/5700'))
      {
        console.log("Payload", req.body.notifications[0].payload);
		let query = (new Buffer(req.body.notifications[0].payload, 'base64').toString('ascii'));
        console.log("Update humidity Status : ", query);
		mysqlPool.query("UPDATE humidity_status set `value` = ?",[(new Buffer(req.body.notifications[0].payload, 'base64').toString('ascii'))],(err, result)=>{
         mysqlPool.end();
		 if(query > 55){
			let plug = client.getDevice({host: 'sengyee.tplinkdns.com', port: '29090'}).then((device)=>{
				device.getSysInfo().then(console.log);
				device.setPowerState(false).then(function(value){
					return;
				});
			});
		 }else{
			let plug = client.getDevice({host: 'sengyee.tplinkdns.com', port: '29090'}).then((device)=>{
				device.getSysInfo().then(console.log);
				device.setPowerState(true).then(function(value){
					return;
				});
			});
		 } 
		});
      }else{
      	//console.log("Reset Seat Status");
        //mysqlPool.query("UPDATE seat_status set seat_status = 0",[],(err, result)=>{
         //mysqlPool.end();
        //});
      }
    });
  }catch(sqlErr){
    console.error("SQL Catch:", sqlErr);
    mysqlPool.end();
  }



  res.status(200).send("OK");
};
