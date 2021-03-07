

// URL JSON файла
const URL = '../server/Company-list.json';

fetch(URL)
  .then(response => response.json())
  .then(data => {

    // Создаём таблицу
    let tableContainer = document.querySelector('#table_container');
    let table = document.createElement('table');

    // Голова таблицы
    const tHead = ['№', 'Компания', 'Цена', 'Дата'];

    let tHeadtr = table.appendChild(document.createElement('tr'))
          
    tHead.forEach(item => {
      tHeadtr.appendChild(document.createElement('th'))
            .innerText = item;
    });

    // Итерация данных
    data.forEach((item, index) => {

      // Первый столбик таблицы
      let tBodyTr_1 = table.appendChild(document.createElement('tr'));

      // Индекс таблицы
      let tableIndex = tBodyTr_1.appendChild(document.createElement('td'));                 
          tableIndex.innerText = index + 1;
          tableIndex.className = 'dark-aqua';
          tableIndex.setAttribute('rowspan', 3);

      // Название первой компании
      let name_1 = tBodyTr_1.appendChild(document.createElement('td'));
          name_1.innerText = item.company[0].name;
          
      // Цена первой компании
      let price_1 = tBodyTr_1.appendChild(document.createElement('td'));
          price_1.innerText = item.company[0].price;

      // Дата
      let date = tBodyTr_1.appendChild(document.createElement('td'));
          date.innerText = item.date;
          date.setAttribute('rowspan', 3);

      // Второй столбик таблицы
      let tBodyTr_2 = table.appendChild(document.createElement('tr'));

      // Название второй компании
      let name_2 = tBodyTr_2.appendChild(document.createElement('td'));
          name_2.innerText = item.company[1].name;
          
      // Цена второй компании
      let price_2 = tBodyTr_2.appendChild(document.createElement('td'));
          price_2.innerText = item.company[1].price;

      // Третий столбик таблицы
      let tBodyTr_3 = table.appendChild(document.createElement('tr'));

      // Название третей компании
      let name_3 = tBodyTr_3.appendChild(document.createElement('td'));
          name_3.innerText = item.company[2].name;
          
      // Цена третей компании
      let price_3 = tBodyTr_3.appendChild(document.createElement('td'));
          price_3.innerText = item.company[2].price;

      // Массив элементов способных изменяться
      mutableCells = [name_1, name_2, name_3, price_1, price_2, price_3];

      mutableCells.forEach(item => {
        // Событие клика

        item.addEventListener('dblclick', function tdClick() {
          let td = this;
          let input = document.createElement('input');
          input.value = td.innerText;
          td.appendChild(input);

          input.addEventListener('blur', function () {
            td.innerText = this.value;
          })

        })
      })

    });
    
    // Добавление таблицы в HTML
    tableContainer.appendChild(table);

    /* ============================================ */

    // Графика
    // Создаём с помощю d3.js
    let width = 800;
    let height = 500;

    // SVG area
    let svg = d3.select('#svg_container')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    // Горизонтальная шкала
    let xScaleDate = data.map((item) => new Date(item.date));

    let xScale = d3.scaleLinear()
                  .domain([0, xScaleDate.length -1])
                  .range([40, width - 20]);

    let xAxis = d3.axisBottom(d3.scaleTime()
                .domain([d3.min(xScaleDate), d3.max(xScaleDate)])
                .range([40, width - 20]))
                .tickFormat(d3.timeFormat("%b %Y"));


    svg.append('g')
      .style('transform', `translate(0, ${(height - 30)}px)`)
      .call(xAxis);

    
    let allPrices = [];   // Массив всех цен
    let allNames = [];   // Массив с именами компаний

    // Вывод всех цен в один массив
    data.forEach(item => {
      item.company.forEach(obj => {
        allPrices.push(obj.price)
        allNames.push(obj.name)
      })
    })
    
    // Фильтер имён компаний в единственном экземпляре
    let onlyCompanyName = allNames.filter((item, index) => allNames.indexOf(item) === index)

    let companiesButtonBlock = d3.select('#companies-button-block');    // Кнопки переключатели

    let companyNameIndex = 0;

    // Создаём кнопки переключатели между компаниями
    companiesButtonBlock.selectAll("span")
                        .data(onlyCompanyName)
                        .enter()
                        .append("span")
                        .text(item => item)
                        .attr('id', 0)
                        .on('click', (el, item) => {
                          companyNameIndex = onlyCompanyName.indexOf(item)
                          
                        })

                        console.log(companyNameIndex)

    // Один массив компаний из трёх
    let companies = [];   // Массив компаний со свойствами
    data.forEach(item => {
      companies.push(item.company[companyNameIndex])
    })
    
    // Вертикальная шкала
    let yScale = d3.scaleLinear()
                .domain([d3.max(allPrices), 0])
                .range([20, height - 30]);

    let yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .style('transform', 'translate(40px, 0)')
      .call(yAxis);


    // Линии
    let line = d3.line()
                .defined(item => !isNaN(item.price))
                .x((item, index) => xScale(index))
                .y(item => yScale(item.price))

      // Рисуем линии графика
      svg.append("path")
      .datum(companies)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

      // Рисуем точки графика
      svg.selectAll("circle")
      .data(companies)
      .enter()
      .append("circle")
      .attr("fill", "#538cb9")
      .attr('r', 3)
      .attr('cx', (item, index) => xScale(index))
      .attr('cy', item => yScale(item.price))

});