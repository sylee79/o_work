/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const mysql = require('mysql');

const mysqlConfig = {
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

function recursiveProc(resp, i, results, targetNumber, cb){
	console.log("Process i : ", i );
	if(i+3 < targetNumber){
		let mysqlPool = mysql.createConnection(mysqlConfig);
		// is first records created time close to other 2 records?
		console.log("Time different:", Math.abs(results[i].dt - results[i+1].dt), Math.abs(results[i].dt - results[i+2].dt), Math.abs(results[i+2].dt - results[i+3].dt));
		if( (Math.abs(results[i].dt - results[i+1].dt) < Math.abs(results[i+2].dt - results[i+3].dt - 1000) )&& (Math.abs(results[i+1].dt - results[i+2].dt)) < (Math.abs(results[i+2].dt - results[i+3].dt - 1000)) ){
			if( results[i].human_temperature ){
				if(results[i+1].env_temperature && results[i+2].detected_range){
					mysqlPool.query( "UPDATE iot_thermo SET env_temperature = ?, detected_range = ?, processed = 1 WHERE id = ?",
					[results[i+1].env_temperature, results[i+2].detected_range, results[i].id], (err, res) => {
						console.log("result - 1", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else if(results[i+2].env_temperature && results[i+1].detected_range){
					mysqlPool.query( "UPDATE iot_thermo SET env_temperature = ?, detected_range = ?, processed = 1 WHERE id = ?",
					[results[i+2].env_temperature, results[i+1].detected_range, results[i].id], (err, res) => { 
						console.log("result - 2", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else{
					// some thing wrong with this 3 records, delete the first records
					console.log("Something wrong with this set...  delete the first records!!");
					mysqlPool.query( "DELETE FROM iot_thermo WHERE id = ?", [results[i].id], (err, res) => {
						console.log("result - 3", err, res);
						mysqlPool.end();
						recursiveProc(resp, ++i, results, targetNumber, cb);
					});
				}
			}else if (results[i].env_temperature){
				if(results[i+1].human_temperature && results[i+2].detected_range){
					mysqlPool.query( "UPDATE iot_thermo SET human_temperature = ?, detected_range = ?, processed = 1 WHERE id = ?",
					[results[i+1].human_temperature, results[i+2].detected_range, results[i].id], (err, res) => { 
						console.log("result - 4", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else if(results[i+2].human_temperature && results[i+1].detected_range){
					mysqlPool.query( "UPDATE iot_thermo SET human_temperature = ?, detected_range = ?, processed = 1 WHERE id = ?",
					[results[i+2].human_temperature, results[i+1].detected_range, results[i].id], (err, res) => { 
						console.log("result - 5", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else{
					// some thing wrong with this 3 records, delete the first records
					console.log("Something wrong with this set...  delete the first records!!");
					mysqlPool.query( "DELETE FROM iot_thermo WHERE id = ?", [results[i].id], (err, res) => { 
						console.log("result - 6", err, res);
						mysqlPool.end();
						recursiveProc(resp, ++i, results, targetNumber, cb);
					});
				}							
			}else if (results[i].detected_range){
				if(results[i+1].human_temperature && results[i+2].env_temperature){
					mysqlPool.query( "UPDATE iot_thermo SET human_temperature = ?, env_temperature = ?, processed = 1 WHERE id = ? ",
					[results[i+1].human_temperature, results[i+2].env_temperature, results[i].id], (err, res) => {
						console.log("result - 7", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else if(results[i+2].human_temperature && results[i+1].env_temperature){
					mysqlPool.query( "UPDATE iot_thermo SET human_temperature = ?, env_temperature = ?, processed = 1 WHERE id = ? ",
					[results[i+2].human_temperature, results[i+1].env_temperature, results[i].id], (err, res) => {
						console.log("result - 8", err, res);
						mysqlPool.query( "DELETE FROM iot_thermo WHERE id in [ ?, ? ]", [results[i+1].id, results[i+2].dt], (err,res2) => {
							console.log("clear records", err, res);
							mysqlPool.end();
							recursiveProc(resp, ++i, results, targetNumber, cb);
						});
					});
				}else{
					// some thing wrong with this 3 records, delete the first records
					console.log("Something wrong with this set...  delete the first records!!");
					mysqlPool.query( "DELETE FROM iot_thermo WHERE id = ?", [results[i].id], (err, res) => { 
						console.log("result - 9", err, res);
						mysqlPool.end();
						recursiveProc(resp, ++i, results, targetNumber, cb);
					});
				}							
			}else{
				console.log("Something wrong!!! delete the first records??");
				mysqlPool.query( "DELETE FROM iot_thermo WHERE id = ?", [results[i].id], (err, res) => { 
					console.log("result - 10", err, res);
					mysqlPool.end();
					recursiveProc(resp, ++i, results, targetNumber, cb);
				});
			}						
		}else{
			console.log("can't find match, delete the first records!");
			mysqlPool.query( "DELETE FROM iot_thermo WHERE id = ?", [results[i].id], (err, res) => { 
				console.log("result - 11", err, res);
				mysqlPool.end();
				recursiveProc(resp, ++i, results, targetNumber, cb);
			});							 
		}
	
	}else{
		console.log("Process CB");
		resp.status(200).send("OK");
		cb;
	}
}

exports.process = (req, resp) => {
	let sql="SELECT count(id) as cnt FROM iot_thermo where processed = 0";
	
	try{
		let mysqlPool = mysql.createConnection(mysqlConfig);
		mysqlPool.query(sql, [], (err, results) => {
			if (results[0].cnt > 10 ){
				let targetNumber = (results[0].cnt > 200)?200:(Math.floor(results[0].cnt/10)*10);
				
				sql="SELECT id, UNIX_TIMESTAMP(created_at)*1000 as dt, human_temperature, env_temperature, detected_range FROM iot_thermo where processed = 0 order by id limit " + targetNumber;
				mysqlPool.query(sql, [], (err, results) => {
					console.log("Process records: ", results.length);
					let i = 0;
					console.log("=====>", Math.abs(results[i].dt - results[i+1].dt));
					recursiveProc(resp, i, results, targetNumber, function (){
						console.log("Log completed");
						resp.status(200).send("OK");
					});
					mysqlPool.end();
				});
			}else{
				resp.status(200).send("OK");
				mysqlPool.end();
			}
		});
	}catch(error){
		if(mysqlPool != null)
			mysqlPool.end();
	}
};
