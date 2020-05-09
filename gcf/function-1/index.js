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
	<link rel="stylesheet" href="https://storage.googleapis.com/sy_iot_poc/boilerplate.css">
	<link rel="stylesheet" href="https://storage.googleapis.com/sy_iot_poc/page.css">
	<meta charset="utf-8">
	<meta http-equiv="refresh" content="5">
	<meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0">
    </head>
    <body>

    <div id="primaryContainer" class="primaryContainer clearfix">
        <p id="Office_Space_POC">
        Office Space POC
        </p>
        <img id="image" src="https://storage.googleapis.com/sy_iot_poc/img/User.png" class="image" />
        <img id="image1" src="https://storage.googleapis.com/sy_iot_poc/img/User.png" class="image" />
        <img id="image2" src="https://storage.googleapis.com/sy_iot_poc/img/User.png" class="image" />
        <img id="image3" src="https://storage.googleapis.com/sy_iot_poc/img/User.png" class="image" />
        <img id="image4" src="https://storage.googleapis.com/sy_iot_poc/img/Table.png" class="image" />
		<img id="image5" src="https://storage.googleapis.com/sy_iot_poc/img/User-2.png" class="image" />
        <img id="image6" src="https://storage.googleapis.com/sy_iot_poc/img/User-2.png" class="image" />`;

const message2 = `
        <img id="image8" src="https://storage.googleapis.com/sy_iot_poc/img/User-2.png" class="image" />
    </div>
    </body>
</html>
  `;

exports.Result = (req, res) => {
  var mysqlPool = mysql.createConnection(mysqlConfig);
  var sql = "SELECT seat_status FROM seat_status";
  var output = ""
  mysqlPool.query(sql, [], (err, results) => {
    console.log(results);
	if((results[0].seat_status % 2) == 0){
		output = message + `
		        <img id="image7" style="visibility:hidden;" src="https://storage.googleapis.com/sy_iot_poc/img/User-2.png" class="image" />`
		        + message2;
		  res.status(200).send(output);	
	}else{
		output = message + `
		        <img id="image7" style="visibility:visible;" src="https://storage.googleapis.com/sy_iot_poc/img/User-2.png" class="image" />`
		        + message2;
		  res.status(200).send(output);		
	}  
  });
  
};

