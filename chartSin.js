
    function init() 
    {
        var chartPlace = document.getElementById("divChart");

        var height = 500; 
        var width = 500;
        var margin=30;
        var rawData = [
            {x: 10, y: 67}, {x: 50, y: 68}, {x: 90, y: 88}
        ];
        var data=[];

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
        .attr("transform",  // сдвиг оси вниз и вправо
            "translate(" + margin + "," + (height - margin) + ")")
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
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", - (yAxisLength));
        
        // рисуем горизонтальные линии координатной сетки
        d3.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLength)
        .attr("y2", 0);

        

        // функция, создающая по массиву точек линии
        var line = d3.line()
                .x(function(d){return d.x;})
                .y(function(d){return d.y;});


        // добавляем путь
        svg
        .attr("d", line(data))
        .style("stroke", "steelblue")
        .style("stroke-width", 1);

                // добавляем путь
        svg.append("path")
        .attr("d", line(data));


    }
    
    window.onload = init;
    

    // Функция генерации случайного целого числа в диапазоне [lo..up]
    function irand(lo, up) 
    {
        return Math.floor(Math.random()*(up-lo+1)+lo); 
    }
