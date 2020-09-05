$('#periodo').change(function() {

    var periodo = $(this).val();
    if (periodo == 0) txtPeriodo = 'na última hora';
    else if (periodo == 1) txtPeriodo = 'nas últimas 24 horas';
    else txtPeriodo = 'nos últimos ' + periodo + ' dias';
    $('#span-periodo').text(txtPeriodo);

    /* cards de situacao atualizada */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: { classe: "denuncia", metodo: "contarSituacao", token: token, periodo: periodo },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataSituacao) {
                    registradas = 0;
                    avaliadas = 0;
                    encaminhadas = 0;
                    averiguando = 0;
                    finalizadas = 0;
                    arquivadas = 0;
                    atualizadas = 0;
                    $.each(result.dataSituacao, function(i, vet) {
                        if (vet.situacao == 'REGISTRADA' || vet.situacao == 'DISTRIBUIDA') registradas += parseInt(vet.qtd);
                        if (vet.situacao == 'AVALIADA') avaliadas += parseInt(vet.qtd);
                        if (vet.situacao == 'ENCAMINHADA') encaminhadas += parseInt(vet.qtd);
                        if (vet.situacao == 'RECEBIDA' || vet.situacao == 'AVERIGUANDO' || vet.situacao == 'ANALISANDO') averiguando += parseInt(vet.qtd);
                        if (vet.situacao == 'FINALIZADA') finalizadas += parseInt(vet.qtd);
                        if (vet.situacao.indexOf('ARQUIVADA') == 0) arquivadas += parseInt(vet.qtd);
                        atualizadas += parseInt(vet.qtd);
                    });

                    $('#atualizadas').text(atualizadas);
                    $('#registradas').text(registradas);
                    $('#per-registradas').text(parseInt(100 * registradas / atualizadas));
                    $('#avaliadas').text(avaliadas);
                    $('#per-avaliadas').text(parseInt(100 * avaliadas / atualizadas));
                    $('#encaminhadas').text(encaminhadas);
                    $('#per-encaminhadas').text(parseInt(100 * encaminhadas / atualizadas));
                    $('#averiguando').text(averiguando);
                    $('#per-averiguando').text(parseInt(100 * averiguando / atualizadas));
                    $('#finalizadas').text(finalizadas);
                    $('#per-finalizadas').text(parseInt(100 * finalizadas / atualizadas));
                    $('#arquivadas').text(arquivadas);
                    $('#per-arquivadas').text(parseInt(100 * arquivadas / atualizadas));
                }
            }
        }
    });

    /* charts registradas */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: { classe: "denuncia", metodo: "contarRegistradas", token: token, periodo: periodo },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataRegistradas) {
                    diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
                    meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                    chartRegistradas.data.labels = [];
                    chartRegistradas.data.datasets[0].data = [];
                    $.each(result.dataRegistradas, function(i, vet) {
                        if (result.periodo == 365) chartRegistradas.data.labels.push(meses[parseInt(vet.tempo) - 1]);
                        else if (result.periodo == 7) chartRegistradas.data.labels.push(diasDaSemana[parseInt(vet.tempo) - 1]);
                        else chartRegistradas.data.labels.push(vet.tempo);

                        chartRegistradas.data.datasets[0].data.push(parseInt(vet.qtd));
                    });

                    chartRegistradas.options.title.text = 'Registradas ' + $('#span-periodo').text();
                    chartRegistradas.update();
                }
            }
        }
    });

    /* charts origem */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: { classe: "denuncia", metodo: "contarOrigemRegistradas", token: token, periodo: periodo },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataOrigem) {
                    chartOrigem.data.labels = [];
                    chartOrigem.data.datasets[0].data = [];
                    $.each(result.dataOrigem, function(i, vet) {
                        chartOrigem.data.labels.push(vet.origem);
                        chartOrigem.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartOrigem.update();
                }
            }
        }
    });

    /* charts natureza */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: { classe: "denuncia", metodo: "contar10NaturezasMaisRegistradas", token: token, periodo: periodo },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataNatureza) {
                    chartNatureza.data.labels = [];
                    chartNatureza.data.datasets[0].data = [];
                    $.each(result.dataNatureza, function(i, vet) {
                        chartNatureza.data.labels.push(vet.natureza);
                        chartNatureza.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartNatureza.update();
                }
            }
        }
    });

    /* charts cidade */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: { classe: "denuncia", metodo: "contar10CidadesMaisRegistradas", token: token, periodo: periodo },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataCidade) {
                    chartCidade.data.labels = [];
                    chartCidade.data.datasets[0].data = [];
                    $.each(result.dataCidade, function(i, vet) {
                        chartCidade.data.labels.push(vet.cidade);
                        chartCidade.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartCidade.update();
                }
            }
        }
    });

    /* charts finalizadas PM */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: {
            classe: "denuncia",
            metodo: "contarFinalizadasPorOrgao",
            token: token,
            periodo: periodo,
            instituicao: 'PMPA',
        },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataOrgao) {
                    chartFinalizadasPM.data.labels = [];
                    chartFinalizadasPM.data.datasets[0].data = [];
                    $.each(result.dataOrgao, function(i, vet) {
                        chartFinalizadasPM.data.labels.push(vet.orgao);
                        chartFinalizadasPM.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartFinalizadasPM.update();
                }
            }
        }
    });

    /* charts finalizadas PC */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: {
            classe: "denuncia",
            metodo: "contarFinalizadasPorOrgao",
            token: token,
            periodo: periodo,
            instituicao: 'PCPA',
        },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataOrgao) {
                    chartFinalizadasPC.data.labels = [];
                    chartFinalizadasPC.data.datasets[0].data = [];
                    $.each(result.dataOrgao, function(i, vet) {
                        chartFinalizadasPC.data.labels.push(vet.orgao);
                        chartFinalizadasPC.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartFinalizadasPC.update();
                }
            }
        }
    });


    /* charts finalizadas crescente PM */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: {
            classe: "denuncia",
            metodo: "contarFinalizadasPorOrgaoCrescente",
            token: token,
            periodo: periodo,
            instituicao: 'PMPA',
        },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataOrgao) {
                    chartFinalizadasCrescentePM.data.labels = [];
                    chartFinalizadasCrescentePM.data.datasets[0].data = [];
                    $.each(result.dataOrgao, function(i, vet) {
                        chartFinalizadasCrescentePM.data.labels.push(vet.orgao);
                        chartFinalizadasCrescentePM.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartFinalizadasCrescentePM.update();
                }
            }
        }
    });

    /* charts finalizadas PC */
    $.ajax({
        type: 'POST',
        url: url + 'api.php',
        data: {
            classe: "denuncia",
            metodo: "contarFinalizadasPorOrgaoCrescente",
            token: token,
            periodo: periodo,
            instituicao: 'PCPA',
        },
        success: function(result) {
            if (result.error) {
                console.log(result.error);
            } else {
                if (result.dataOrgao) {
                    chartFinalizadasCrescentePC.data.labels = [];
                    chartFinalizadasCrescentePC.data.datasets[0].data = [];
                    $.each(result.dataOrgao, function(i, vet) {
                        chartFinalizadasCrescentePC.data.labels.push(vet.orgao);
                        chartFinalizadasCrescentePC.data.datasets[0].data.push(parseInt(vet.qtd));
                    });
                    chartFinalizadasCrescentePC.update();
                }
            }
        }
    });


});

