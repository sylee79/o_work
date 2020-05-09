/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const mysql = require('mysql');
var mysqlConfig = {
        connectionName: process.env.INSTANCE_CONNECTION_NAME || 'dev-guild-255401:asia-southeast1:iot-poc',
    host: process.env.INSTANCE_HOST_NAME || '127.0.0.1',
    // connectTimeout: 60000,
    // acquireTimeout: 60000,
    // connectionLimit: 50 ,
    user: process.env.SQL_USER || 'root',
    password: process.env.SQL_PASSWORD || 'tEster123',
    database: process.env.SQL_NAME || 'poc',
  	socketPath: `/cloudsql/dev-guild-255401:asia-southeast1:iot-poc`
};

const message = `
  <html>
    <head>
	<meta charset="utf-8">
	<meta http-equiv="refresh" content="3">
	<meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0">
    </head>
    <body>
`;

const message2 = `
    </body>
</html>
  `;

exports.Result = (req, res) => {
  var mysqlPool = mysql.createConnection(mysqlConfig);
  var sql = "SELECT value FROM humidity_status";
  var output = ""
  mysqlPool.query(sql, [], (err, results) => {
    console.log(results);
	if(results[0].value > 55){
		output = message + "<font size='80'> Humidity at " + results[0].value + "<br/><br/> " + "Humidifier STOP" + message2;
		  res.status(200).send(output);	
	}else{
		output = message + "<font size='80'> Humidity at " + results[0].value + "<br/><br/>" + "Humidifier START" + message2;
		  res.status(200).send(output);		
	}  
  });
  
};

