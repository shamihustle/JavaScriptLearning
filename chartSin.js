
    function init() 
    {
        var chartPlace = document.getElementById("divChart");

        var height = 500; 
        var width = 500;
        var margin = 30;
        var rawDataSinChart = [];
        var dataSinChart = [];

        var rawDataCosChart = [];
        var dataCosChart = [];

        var amplitudeSin = 60;
        var freqSin = 0.5;

        getSinChartData(rawDataSinChart, 0, 100, freqSin, 20, 1000);
        getCosChartData(rawDataCosChart, 0, 100, freqSin, amplitudeSin, 1000);


        var svg = d3.select(chartPlace).append("svg")
            .attr("class", "axis")
            .attr("width", width)
            .attr("height", height);

        // длина оси X= ширина контейнера svg - отступ слева и справа
        var xAxisLength = width - 2 * margin;     
        
        // длина оси Y = высота контейнера svg - отступ сверху и снизу
        var yAxisLength = height - 2 * margin;

        // функция интерполяции значений на ось Х  
        var scaleX = d3.scaleLinear()
            .domain([0, 100])
            .range([0, xAxisLength]);
            
        // функция интерполяции значений на ось Y
        var scaleY = d3.scaleLinear()
            .domain([100, -100])
            .range([0, yAxisLength]);

        // масштабирование реальных данных в данные для нашей координатной системы
        for(i = 0; i < rawDataSinChart.length; i++)
        {
            dataSinChart.push({x: scaleX(rawDataSinChart[i].x) + margin, y: scaleY(rawDataSinChart[i].y) + margin});
            dataCosChart.push({x: scaleX(rawDataCosChart[i].x) + margin, y: scaleY(rawDataCosChart[i].y) + margin});
        }
        var xAxis = d3.axisBottom(scaleX);
        var yAxis = d3.axisLeft(scaleY);

        // отрисовка оси Х             
        svg.append("g")       
            .attr("class", "x-axis")
            .attr("transform", "translate("+ margin +", "+ height / 2 +")")
            .call(xAxis);

        // отрисовка оси Y 
        svg.append("g")       
            .attr("class", "y-axis")
            .attr("transform", // сдвиг оси вниз и вправо на margin
                    "translate(" + margin + "," + margin + ")")
            .call(yAxis);

        
        // создаем набор вертикальных линий для сетки   
        d3.selectAll("g.x-axis g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", -(yAxisLength / 2))
            .attr("x2", 0)
            .attr("y2", (yAxisLength / 2))
            .style("stroke", "steelblue")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"));
            
        // рисуем горизонтальные линии координатной сетки
        d3.selectAll("g.y-axis g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", xAxisLength)
            .attr("y2", 0)
            .style("stroke", "steelblue")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"));


        
        printLine(dataSinChart, svg, "black");
        printLine(dataCosChart, svg, "red");
        
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        printCirlces(dataSinChart, svg, "black");
        printCirlces(dataCosChart, svg, "red");
    }
    
    window.onload = init;
    
    function getSinChartData(data, startX, stopX, freq, amplitude, pointCount)
    {
        var step = (stopX - startX) / pointCount;
        var lastPoint = (stopX - startX) / step;
        for(let i = 0; i < lastPoint; i++)
        {
            var ySin = amplitude * Math.sin(freq * startX);
            data.push({x: startX, y: ySin});
            startX += step;
        }

        var ySinLatPoint = amplitude * Math.sin(freq * stopX);
        data.push({x: stopX, y: ySinLatPoint});

        return data;
    } 
    
    
    function printCirlces(data, svg, color)
    {
        var dataCircles = [];
        for(let i = 0; i < data.length; i+=4)
        {  
            dataCircles.push(data[i]);
        }

        svg.selectAll(".dot")
            .data(dataCircles)
            .enter().append("circle")
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('r', 2)  
            .attr('fill', 'none')
            .style("stroke", color);

        // return dataCircles;
    }

    function printLine(data, svg, color)
    {
                // функция, создающая по массиву точек линии
        var line = d3.line()
            .x(function(d){return d.x;})
            .y(function(d){return d.y;});
            
        svg.append("path")
            .attr("d", line(data))
            .style("fill", "none")
            .style("stroke", color);
    }
    
    function getCosChartData(data, startX, stopX, freq, amplitude, pointCount)
    {
        var step = (stopX - startX) / pointCount;
        var lastPoint = (stopX - startX) / step;
        for(let i = 0; i < lastPoint; i++)
        {
            var ySin = amplitude * Math.cos(freq * startX);
            data.push({x: startX, y: ySin});
            startX += step;
        }

        var ySinLatPoint = amplitude * Math.sin(freq * stopX);
        data.push({x: stopX, y: ySinLatPoint});

        return data;
    }



    // Функция генерации случайного целого числа в диапазоне [lo..up]
    function irand(lo, up) 
    {
        return Math.floor(Math.random()*(up-lo+1)+lo); 
    }