var chartColors = {
    red: 'rgba(255, 99, 132, 0.2)',
    blue: 'rgba(54, 162, 235, 0.2)',
    yellow: 'rgba(255, 206, 86, 0.2)',
    green: 'rgba(75, 192, 192, 0.2)',
    purple: 'rgba(153, 102, 255, 0.2)',
    orange: 'rgba(255, 159, 64, 0.2)'
};

var chartRegistradas = new Chart($('#chart-registradas'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: chartColors.blue,
            borderColor: chartColors.blue,
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Registradas'
        },
        legend: {
            display: false,
            position: 'bottom',
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Registro'
                }
            }]
        },
    }
});

var chartOrigem = new Chart($('#chart-origem-registrada'), {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [chartColors.red, chartColors.blue, chartColors.yellow, chartColors.purple, chartColors.orange],
            borderColor: [chartColors.red, chartColors.blue, chartColors.yellow, chartColors.purple, chartColors.orange]
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Origem dos registros'
        },
        legend: { position: 'right' },
    }
});

var chartNatureza = new Chart($('#chart-natureza-registrada'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Registradas',
            data: [],
            backgroundColor: chartColors.purple,
            borderColor: chartColors.purple,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'As 10 naturezas mais registradas'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var chartCidade = new Chart($('#chart-cidade-registrada'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Registradas',
            data: [],
            backgroundColor: chartColors.green,
            borderColor: chartColors.green,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'As 10 cidades mais registradas'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var chartFinalizadasPM = new Chart($('#chart-finalizadas-pm'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Finalizadas',
            data: [],
            backgroundColor: chartColors.blue,
            borderColor: chartColors.red,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Denúncias finalizadas pela PMPA'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var chartFinalizadasPC = new Chart($('#chart-finalizadas-pc'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Finalizadas',
            data: [],
            backgroundColor: chartColors.red,
            borderColor: chartColors.blue,
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            text: 'Denúncias finalizadas pela PCPA'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var chartFinalizadasCrescentePM = new Chart($('#chart-finalizadas-crescente-pm'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Finalizadas',
            data: [],
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            fontColor: '#000',
            text: 'ORGÃOS QUE MENOS FINALIZAM PMPA'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

var chartFinalizadasCrescentePC = new Chart($('#chart-finalizadas-crescente-pc'), {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Finalizadas',
            data: [],
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            fontSize: 16,
            fontFamily: 'Arial',
            fontColor: '#000',
            text: 'ORGÃOS QUE MENOS FINALIZAM PCPA'
        },
        elements: {
            rectangle: {
                borderWidth: 2,
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Período'
                }
            }],
        }
    }
});

$('#periodo').change();

loop = setInterval(function() { $('#periodo').change(); }, 60000);