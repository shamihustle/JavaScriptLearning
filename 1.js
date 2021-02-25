function divide_table(inputValueDiv)
{
    var originalTable = document.querySelectorAll('table')[0];

    var rowNumber = getArrayFromString(inputValueDiv);
    var reg = new RegExp("[0-9]{0,2}");
    for(let i = 0; i < rowNumber.length; i++)
    {
        rowNumber[i]++;
    
        if(rowNumber[i] < 0 || rowNumber[i] > originalTable.rows.length 
            || !reg.test(rowNumber[i]) || rowNumber[i] == NaN)
        {
            alert("Некорректный ввод");
            return 0;
        }
    }

    var firstTablePlace = document.getElementById("div1");
    var secondTablePlace = document.getElementById("div2");
    var thirdTablePlace = document.getElementById("div3");
    var fourthTablePlace = document.getElementById("div4");
    clearTablePlace(firstTablePlace);
    clearTablePlace(secondTablePlace);
    clearTablePlace(thirdTablePlace);
    clearTablePlace(fourthTablePlace);

    var followingTables = getNoFirstTable(originalTable, rowNumber);

    secondTablePlace.appendChild(followingTables[0]);
    if(followingTables.length == 2)
    {
        thirdTablePlace.appendChild(followingTables[1]);
    }
    if(followingTables.length == 3)
    {
        thirdTablePlace.appendChild(followingTables[1]);
        fourthTablePlace.appendChild(followingTables[2]);
    }
    firstTablePlace.appendChild(getFirstTable(originalTable, rowNumber[0]));

}

function getFirstTable(table, rowNumber)
{
    var rows = table.getElementsByTagName("tr");
    var tbody = document.createElement("tbody");
    var firstTable = table.cloneNode(false);

    tbody.appendChild(rows[0].cloneNode(true));
    for (let i = 1; i < rowNumber; i++) 
    {
        tbody.appendChild(rows[i].cloneNode(true));
    }
    firstTable.appendChild(tbody);
    return firstTable;
}

function getNoFirstTable(table, rowNumber)
{
    var arrTables = [];
    for(let k = 0; k < rowNumber.length; k++)
    {
        var rows = table.getElementsByTagName("tr");
        var tbody = document.createElement("tbody");
        var currentTable = table.cloneNode(false);
        tbody.appendChild(rows[0].cloneNode(true));
    
        // Создание двухмерного массива из таблицы 
        var cells2D = get2DArrayFromHTMLTable(rows);
   
        // Создание HTML таблицы из двухмерного массива
        getHTMLTableFrom2DArray(cells2D, tbody);
        currentTable.appendChild(tbody);

        // Удаление линих строк из новой HTML таблицы
        if(k == (rowNumber.length - 1))
        {
            for (let i = rowNumber[k]; i > 0; i--) 
            {
                currentTable.deleteRow(i);
            }
        }
        else
        {
            for (let i = currentTable.rows.length - 1; i > 0; i--) 
            {
                if(!(i > rowNumber[k] && i <= rowNumber[k + 1]))
                {
                    currentTable.deleteRow(i);
                }
            }
        }

        // Объединение столбцов таблицы 
        combineCol(currentTable);

        // Объединение строк таблицы 
        SummerizeTable(currentTable);

        arrTables.push(currentTable);
    }

    return arrTables;
}

function get2DArrayFromHTMLTable(rows)
{
    var cells2D = [];
    var rowsLength = rows.length;
    for (var r = 0; r < rowsLength; ++r) 
    {
        cells2D[r] = [];
    }
    for (var r = 0; r < rowsLength; ++r) 
    {
        var cells = rows[r].cells;
        var x = 0;
            for (var c = 0, cellsLength = cells.length; c < cellsLength; ++c) 
            {
            var cell = cells[c].cloneNode(true);
            while (cells2D[r][x]) 
            {
                ++x;
            }
            var x3 = x + (cell.colSpan || 1);
            var y3 = r + (cell.rowSpan || 1);
            for (var y2 = r; y2 < y3; ++y2) 
            {
                for (var x2 = x; x2 < x3; ++x2) 
                {
                    cells2D[y2][x2] = cell.cloneNode(true);
                }
            }
            x = x3;
        }
    }
    return cells2D;
}

function getHTMLTableFrom2DArray(cells2D, tbody)
{
    for (var i = 0; i < cells2D.length; i++) 
    {
        var tr = document.createElement('tr');
        for (var j = 0; j < cells2D[i].length; j++) 
        {
            console.log(cells2D[i][j].innerHTML);
            cells2D[i][j].innerHTML = cells2D[i][j].innerHTML.replace("<td>");
            cells2D[i][j].innerHTML = cells2D[i][j].innerHTML.replace("</td>");
            console.log(cells2D[i][j].innerHTML);

            var td = document.createElement('td');
            td.innerHTML = cells2D[i][j].innerHTML;
            // td.appendChild(cells2D[i][j]);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    return tbody;
}

// Объединение строк с одинаковым значением
function SummerizeTable(table) {
    $(table).each(function() 
    {
      $(table).find('td').each(function()
      {
            var $this = $(this);
            var col = $this.index();
            var html = $this.html();
            var row = $(this).parent()[0].rowIndex; 
            var span = 1;
            var cell_above = $($this.parent().prev().children()[col]);
    
            // look for cells one above another with the same text
            while (cell_above.html() === html) 
            { // if the text is the same
                span += 1; // increase the span
                cell_above_old = cell_above; // store this cell
                cell_above = $(cell_above.parent().prev().children()[col]); // and go to the next cell above
            }
    
            // if there are at least two columns with the same value, 
            // set a new span to the first and hide the other
            if (span > 1) 
            {
                // console.log(span);
                $(cell_above_old).attr('rowspan', span);
                $this.hide();
            }
        
      });
    });
}

// Объединение стобцов с одинаковым значением
function combineCol(secondTable) 
{
    for(let i = 1; i < secondTable.rows.length; i++)
    {
        for(let j = 1; j < secondTable.rows[i].cells.length; j++)
        {
            console.log(secondTable.rows[i].cells[j].innerHTML);
            console.log(secondTable.rows[i].cells[j - 1].innerHTML);

            if(secondTable.rows[i].cells[j].innerHTML == secondTable.rows[i].cells[j - 1].innerHTML)
            {
                console.log("Equal : ");
                console.log(secondTable.rows[i].cells[j].innerHTML);
                console.log(secondTable.rows[i].cells[j - 1].innerHTML);
                secondTable.rows[i].cells[j].remove();
                secondTable.rows[i].cells[j - 1].colSpan++;
                j--;
            }
        }
    }
}

function getArrayFromString(str)
{
    var arr = str.split(" ");

    return arr;
}

function checkRowSpan(row)
{
    for (let i = 0; i < row.cells.length; i++) 
    {
        if(row.cells[i].rowSpan != 1)
        {
            return false;
        }
    }
    return true;
}

function getMaxCellsCount(table)
{
    var rows = table.getElementsByTagName("tr");
    var maxCells = 0;
    for(let i = 0; i < rows.length; i++)
    {
        var cells = rows[i].getElementsByTagName("td");
        if(cells.length > maxCells) maxCells = cells.length
    }
    return maxCells;
}

function clearTablePlace(tablePlace)
{
    while (tablePlace.firstChild) 
    {
        tablePlace.removeChild(tablePlace.firstChild);
    }
}
