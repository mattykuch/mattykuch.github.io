$(function () {


    	// First, let's make the colors transparent
    	Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    		return Highcharts.Color(color)
    			.setOpacity(0.5)
    			.get('rgba');
    	});

        $('#bopv3').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Supply Vs Consumption per Month in 2017 for BOPV-3',
                    style: {
                                color: '#5e82a3',
                                fontWeight: 'bold',
                                fontSize: '15px'
                            }
            },
            subtitle: {
                text: 'Source: DHIS2/National Medical Stores'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun'
                    
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Doses / No. of Children'
                }
            },
            legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 950,
                y: 0,
                floating: true,
                shadow: true
            },
            tooltip: {
                shared: true,
                valueSuffix: ''
            },
            plotOptions: {
                column: {
                	grouping: false,
                	shadow: false
                }
            },
            series: [{
                name: 'No. of doses supplied',
                data: [376400,711000,558000,682000,555000,588000],
                pointPadding: 0

            }, {
                name: 'No. of children vaccinated',
                data: [119384,108805,122775,121207,126324,121056],
                pointPadding: 0.1

            }, {

            	name: 'Monthly target (children)',
                data: [134998,134998,134998,134998,134998,134998],
                pointPadding: 0.1

            }]
        });
    });
