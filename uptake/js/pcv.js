$(function () {


    	// First, let's make the colors transparent
    	Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    		return Highcharts.Color(color)
    			.setOpacity(0.5)
    			.get('rgba');
    	});

        $('#pcv').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Supply Vs Consumption per Month in 2017 for PCV ALL',
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
                data: [417600,328000,325400,451000,343200,353000],
                pointPadding: 0

            }, {
                name: 'No. of children vaccinated',
                data: [362812,350016,341333,360145,380734,371854],
                pointPadding: 0.1

            }, {

            	name: 'Monthly target (children)',
                data: [134998,134998,134998,134998,134998,134998],
                pointPadding: 0.1

            }]
        });
    });
