(function () {
  // ── Shared theme helpers ──────────────────────────────────────────────────

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  // Colors from design tokens — light/dark aware
  var PALETTE = {
    light: {
      text: '#201c15',
      textMuted: '#6b6353',
      textFaint: '#a49b86',
      bg: '#f6f3ec',
      surface: '#fbf9f3',
      divider: '#e2dccb',
      architecture: '#2f5069',
      compliance: '#566023',
      ethics: '#7c3430',
      labor: '#8a5a17',
      primary: '#233350',
      grid: 'rgba(32,28,21,0.08)',
    },
    dark: {
      text: '#eae4d3',
      textMuted: '#a89f89',
      textFaint: '#6f6852',
      bg: '#14130f',
      surface: '#191811',
      divider: '#2b291d',
      architecture: '#7ea3bd',
      compliance: '#a3af6c',
      ethics: '#c98b86',
      labor: '#d1a35b',
      primary: '#8fa3c2',
      grid: 'rgba(234,228,211,0.08)',
    },
  };

  // Chart.js multi-series color palette (themed)
  function seriesColors(theme) {
    var t = PALETTE[theme];
    return [t.architecture, t.compliance, t.ethics, t.labor, t.primary, t.textMuted];
  }

  function baseChartOptions(theme) {
    var t = PALETTE[theme];
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: t.textMuted,
            font: { family: "'Inter', sans-serif", size: 12 },
            boxWidth: 12,
          },
        },
        tooltip: {
          backgroundColor: t.surface,
          titleColor: t.text,
          bodyColor: t.textMuted,
          borderColor: t.divider,
          borderWidth: 1,
          titleFont: { family: "'Inter', sans-serif" },
          bodyFont: { family: "'Inter', sans-serif" },
        },
      },
      scales: {
        x: {
          ticks: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 11 } },
          grid: { color: t.grid },
        },
        y: {
          ticks: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 11 } },
          grid: { color: t.grid },
        },
      },
    };
  }

  // ── Chart injection helper ────────────────────────────────────────────────

  function injectChart(targetTable, renderFn) {
    var wrapper = document.createElement('div');
    wrapper.className = 'chart-wrapper';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    wrapper.appendChild(canvas);
    targetTable.parentNode.insertBefore(wrapper, targetTable);
    // Hide the table visually but keep it for accessibility/print
    targetTable.classList.add('chart-data-table');
    var chart = renderFn(canvas, getTheme());
    // Re-render on theme change
    var observer = new MutationObserver(function () {
      chart.destroy();
      chart = renderFn(canvas, getTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return chart;
  }

  // Find a table by matching its first header cell text (partial, case-insensitive)
  function findTableByHeader(headerText) {
    var tables = document.querySelectorAll('.article-body table');
    for (var i = 0; i < tables.length; i++) {
      var firstTh = tables[i].querySelector('th');
      if (firstTh && firstTh.textContent.trim().toLowerCase().indexOf(headerText.toLowerCase()) !== -1) {
        return tables[i];
      }
    }
    return null;
  }

  // ── Essay 07: Generational Digital Divide ────────────────────────────────

  function initDeepfakeCharts() {

    // Figure 1: Deepfake Growth — dual-axis line chart
    var fig1 = findTableByHeader('year');
    if (fig1 && fig1.querySelectorAll('tbody tr').length > 6) {
      // Only the first table with 'year' header and many rows is Figure 1
      // Verify by checking second column header contains 'deepfake'
      var ths = fig1.querySelectorAll('th');
      if (ths.length >= 2 && ths[1].textContent.toLowerCase().indexOf('deepfake') !== -1) {
        injectChart(fig1, function (canvas, theme) {
          var t = PALETTE[theme];
          var cols = seriesColors(theme);
          return new Chart(canvas, {
            type: 'line',
            data: {
              labels: ['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030'],
              datasets: [
                {
                  label: 'Deepfake Incidents (millions)',
                  data: [0.015, 0.06, 0.24, 0.96, 3.84, 7.68, 15.36, 30.72, 61.44, 122.88, 245.76, 491.52],
                  borderColor: cols[2],
                  backgroundColor: cols[2] + '22',
                  fill: true,
                  tension: 0.4,
                  yAxisID: 'yIncidents',
                  pointRadius: 3,
                },
                {
                  label: 'Detection Accuracy (%)',
                  data: [85, 82, 80, 78, 77, 76, 75, 75, 75, 75, 75, 75],
                  borderColor: cols[0],
                  backgroundColor: 'transparent',
                  tension: 0.3,
                  yAxisID: 'yAccuracy',
                  borderDash: [6, 3],
                  pointRadius: 3,
                },
              ],
            },
            options: Object.assign({}, baseChartOptions(theme), {
              scales: {
                x: baseChartOptions(theme).scales.x,
                yIncidents: {
                  type: 'logarithmic',
                  position: 'left',
                  title: { display: true, text: 'Incidents (millions, log scale)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } },
                  ticks: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 11 } },
                  grid: { color: t.grid },
                },
                yAccuracy: {
                  position: 'right',
                  min: 0, max: 100,
                  title: { display: true, text: 'Detection Accuracy (%)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } },
                  ticks: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 11 } },
                  grid: { display: false },
                },
              },
            }),
          });
        });
      }
    }

    // Figure 2: Vulnerability Matrix — grouped bar (awareness vs detection by generation)
    var fig2 = findTableByHeader('cohort');
    if (fig2) {
      injectChart(fig2, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Gen Z', 'Millennials', 'Gen X', 'Boomers'],
            datasets: [
              { label: 'Awareness (%)', data: [82, 75, 45, 29], backgroundColor: cols[0] + 'cc', borderColor: cols[0], borderWidth: 1 },
              { label: 'Detection Ability (%)', data: [45, 52, 38, 23], backgroundColor: cols[2] + 'cc', borderColor: cols[2], borderWidth: 1 },
            ],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            scales: {
              x: baseChartOptions(theme).scales.x,
              y: Object.assign({}, baseChartOptions(theme).scales.y, { min: 0, max: 100, title: { display: true, text: '%', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
            },
          }),
        });
      });
    }

    // Figure 3: Platform Abandonment Risk — grouped bar
    var fig3 = findTableByHeader('platform');
    if (fig3) {
      // Verify it has abandonment data (4 generation columns)
      var ths3 = fig3.querySelectorAll('th');
      if (ths3.length >= 5 && ths3[1].textContent.toLowerCase().indexOf('gen z') !== -1) {
        injectChart(fig3, function (canvas, theme) {
          var t = PALETTE[theme]; var cols = seriesColors(theme);
          return new Chart(canvas, {
            type: 'bar',
            data: {
              labels: ['Facebook', 'X/Twitter', 'LinkedIn', 'Instagram', 'TikTok', 'YouTube'],
              datasets: [
                { label: 'Gen Z', data: [68, 83, 5, 18, 0, 8], backgroundColor: cols[0] + 'cc', borderColor: cols[0], borderWidth: 1 },
                { label: 'Millennials', data: [15, 45, 10, 12, 5, 5], backgroundColor: cols[1] + 'cc', borderColor: cols[1], borderWidth: 1 },
                { label: 'Gen X', data: [20, 65, 5, 5, 0, 10], backgroundColor: cols[2] + 'cc', borderColor: cols[2], borderWidth: 1 },
                { label: 'Boomers+', data: [30, 95, 15, 0, 0, 25], backgroundColor: cols[3] + 'cc', borderColor: cols[3], borderWidth: 1 },
              ],
            },
            options: Object.assign({}, baseChartOptions(theme), {
              scales: {
                x: baseChartOptions(theme).scales.x,
                y: Object.assign({}, baseChartOptions(theme).scales.y, { min: 0, max: 100, title: { display: true, text: 'Abandonment Risk (%)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
              },
            }),
          });
        });
      }
    }

    // Figure 4: Financial Impact by Fraud Type — horizontal bar
    var fig4 = findTableByHeader('fraud type');
    if (fig4) {
      injectChart(fig4, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Business Email', 'Executive', 'Investment', 'Romance', 'Emergency', 'Employment'],
            datasets: [{
              label: 'Average Loss ($000s)',
              data: [680, 500, 120, 85, 45, 25],
              backgroundColor: [cols[2]+'cc', cols[2]+'aa', cols[0]+'cc', cols[3]+'cc', cols[3]+'aa', cols[1]+'cc'],
              borderColor: [cols[2], cols[2], cols[0], cols[3], cols[3], cols[1]],
              borderWidth: 1,
            }],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            indexAxis: 'y',
            plugins: Object.assign({}, baseChartOptions(theme).plugins, { legend: { display: false } }),
            scales: {
              y: baseChartOptions(theme).scales.x,
              x: Object.assign({}, baseChartOptions(theme).scales.y, { title: { display: true, text: 'Average Loss ($000s)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
            },
          }),
        });
      });
    }

    // Figure 5: Deepfake Content Prevalence — doughnut
    // Table first-header is "Platform"; second header contains "deepfake content prevalence"
    var fig5 = (function () {
      var tables = document.querySelectorAll('.article-body table');
      for (var i = 0; i < tables.length; i++) {
        var ths = tables[i].querySelectorAll('th');
        if (ths.length >= 2 &&
            ths[0].textContent.trim().toLowerCase() === 'platform' &&
            ths[1].textContent.trim().toLowerCase().indexOf('deepfake content prevalence') !== -1) {
          return tables[i];
        }
      }
      return null;
    }());
    if (fig5) {
      injectChart(fig5, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['Telegram', 'TikTok', 'X/Twitter', 'Facebook', 'Instagram', 'YouTube', 'LinkedIn'],
            datasets: [{
              data: [80, 35, 28, 22, 18, 15, 8],
              backgroundColor: [cols[2]+'ee', cols[0]+'ee', cols[3]+'ee', cols[1]+'ee', cols[4]+'ee', cols[2]+'99', cols[0]+'99'],
              borderColor: t.surface,
              borderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { position: 'right', labels: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 12 }, boxWidth: 12 } },
              tooltip: baseChartOptions(theme).plugins.tooltip,
            },
          },
        });
      });
    }

    // Figure 6: Global Generational Distribution — stacked bar
    var fig6 = findTableByHeader('region');
    if (fig6) {
      // Verify it has generation columns (not harm types)
      var ths6 = fig6.querySelectorAll('th');
      if (ths6.length >= 2 && ths6[1].textContent.toLowerCase().indexOf('gen z') !== -1 && ths6.length <= 5) {
        injectChart(fig6, function (canvas, theme) {
          var t = PALETTE[theme]; var cols = seriesColors(theme);
          return new Chart(canvas, {
            type: 'bar',
            data: {
              labels: ['Africa', 'Asia-Pacific', 'Europe', 'North America', 'South America'],
              datasets: [
                { label: 'Gen Z', data: [60, 25, 18, 21, 28], backgroundColor: cols[0] + 'cc', borderColor: cols[0], borderWidth: 1, stack: 'gen' },
                { label: 'Millennials', data: [25, 28, 22, 22, 26], backgroundColor: cols[1] + 'cc', borderColor: cols[1], borderWidth: 1, stack: 'gen' },
                { label: 'Gen X', data: [10, 23, 25, 19, 22], backgroundColor: cols[2] + 'cc', borderColor: cols[2], borderWidth: 1, stack: 'gen' },
                { label: 'Boomers+', data: [5, 24, 35, 38, 24], backgroundColor: cols[3] + 'cc', borderColor: cols[3], borderWidth: 1, stack: 'gen' },
              ],
            },
            options: Object.assign({}, baseChartOptions(theme), {
              scales: {
                x: baseChartOptions(theme).scales.x,
                y: Object.assign({}, baseChartOptions(theme).scales.y, { min: 0, max: 100, stacked: true, title: { display: true, text: '% of Population', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
              },
            }),
          });
        });
      }
    }

    // Figure 7: Platform Trust Erosion — multi-line
    var fig7 = findTableByHeader('year');
    if (fig7) {
      // Second 'year' table — verify it has 'facebook trust'
      var allYearTables = [];
      document.querySelectorAll('.article-body table').forEach(function(tbl) {
        var th = tbl.querySelector('th');
        if (th && th.textContent.trim().toLowerCase() === 'year') allYearTables.push(tbl);
      });
      var trustTable = allYearTables.length > 1 ? allYearTables[1] : null;
      if (trustTable) {
        injectChart(trustTable, function (canvas, theme) {
          var t = PALETTE[theme]; var cols = seriesColors(theme);
          var years = ['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030'];
          return new Chart(canvas, {
            type: 'line',
            data: {
              labels: years,
              datasets: [
                { label: 'Facebook', data: [72,68,65,60,55,48,42,35,30,25,22,20], borderColor: cols[0], backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
                { label: 'X/Twitter', data: [65,62,58,52,45,38,32,25,20,15,12,10], borderColor: cols[2], backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
                { label: 'TikTok', data: [78,76,74,72,70,68,65,62,58,55,52,50], borderColor: cols[3], backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
                { label: 'LinkedIn', data: [85,84,82,80,78,75,72,68,65,62,60,58], borderColor: cols[1], backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
              ],
            },
            options: Object.assign({}, baseChartOptions(theme), {
              scales: {
                x: baseChartOptions(theme).scales.x,
                y: Object.assign({}, baseChartOptions(theme).scales.y, { min: 0, max: 100, title: { display: true, text: 'Trust Score (%)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
              },
            }),
          });
        });
      }
    }

    // Figure 8: Verified Human Services Premium — multi-line
    var allYearTbls = [];
    document.querySelectorAll('.article-body table').forEach(function(tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === 'year') allYearTbls.push(tbl);
    });
    var fig8 = allYearTbls.length > 2 ? allYearTbls[2] : null;
    if (fig8) {
      injectChart(fig8, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'line',
          data: {
            labels: ['2024','2025','2026','2027','2028','2029','2030'],
            datasets: [
              { label: 'Dating Apps', data: [15,35,60,85,120,160,200], borderColor: cols[2], backgroundColor: cols[2]+'22', fill: true, tension: 0.4, pointRadius: 3 },
              { label: 'Executive Coaching', data: [10,25,45,70,95,125,160], borderColor: cols[0], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
              { label: 'Medical', data: [5,15,30,50,75,105,140], borderColor: cols[1], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
              { label: 'Education', data: [8,20,35,55,80,110,145], borderColor: cols[3], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
            ],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            scales: {
              x: baseChartOptions(theme).scales.x,
              y: Object.assign({}, baseChartOptions(theme).scales.y, { title: { display: true, text: 'Price Premium (%)', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
            },
          }),
        });
      });
    }

    // Figure 9: Harm Matrix (Female) — radar chart
    var fig9 = findTableByHeader('harm category');
    if (fig9) {
      injectChart(fig9, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'radar',
          data: {
            labels: ['Family Emergency','Health Misinfo','Financial','Body Image','Career','Sexual','Political','Romance'],
            datasets: [
              { label: 'Gen Z Female', data: [45,35,25,89,42,78,28,55], borderColor: cols[0], backgroundColor: cols[0]+'33', pointRadius: 3 },
              { label: 'Millennial Female', data: [62,58,48,76,55,82,45,68], borderColor: cols[1], backgroundColor: cols[1]+'33', pointRadius: 3 },
              { label: 'Gen X Female', data: [72,67,58,52,48,74,55,62], borderColor: cols[2], backgroundColor: cols[2]+'33', pointRadius: 3 },
              { label: 'Boomer Female', data: [84,62,68,35,28,68,72,45], borderColor: cols[3], backgroundColor: cols[3]+'33', pointRadius: 3 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              r: {
                min: 0, max: 100,
                ticks: { color: t.textFaint, backdropColor: 'transparent', font: { size: 10, family: "'Inter', sans-serif" }, stepSize: 25 },
                grid: { color: t.grid },
                angleLines: { color: t.divider },
                pointLabels: { color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } },
              },
            },
            plugins: {
              legend: { labels: { color: t.textMuted, font: { family: "'Inter', sans-serif", size: 12 }, boxWidth: 12 } },
              tooltip: baseChartOptions(theme).plugins.tooltip,
            },
          },
        });
      });
    }

    // Figure 10: Geographic Harmful Types — stacked horizontal bar
    var fig10 = findTableByHeader('region');
    // Find second region table (first is Figure 6 generational distribution)
    var regionTables = [];
    document.querySelectorAll('.article-body table').forEach(function(tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === 'region') regionTables.push(tbl);
    });
    var harmGeoTable = regionTables.length > 1 ? regionTables[1] : null;
    if (harmGeoTable) {
      injectChart(harmGeoTable, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['North America', 'Europe', 'Asia-Pacific', 'Africa', 'Latin America'],
            datasets: [
              { label: 'Financial', data: [42,28,35,22,38], backgroundColor: cols[0]+'cc', borderColor: cols[0], borderWidth: 1, stack: 's' },
              { label: 'Political', data: [32,38,25,18,28], backgroundColor: cols[1]+'cc', borderColor: cols[1], borderWidth: 1, stack: 's' },
              { label: 'Romance', data: [25,22,45,35,32], backgroundColor: cols[3]+'cc', borderColor: cols[3], borderWidth: 1, stack: 's' },
              { label: 'Health', data: [18,25,28,51,35], backgroundColor: cols[2]+'cc', borderColor: cols[2], borderWidth: 1, stack: 's' },
              { label: 'Extortion', data: [12,8,15,25,48], backgroundColor: cols[4]+'cc', borderColor: cols[4], borderWidth: 1, stack: 's' },
            ],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            indexAxis: 'y',
            scales: {
              y: baseChartOptions(theme).scales.x,
              x: Object.assign({}, baseChartOptions(theme).scales.y, { stacked: true, title: { display: true, text: '% of Deepfakes', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
            },
          }),
        });
      });
    }

    // Figure 11: Comprehensive Vulnerability Matrix — heatmap via bar chart
    var fig11 = findTableByHeader('region');
    var regionTbls3 = [];
    document.querySelectorAll('.article-body table').forEach(function(tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === 'region') regionTbls3.push(tbl);
    });
    var vulnMatrix = regionTbls3.length > 2 ? regionTbls3[2] : null;
    if (vulnMatrix) {
      injectChart(vulnMatrix, function (canvas, theme) {
        var t = PALETTE[theme]; var cols = seriesColors(theme);
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['North America', 'Europe', 'Asia-Pacific', 'Africa', 'Latin America'],
            datasets: [
              { label: 'Gen Z F', data: [45,42,48,35,38], backgroundColor: cols[0]+'88', borderColor: cols[0], borderWidth: 1 },
              { label: 'Gen Z M', data: [65,58,62,48,55], backgroundColor: cols[0]+'cc', borderColor: cols[0], borderWidth: 1 },
              { label: 'Millennial F', data: [62,45,52,42,48], backgroundColor: cols[1]+'88', borderColor: cols[1], borderWidth: 1 },
              { label: 'Millennial M', data: [48,68,75,58,65], backgroundColor: cols[1]+'cc', borderColor: cols[1], borderWidth: 1 },
              { label: 'Gen X F', data: [58,55,62,52,55], backgroundColor: cols[2]+'88', borderColor: cols[2], borderWidth: 1 },
              { label: 'Gen X M', data: [78,72,82,68,75], backgroundColor: cols[2]+'cc', borderColor: cols[2], borderWidth: 1 },
              { label: 'Boomer F', data: [68,65,72,62,65], backgroundColor: cols[3]+'88', borderColor: cols[3], borderWidth: 1 },
              { label: 'Boomer M', data: [82,78,85,75,80], backgroundColor: cols[3]+'cc', borderColor: cols[3], borderWidth: 1 },
            ],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            scales: {
              x: baseChartOptions(theme).scales.x,
              y: Object.assign({}, baseChartOptions(theme).scales.y, { min: 0, max: 100, title: { display: true, text: 'Vulnerability Score', color: t.textMuted, font: { size: 11, family: "'Inter', sans-serif" } } }),
            },
          }),
        });
      });
    }

  } // end initDeepfakeCharts

  // ── Essay 01: Constraint-Native Architecture Principles ───────────────────

  function initPrinciplesCards() {
    // Find the principles table: first header is "Principle"
    var table = null;
    document.querySelectorAll('.article-body table').forEach(function(tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === 'principle') table = tbl;
    });
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    var grid = document.createElement('div');
    grid.className = 'visual-card-grid';
    grid.setAttribute('role', 'list');

    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells.length < 3) return;
      var card = document.createElement('div');
      card.className = 'visual-card';
      card.setAttribute('role', 'listitem');

      // Strip inline links from example text — keep readable text only
      var exampleEl = cells[2].cloneNode(true);
      exampleEl.querySelectorAll('a').forEach(function(a) {
        var txt = document.createTextNode(a.textContent);
        a.parentNode.replaceChild(txt, a);
      });

      // Build card via safe DOM methods — all values sourced from textContent (plain text)
      var titleEl = document.createElement('div');
      titleEl.className = 'visual-card__title';
      titleEl.textContent = cells[0].textContent.trim();

      var subtitleEl = document.createElement('div');
      subtitleEl.className = 'visual-card__subtitle';
      subtitleEl.textContent = cells[1].textContent.trim();

      var bodyEl = document.createElement('div');
      bodyEl.className = 'visual-card__body';
      bodyEl.textContent = exampleEl.textContent.trim();

      card.appendChild(titleEl);
      card.appendChild(subtitleEl);
      card.appendChild(bodyEl);

      grid.appendChild(card);
    });

    table.parentNode.insertBefore(grid, table);
    table.style.display = 'none';
  }

  // ── Essay 04: Risk Taxonomy ───────────────────────────────────────────────

  function initRiskCards() {
    // Find the risk taxonomy table: first header is "Risk category"
    var table = null;
    document.querySelectorAll('.article-body table').forEach(function(tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === 'risk category') table = tbl;
    });
    if (!table) return;

    // Category colors mapped to risk types
    var riskColors = {
      'data sharing': 'var(--color-architecture)',
      'automated decisions': 'var(--color-compliance)',
      'dark patterns': 'var(--color-ethics)',
      'retention': 'var(--color-labor)',
      'user rights': 'var(--color-architecture)',
      'minors': 'var(--color-ethics)',
      'sensitive data': 'var(--color-compliance)',
      'unilateral changes': 'var(--color-labor)',
      'liability': 'var(--color-ethics)',
    };

    var rows = table.querySelectorAll('tbody tr');
    var grid = document.createElement('div');
    grid.className = 'visual-card-grid';
    grid.setAttribute('role', 'list');

    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells.length < 2) return;

      var categoryText = cells[0].textContent.trim();
      var questionText = cells[1].textContent.trim();
      var color = riskColors[categoryText.toLowerCase()] || 'var(--color-primary)';

      var card = document.createElement('div');
      card.className = 'visual-card';
      card.setAttribute('role', 'listitem');
      card.style.borderLeftColor = color;

      // Build card via safe DOM methods — all values sourced from textContent (plain text)
      var titleEl = document.createElement('div');
      titleEl.className = 'visual-card__title';
      titleEl.style.color = color;
      titleEl.textContent = categoryText;

      var bodyEl = document.createElement('div');
      bodyEl.className = 'visual-card__body';
      bodyEl.textContent = questionText;

      card.appendChild(titleEl);
      card.appendChild(bodyEl);

      grid.appendChild(card);
    });

    table.parentNode.insertBefore(grid, table);
    table.style.display = 'none';
  }


  // ── Essay 08a: When the Truth Becomes Fiction, Part I ─────────────────────

  function initSchildhornCharts() {
    // Figure: known-AI complaints against the annual total
    var tables = document.querySelectorAll('.article-body table');
    var fig1 = null, fig2 = null, ledger = null;
    for (var i = 0; i < tables.length; i++) {
      var th = tables[i].querySelector('th');
      if (!th) continue;
      var key = th.textContent.trim().toLowerCase();
      if (key === 'complaint category') fig1 = tables[i];
      else if (key === 'assessment year') fig2 = tables[i];
      else if (key === 'provenance') ledger = tables[i];
    }

    if (fig1) {
      injectChart(fig1, function (canvas, theme) {
        var t = PALETTE[theme];
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Known AI involvement', 'No AI identified'],
            datasets: [{
              label: 'Complaints filed, 2025',
              data: [22364, 977636],
              backgroundColor: [t.ethics, t.divider],
              borderColor: [t.ethics, t.textFaint],
              borderWidth: 1,
            }],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            indexAxis: 'y',
            plugins: Object.assign({}, baseChartOptions(theme).plugins, { legend: { display: false } }),
            scales: {
              x: { ticks: { color: t.textMuted }, grid: { color: t.grid } },
              y: { ticks: { color: t.textMuted }, grid: { display: false } },
            },
          }),
        });
      });
    }

    if (fig2) {
      injectChart(fig2, function (canvas, theme) {
        var t = PALETTE[theme];
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['2023 assessment', '2025 assessment'],
            datasets: [
              { label: 'Low estimate', data: [18, 88.3], backgroundColor: t.compliance },
              { label: 'High estimate', data: [37, 114.1], backgroundColor: t.ethics },
            ],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            scales: {
              x: { ticks: { color: t.textMuted }, grid: { display: false } },
              y: {
                beginAtZero: true,
                ticks: { color: t.textMuted, callback: function (v) { return '$' + v + 'B'; } },
                grid: { color: t.grid },
              },
            },
          }),
        });
      });
    }

    if (ledger) {
      var rows = ledger.querySelectorAll('tbody tr');
      var grid = document.createElement('div');
      grid.className = 'visual-card-grid';
      grid.setAttribute('role', 'list');

      rows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length < 3) return;
        var disposition = cells[1].textContent.trim().toLowerCase();
        var color = disposition === 'kept' ? 'var(--color-compliance)' : 'var(--color-ethics)';

        var card = document.createElement('div');
        card.className = 'visual-card';
        card.setAttribute('role', 'listitem');
        card.style.borderLeftColor = color;

        var titleEl = document.createElement('div');
        titleEl.className = 'visual-card__title';
        titleEl.style.color = color;
        titleEl.textContent = cells[0].textContent.trim();

        var subtitleEl = document.createElement('div');
        subtitleEl.className = 'visual-card__subtitle';
        subtitleEl.textContent = cells[1].textContent.trim();

        var bodyEl = document.createElement('div');
        bodyEl.className = 'visual-card__body';
        bodyEl.textContent = cells[2].textContent.trim();

        card.appendChild(titleEl);
        card.appendChild(subtitleEl);
        card.appendChild(bodyEl);
        grid.appendChild(card);
      });

      ledger.parentNode.insertBefore(grid, ledger);
      ledger.style.display = 'none';
    }
  }


  // ── Generic table-to-card-grid helper ────────────────────────────────────
  // cols: [titleIndex, subtitleIndex or -1, bodyIndex]; colorBy maps the text
  // of a chosen column onto a category token.
  function cardsFromTable(table, cols, colorBy) {
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr');
    var grid = document.createElement('div');
    grid.className = 'visual-card-grid';
    grid.setAttribute('role', 'list');

    rows.forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (!cells.length) return;

      function text(i) {
        return i >= 0 && cells[i] ? cells[i].textContent.trim() : '';
      }

      var color = colorBy ? colorBy(text(colorBy.column)) : 'var(--color-primary)';

      var card = document.createElement('div');
      card.className = 'visual-card';
      card.setAttribute('role', 'listitem');
      card.style.borderLeftColor = color;

      var titleEl = document.createElement('div');
      titleEl.className = 'visual-card__title';
      titleEl.style.color = color;
      titleEl.textContent = text(cols[0]);
      card.appendChild(titleEl);

      if (cols[1] >= 0) {
        var subEl = document.createElement('div');
        subEl.className = 'visual-card__subtitle';
        subEl.textContent = text(cols[1]);
        card.appendChild(subEl);
      }

      var bodyEl = document.createElement('div');
      bodyEl.className = 'visual-card__body';
      bodyEl.textContent = text(cols[2]);
      card.appendChild(bodyEl);

      grid.appendChild(card);
    });

    table.parentNode.insertBefore(grid, table);
    table.style.display = 'none';
  }

  function tableByHeader(exact) {
    var found = null;
    document.querySelectorAll('.article-body table').forEach(function (tbl) {
      var th = tbl.querySelector('th');
      if (th && th.textContent.trim().toLowerCase() === exact) found = tbl;
    });
    return found;
  }

  // ── Essay 08b: When the Truth Becomes Fiction, Part II ────────────────────

  function initVerificationCharts() {
    var revocable = function (v) {
      return v.toLowerCase() === 'yes' ? 'var(--color-compliance)' : 'var(--color-ethics)';
    };
    revocable.column = 1;
    cardsFromTable(tableByHeader('credential'), [0, 1, 2], revocable);

    var records = function () { return 'var(--color-architecture)'; };
    records.column = 0;
    cardsFromTable(tableByHeader('public record'), [0, 1, 2], records);

    var detectors = tableByHeader('detector result');
    if (detectors) {
      injectChart(detectors, function (canvas, theme) {
        var t = PALETTE[theme];
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Native writers', 'Non-native, average', 'Non-native, any detector'],
            datasets: [{
              label: 'Human-written essays falsely flagged (%)',
              data: [0, 61.3, 97.8],
              backgroundColor: [t.divider, t.ethics, t.ethics],
              borderColor: [t.textFaint, t.ethics, t.ethics],
              borderWidth: 1,
            }],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            plugins: Object.assign({}, baseChartOptions(theme).plugins, { legend: { display: false } }),
            scales: {
              x: { ticks: { color: t.textMuted }, grid: { display: false } },
              y: {
                beginAtZero: true, max: 100,
                ticks: { color: t.textMuted, callback: function (v) { return v + '%'; } },
                grid: { color: t.grid },
              },
            },
          }),
        });
      });
    }

    var estimates = tableByHeader('estimate source');
    if (estimates) {
      injectChart(estimates, function (canvas, theme) {
        var t = PALETTE[theme];
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Vendor chief executive', 'Labor Dept Inspector General'],
            datasets: [{
              label: 'Pandemic unemployment fraud, stated',
              data: [400, 45.7],
              backgroundColor: [t.ethics, t.compliance],
            }],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            indexAxis: 'y',
            plugins: Object.assign({}, baseChartOptions(theme).plugins, { legend: { display: false } }),
            scales: {
              x: {
                beginAtZero: true,
                ticks: { color: t.textMuted, callback: function (v) { return '$' + v + 'B'; } },
                grid: { color: t.grid },
              },
              y: { ticks: { color: t.textMuted }, grid: { display: false } },
            },
          }),
        });
      });
    }
  }

  // ── Essay 08c: When the Truth Becomes Fiction, Part III ───────────────────

  function initDocketCharts() {
    var outcome = function (v) {
      var k = v.toLowerCase();
      if (k === 'succeeded') return 'var(--color-labor)';
      if (k === 'backfired' || k === 'excluded') return 'var(--color-architecture)';
      return 'var(--color-ethics)';
    };
    outcome.column = 1;
    cardsFromTable(tableByHeader('case'), [0, 1, 2], outcome);

    var reach = function (v) {
      return v.toLowerCase() === 'yes' ? 'var(--color-compliance)' : 'var(--color-ethics)';
    };
    reach.column = 1;
    cardsFromTable(tableByHeader('rule 707'), [0, 1, 2], reach);

    var denial = tableByHeader('denial target');
    if (denial) {
      injectChart(denial, function (canvas, theme) {
        var t = PALETTE[theme];
        return new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Text, claiming uncertainty', 'Text, rallying supporters', 'Video evidence'],
            datasets: [{
              label: 'Effect size (SD)',
              data: [0.17, 0.21, 0],
              backgroundColor: [t.ethics, t.ethics, t.divider],
              borderColor: [t.ethics, t.ethics, t.textFaint],
              borderWidth: 1,
            }],
          },
          options: Object.assign({}, baseChartOptions(theme), {
            plugins: Object.assign({}, baseChartOptions(theme).plugins, { legend: { display: false } }),
            scales: {
              x: { ticks: { color: t.textMuted }, grid: { display: false } },
              y: {
                beginAtZero: true, max: 0.3,
                ticks: { color: t.textMuted, stepSize: 0.1 },
                grid: { color: t.grid },
              },
            },
          }),
        });
      });
    }
  }

  // ── Wire up new essay handlers in the init() function ────────────────────



  // ── Run on DOMContentLoaded ───────────────────────────────────────────────

  function init() {
    var body = document.querySelector('[data-essay]');
    if (!body) return;
    var slug = body.getAttribute('data-essay');
    if (slug === 'generational-digital-divide') {
      initDeepfakeCharts();
    } else if (slug === 'built-in-not-bolted-on') {
      initPrinciplesCards();
    } else if (slug === 'compliance-by-construction') {
      initRiskCards();
    } else if (slug === 'the-call-that-sounded-like-his-son') {
      initSchildhornCharts();
    } else if (slug === 'the-selfies-that-did-not-match') {
      initVerificationCharts();
    } else if (slug === 'nobody-has-won-with-it-yet') {
      initDocketCharts();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
