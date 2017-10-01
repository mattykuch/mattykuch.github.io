$(function () {


    	// First, let's make the colors transparent
    	Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    		return Highcharts.Color(color)
    			.setOpacity(0.5)
    			.get('rgba');
    	});

        $('#bcg').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'BCG Only - Supply Vs Consumption per Month in 2017'
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
                    text: 'Doses or No. of Children'
                }
            },
            legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
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
                data: [456000,3000,460000,563000,245000,422000],
                pointPadding: 0

            }, {
                name: 'No. of children vaccinated',
                data: [135845,123322,123434,133151,140991,133154],
                pointPadding: 0.1

            }, {

            	name: 'No. of children targeted',
                data: [152265,152265,152265,152265,152265,152265],
                pointPadding: 0.1

            }]
        });
    });