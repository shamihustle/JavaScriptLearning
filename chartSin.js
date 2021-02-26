
    function init() 
    {
        var chartPlace = document.getElementById("divChart");

        var height = 500; 
        var width = 500;
        var margin = 30;
        /*
        var rawData = [
            {x: 10, y: Math.sin(x)}, {x: 20, y: Math.sin(x)}, {x: 30, y: Math.sin(x)},
            {x: 40, y: Math.sin(x)}, {x: 50, y: Math.sin(x)}, {x: 60, y: Math.sin(x)},
            {x: 70, y: Math.sin(x)}, {x: 80, y: Math.sin(x)}, {x: 90, y: Math.sin(x)}
        ];
        */
        var rawData = [];
        var data = [];
        var xRaw = 0;
        var amplitudeSin = 60;
        var rangeSin = 1000;
        var freqSin = 0.5;
        for(let i = 0; i < rangeSin; i++)
        {
            var yRaw = amplitudeSin * Math.sin(freqSin * xRaw);
            xRaw += 0.1;
            rawData.push({x: xRaw, y: yRaw});
        }


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
        for(i = 0; i < rawData.length; i++)
        {
            data.push({x: scaleX(rawData[i].x) + margin, y: scaleY(rawData[i].y) + margin});
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

        

        var circles = d3.selectAll('.line-group').selectAll('circle');  
        var circleCoords = [];
        // функция, создающая по массиву точек линии
        var line = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});

        
        // добавляем путь
        svg.append("path")
            .attr("d", line(data))
            .style("fill", "none")
            .style("stroke", "black");

    }
    
    window.onload = init;
    

    // Функция генерации случайного целого числа в диапазоне [lo..up]
    function irand(lo, up) 
    {
        return Math.floor(Math.random()*(up-lo+1)+lo); 
    }
