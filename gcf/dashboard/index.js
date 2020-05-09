/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const mysql = require('mysql');
const async = require('async');
var mysqlConfig = {
        //connectionName: process.env.INSTANCE_CONNECTION_NAME || 'dev-guild-255401:asia-southeast1:iot-poc',
    //host: process.env.INSTANCE_HOST_NAME || '127.0.0.1',
    // connectTimeout: 60000,
    // acquireTimeout: 60000,
    // connectionLimit: 50 ,
    user: process.env.SQL_USER || 'root',
    password: process.env.SQL_PASSWORD || 'tEster123',
    database: process.env.SQL_NAME || 'poc',
  	socketPath: `/cloudsql/dev-guild-255401:asia-southeast1:iot-poc`
};

const page1 = `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Iot Thermometer</title>
  <style>
	@import url(https://fonts.googleapis.com/css?family=Roboto);

	body {
	  font-family: Roboto, sans-serif;
	}

	#chart {
	  max-width: 650px;
	  margin: 35px auto;
	}  
  </style>

</head>
<body>
<h1>Iot Thermometer Fever Detected Statistic</h1>
<!-- partial:index.partial.html -->
<div id="chart">
</div>
<!-- partial -->
  <script src='https://cdn.jsdelivr.net/npm/apexcharts'></script>
  <script >
  var options = {
          series: [{
          name: 'Healthy',
          data: [ 
`;

const page2 = "]}, { name: 'Mild', data: [";
const page3 = "]}, { name: 'Fever', data:["; 
const page4 =  `]
        }],
          chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          type: 'datetime',
          categories: [
`

const page5 = `
],
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
  </script>

</body>
</html>
`;

exports.board = (req, resp) => {
	var mysqlPool = mysql.createConnection(mysqlConfig);
	var sql = "SELECT DISTINCT(DATE_FORMAT(`created_at`,'%Y/%m/%d %H')) as dt FROM iot_thermo order by dt";
	mysqlPool.query(sql, [], (err, results_dt) => {
		var output_dt = "";
		for(i=0; i<results_dt.length; i++){
			output_dt +=  "'" + results_dt[i].dt + ":00 GMT',";
		}
		output_dt = output_dt.substring(0,output_dt.length-1);
		var output_health = "";
		var output_mild = ""; 
		var output_fever = "";
		mysqlPool.end();
		console.log("Date range:", output_dt);
		recursiveResult( resp, 0, results_dt, output_health, output_mild, output_fever, output_dt, function(){
			console.log("complete");
		});
		
		/*
		async.every(results_dt, function( dt, callback) {
			let mysqlPool2 = mysql.createConnection(mysqlConfig);
			mysqlPool2.query("SELECT SUM(IF(human_temperature < 41.5, 1, 0)) AS 'Healthy', SUM(IF(human_temperature >= 41.5 AND human_temperature < 42, 1, 0)) AS 'Mild', SUM(IF(human_temperature >=42 , 1,0 )) AS 'Fever' FROM iot_thermo WHERE DATE_FORMAT(`created_at`,'%Y-%m-%d %H') = ? and processed = 1", [dt.dt], (err2, result2) => {
				console.log("Query Result: ", dt, err, result2); 
				callback(result2[0], err2);					
			});
		}, function (healths, err){
			console.log("each resutl", healths);
			for(i=0; i< healths.length; i++){
				output_health += healts[i].Healthy + ',';
				output_mild += healths[i].Mild + ',';
				output_fever += healths[i].Fever + ',';
			}
		});
		*/
	});
};

function recursiveResult( resp, i, results_dt, output_health, output_mild, output_fever, output_dt, cb){
	if( i < results_dt.length){
		let mysqlPool2 = mysql.createConnection(mysqlConfig);
		mysqlPool2.query("SELECT SUM(IF(human_temperature < 37.5, 1, 0)) AS 'Healthy', SUM(IF(human_temperature >= 37.5 AND human_temperature < 38, 1, 0)) AS 'Mild', SUM(IF(human_temperature >=38 , 1,0 )) AS 'Fever' FROM iot_thermo WHERE DATE_FORMAT(`created_at`,'%Y/%m/%d %H') = ? and processed =1;",
								[results_dt[i].dt], (err2, result2) => {
			mysqlPool2.end();
			console.log("Query Result: ", i, results_dt[i].dt, err2, result2); 
			recursiveResult( resp, ++i, results_dt, 
									output_health + result2[0].Healthy + ',' ,
									output_mild + result2[0].Mild + ',' ,
									output_fever + result2[0].Fever + ',' ,
									output_dt,
									cb);
		});	
	}else{
		let output = page1 + output_health.substring(0, output_health.length - 1) + page2 + output_mild.substring(0, output_mild.length - 1) + page3 + output_fever.substring(0, output_fever.length - 1) + page4 + output_dt + page5;
		console.log("Output :" , output);
		resp.status(200).send(output );			
		cb();
	
	}
	


}
