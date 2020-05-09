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
	<meta http-equiv="refresh" content="1">
	<meta name="viewport" content="initial-scale = 1.0,maximum-scale = 1.0">
    </head>
    <body>
`;

const message2 = `
    </body>
</html>
  `;

exports.result = (req, res) => {
  var mysqlPool = mysql.createConnection(mysqlConfig);
  var sql = "SELECT status FROM turnstile_status";
  mysqlPool.query(sql, [], (err, results) => {
	var output = ""
	mysqlPool.end();
   console.log("Result", err, results);
	if(results[0].status < 30){
		output = message + "<p style='color:black;font-size:150px'> No person in front of sensor </p>" + message2;
		  res.status(200).send(output);	
	}else if (results[0].status < 38.5){
		let temp = parseFloat((results[0].status % 1) + 36.4 ).toFixed(2)
		output = message + "<p style='color:blue;font-size:150px'>Normal Temperature of " + temp + " &#176;C <br/><br/><b> Please enter </b></p>" + message2;
		  res.status(200).send(output);	
	}else{
		let temp = parseFloat((results[0].status % 2) + 39).toFixed(2)
		output = message + "<p style='color:red;font-size:150px'>Fever of " + temp + " &#176;C detected<br/><br/> <b>Entry Denied</b></p>" + message2;
		  res.status(200).send(output);		
		  
	}  
  });
  
};

