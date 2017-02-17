
$(function () {
    function View(ctx){
        this.context = ctx;
        this.errorElement = $(".not-verified-popout");
        this.element =  $("#sal_net");
    }
    View.prototype.context = null;
    View.prototype.setActions = function(){
        var _this = this;
        $('#buton').on('click', function(){
            _this.context.submitFormAction(_this.element.val());
        });
        this.element.keypress(function (e) {
            if (e.which === 13) {
                _this.context.submitFormAction(_this.element.val());
            }
        });
        $("#to-top").click(function(){
            $("body").animate({"scrollTop":"0"},1000);
        });
        $('.close-button').click(function(){
            _this.resetError();
        });

        $(window).on("scroll", function(){
           if(($(window).scrollTop() + $(window).height() > $(document).height() - 100)){
               if(!$("#to-top").hasClass("bottom")){
                   $("#to-top").addClass("bottom");
               }
           } else {
               if($("#to-top").hasClass("bottom")){
                   $("#to-top").removeClass("bottom");
               }
           }
        });
    };
    View.prototype.showError = function(msg){
        $('body').addClass('not-verified');
        this.errorElement.find(".msg").text(msg);
        this.errorElement.show();
    };
    View.prototype.resetError = function(msg){
        $('body').removeClass('not-verified');
        this.errorElement.find(".msg").text("");
        this.errorElement.hide();
    };

    View.prototype.displayCharts = function(results){
        this.initCharts(results);
        this.setLabels(results);

        $('body').addClass('loaded');
        $('html,body').animate({
            scrollTop: $(".details").offset().top
        }, 1000);
    };

    View.prototype.setLabels = function(results) {
        var statContrib = parseInt(results.pensiiStat + results.sanatate + results.impozitVenit + results.alteTaxe);
        var total = statContrib + results.netIncome;
        var valoareRamasa = parseInt(results.valoareRamasa);
        var statTotal = parseInt(results.contributieStat + results.tva);
        $("#sorin_number").text(valoareRamasa);
        $("#stat_number").text(statTotal);
        $("#total_number").text(parseInt(results.valoareCreata));
    };

    View.prototype.initEmployeeChart = function(dataSet){
        var colors = {
            "pensii":"#F1A094",
            "sanatate":"#A58C98",
            "impozit":"#E57373",
            "alteSalariu":"#8DA8B1",
            "casamasina":"#7DCBD4",
            "tva":"#CBD5D1",
            "rest":"#09b998",
            "vicii":"#A2A9B0",
            "alte":"#CBD5D1",
        };
        chartOptions2 = {
            chart: {
                renderTo: 'container_2',
                backgroundColor: '#f7f8fa',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            legend: {
                align: 'center',
                itemWidth:140
            },
            exporting: { enabled: false },
            title: {
                text: 'Cum se distribuie valoarea pe care ai generat-o',
                style: {"fontSize": "38px"}
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} RON)'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'Placinte',
                data: [
                    {name: "Pensii de stat",y:dataSet.pensiiStat, color:colors.pensii, drilldown:"pensiiSplit"},
                    {name: "Sănătate",y:dataSet.sanatate, color:colors.sanatate, drilldown:"sanatateSplit"},
                    {name: "Impozit pe venit",y:dataSet.impozitVenit, color:colors.impozit},
                    {name: "Alte taxe salariu",y:dataSet.alteTaxe, color:colors.alteSalariu, drilldown:"alteSplit"},
                    {name: "Valoare rămasă", y:dataSet.valoareRamasa, color:colors.rest, dataLabels: { enabled:true, formatter: function() { return "Atât rămâne la tine"; }}},
                    {name: "TVA", y:dataSet.tva, color:colors.tva}
                ]
            }],

            drilldown: {
                series: [
                    {
                        id:"pensiiSplit",
                        data:[
                            {name: "Angajat",y:dataSet.pensiiStatAngajat},
                            {name: "Angajator",y:dataSet.pensiiStatAngajator},
                        ]
                    },
                    {
                        id:"sanatateSplit",
                        data: [
                            {name: "Angajat",y:dataSet.sanatateAngajat},
                            {name: "Angajator",y:dataSet.sanatateAngajator},
                        ]
                    },
                    {
                        id:"alteSplit",
                        data: [
                            {name: "Angajat",y:dataSet.alteTaxeAngajat},
                            {name: "Angajator",y:dataSet.alteTaxeAngajator},
                        ]
                    }
                ]
            }
        };

        chart2 = new Highcharts.Chart(chartOptions2);
        chart2.redraw();

    };

    View.prototype.initBudgetChart = function(){
        var chart_bugete_options = {
            chart: {
                renderTo: "tabel_buget_container",
                backgroundColor: '#f7f8fa',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            exporting: { enabled: false },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '<b>{point.y} milioane'
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text:null
                }
            },

            series: [
                {
                    data: [
                        {name: "Populație",y:173.158, color:"#A07178",drilldown:"populatie"},
                        {name: "Firme",y:22.923, color:"#F3C178",drilldown:"firme"},
                        {name: "Alte Surse",y:27.614, color:"#FE5E41",drilldown:"altele"}
                    ]
                }
            ],

            drilldown: {
                series: [
                    {
                        id:"populatie",
                        data: [
                            {name:"Impozitul pe salarii și venit",y: 27756.40, color:"#05A8AA"},
                            {name:"TVA",y:51675.10, color:"#B8D5B8"},
                            {name:"Accize",y:26957, color:"#D7B49E"},
                            {name:"Alte impozite și taxe pe bunuri și servicii",y:2250.30, color:"#BC412B"},
                            {name:"Taxa pe utilizarea bunurilor",y:3244.60, color:"#DDB967"},
                            {name:"Contribuții de asigurări",y:61274.40, color:"#D0E37F"}
                        ]
                    },
                    {
                        id:"firme",
                        data: [
                            {name:"Impozitul pe profit",y:15442,color:"#628395"},
                            {name:"Alte impozite pe venit, profit și câștiguri din capital",y:1583.30,color:"#96897B"},
                            {name:"Impozite și taxe pe proprietate",y:5898.10,color:"#FADF7F"}
                        ]
                    },
                    {
                        id:"altele",
                        data: [
                            {name:"Impozitul pe comerțul exterior și tranzacțiile internaționale (taxe vamale)",y:882.7,color:"#A20021"},
                            {name:"Alte impozite și taxe fiscale",y:716.7,color:"#F79D5C"},
                            {name:"Venituri nefiscale",y:17938.30,color:"#009B72"},
                            {name:"Venituri din capital",y:769.4,color:"#B6C649"},
                            {name:"Donații",y:1.6,color:"#2C4251"},
                            {name:"Sume primite de la UE în contul plăților efectuate și prefinanțare",y:949.9,color:"#C1C1C1"},
                            {name:"Sume încasate în contul unic (bugetul de stat)",y:472.7,color:"#70A288"},
                            {name:"Alte sume primite de la UE pentru programele operaționale finanțate în cadrul obiectivului convergență",y:0,color:"#04395E"},
                            {name:"Sume primite de la UE/alți donatori în contul plăților efectuate și prefinanțări aferente cadrului financiar 2014-2020",y:5909.6,color:"#DAB785"}
                        ]
                    }
                ]
            }

        };

        var chart_bugete = new Highcharts.Chart(chart_bugete_options);
        chart_bugete.redraw();
    };

    View.prototype.initCharts = function (dataSet){
        Highcharts.setOptions({
            lang: {
                drillUpText: "◁ Înapoi"
            }
        });
        this.initEmployeeChart(dataSet);
        this.initBudgetChart();
    };

    View.prototype.initTopButton = function(){
        var fixed = false;
        $(document).scroll(function () {
            if ($(this).scrollTop() > 250) {
                if (!fixed) {
                    fixed = true;
                    $('#to-top').show("slow", function () {
                        $('#to-top').css({
                            position: 'fixed',
                            display: 'block'
                        });
                    });
                }
            } else {
                if (fixed) {
                    fixed = false;
                    $('#to-top').hide("slow", function () {
                        $('#to-top').css({
                            display: 'none'
                        });
                    });
                }
            }
        });
    };



    function Validator(){}
    Validator.prototype.error = null;
    Validator.prototype.validate = function(input){
        var value = input.trim();
        this.error = null;
        if(typeof value === "undefine" || value === null || value === ""){
            this.error = Validator.msg.empty;
        } else if(isNaN(value)){
            this.error = Validator.msg.numbersOnly;
        } else if(parseInt(value, 10) < Validator.minimumWage){
            this.error = Validator.msg.minValue;
        }
        return this.error === null;
    };
    Validator.prototype.getMessage = function(input){
        return this.error;
    };
    Validator.msg = {
        "empty":"Te rugăm să completezi câmpul!",
        "minValue":"Salariul minim este de 1065 lei",
        "numbersOnly":"Te rugăm să introduci o valoare numerică"
    };
    Validator.minimumWage = 1065;


    function Entity(){}
    Entity.prototype.precision = 10000;
    Entity.prototype.results = null;
    Entity.prototype.setValue = function(input){
        this.input = input;
        this.results = {};
        this.calculate();
    };
    Entity.prototype.calculate = function(){
        var precisionGrossIncome, precisionPow, netIncome = this.input;
        this.grossIncome = parseInt((netIncome * this.precision) / (0.7014 * this.precision) * this.precision) / this.precision;
        precisionGrossIncome = this.grossIncome * this.precision;
        precisionPow = Math.pow(this.precision, 2);
        this.results.netIncome =  netIncome;
        this.results.valoareCreata = Math.round((netIncome * this.precision) / (0.5702 * this.precision));
        this.results.contributieStat = Math.round((this.results.valoareCreata * this.precision) * (0.43 * this.precision) / precisionPow);
        this.results.sanatate = Math.round(precisionGrossIncome * (0.107 * this.precision) / precisionPow);
        this.results.pensiiStat = Math.round(precisionGrossIncome * (0.263 * this.precision) / precisionPow);
        this.results.impozitVenit = Math.round(precisionGrossIncome * (0.1336 * this.precision) / precisionPow);
        this.results.alteTaxe = Math.round(precisionGrossIncome * (0.025 * this.precision) / precisionPow);
        this.results.consum = parseFloat((precisionGrossIncome * (0.62 * this.precision) / precisionPow).toFixed(("" + this.precision).length - 1));
        this.results.tva = Math.round(((this.results.consum * this.precision) * (0.14 * this.precision)) / precisionPow);
        this.results.valoareRamasa = Math.round(precisionGrossIncome * (0.6146 * this.precision) / precisionPow);
        this.results.pensiiStatAngajat = Math.round(precisionGrossIncome * (0.105 * this.precision) / precisionPow);
        this.results.pensiiStatAngajator = Math.round(precisionGrossIncome * (0.158 * this.precision) / precisionPow);
        this.results.sanatateAngajat = Math.round(precisionGrossIncome * (0.055 * this.precision) / precisionPow);
        this.results.sanatateAngajator = Math.round(precisionGrossIncome * (0.052 * this.precision) / precisionPow);
        this.results.alteTaxeAngajat = Math.round(precisionGrossIncome * (0.005 * this.precision) / precisionPow);
        this.results.alteTaxeAngajator = Math.round(precisionGrossIncome * (0.02 * this.precision) / precisionPow);
    };
    Entity.prototype.toJSON = function(){
        return this.results;
    };


    function Controller(){
        this.view = new View(this);
        this.validator = new Validator();
        this.entity = new Entity();
    }

    Controller.prototype.indexAction = function(){
        this.view.setActions();
        this.view.initTopButton();
    };

    Controller.prototype.submitFormAction = function(input){
        var isValid = this.validator.validate(input);
        this.view.resetError();
        if(!isValid){
            this.view.showError(this.validator.getMessage());
            return false;
        }
        this.entity.setValue(parseInt(input, 10));
        this.view.displayCharts(this.entity.toJSON());
    };

    $(document).ready(function () {
        var page = new Controller();
        page.indexAction();
    });

});