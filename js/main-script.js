var formIsValid = false;
$(function () {


    var msg = {
        "empty":"Te rugăm să completezi câmpul!",
        "minValue":"Salariul minim este de 1065 lei",
        "numbersOnly":"Te rugăm să introduci o valoare numerică"
    };
    var salariuMinim = 1065;

    function validate(input){
        var error, errorMsg, emptyRegex = /^\s*$/;
        if(emptyRegex.test(input)){
            error = true;
            errorMsg = msg.empty;
        } else if(isNaN(input)){
            error = true;
            errorMsg = msg.numbersOnly;
        } else if(input < salariuMinim){
            error= true;
            errorMsg = msg.minValue;
        } else {
            error = false;
            errorMsg = null;
        }
        formIsValid = !error;
        return {
            "error":error,
            "errorMsg":errorMsg
        };
    }

    function calculare(input){
        var salariuNet = input;
        var rezultate = {
            "salariuNet": salariuNet,
            "valoareCreata": parseInt((salariuNet / 0.5702)),
            "contributieStat": parseFloat((salariuNet / 0.5702 * 0.43).toFixed(0)),
            "sanatate": parseFloat((salariuNet / 0.7014 * 0.107).toFixed(0)),
            "pensiiStat": parseFloat((salariuNet / 0.7014 * 0.263).toFixed(0)),
            "impozitVenit": parseFloat((salariuNet / 0.7014 * 0.1336).toFixed(0)),
            "alteTaxe": parseFloat((salariuNet / 0.7014 * 0.025).toFixed(0)),
            "valoareRamasa": parseFloat((salariuNet * (1 - 1/0.7014 * 0.62 * 0.14)).toFixed(0)),
            "tva": parseFloat((salariuNet * 1/0.7014 * 0.62 * 0.14).toFixed(0)),
            "pensiiStatAngajat": parseFloat((salariuNet/0.7014*0.055).toFixed(0)),
            "pensiiStatAngajator": parseFloat((salariuNet/0.7014*0.158).toFixed(0)),
            "sanatateAngajat":parseFloat((salariuNet/0.7014*0.055).toFixed(0)),
            "sanatateAngajator":parseFloat((salariuNet/0.7014*0.052).toFixed(0)),
            "alteTaxeAngajat":parseFloat((salariuNet/0.7014*0.005).toFixed(0)),
            "alteTaxeAngajator":parseFloat((salariuNet/0.7014*0.02).toFixed(0))
        };
        return rezultate;
    }

    function showError(msg){
        $('body').addClass('not-verified');
        $(".not-verified-popout").find(".msg").text(msg);
        $('.not-verified-popout').show();
    }

    function submitForm(){
        var element =  $("#sal_net");
        var input = parseInt(element.val(),10);
        var formValidation = validate(input);
        if(formValidation.error){
            showError(formValidation.errorMsg);
        } else {
            var rezultate = calculare(input);
            $('body').removeClass('not-verified');
            initCharts(rezultate);
            setLabels(rezultate);
            $('body').addClass('loaded');
            // $(".drilldown").drilldown({speed:300});
            $('html,body').animate({
                scrollTop: $(".details").offset().top
            }, 1000);
            return false;
        }
    }
    function setLabels(rezultate){
        var statContrib = parseInt(rezultate.pensiiStat + rezultate.sanatate + rezultate.impozitVenit + rezultate.alteTaxe);
        var total = statContrib + rezultate.salariuNet;
        var valoareRamasa = parseInt(rezultate.valoareRamasa);
        var statTotal = parseInt(rezultate.contributieStat + rezultate.tva);
        $("#sorin_number").text(valoareRamasa);
        $("#stat_number").text(statTotal);
        $("#total_number").text(parseInt(rezultate.valoareCreata));
    }
    function initCharts(dataSet){
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

        Highcharts.setOptions({
            lang: {
                drillUpText: "◁ Înapoi"
            }
        });

        chartOptions2 = {
            chart: {
                renderTo: 'container_2',
                backgroundColor: '#f7f8fa',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
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


        var chart_bugete_options = {
            chart: {
                renderTo: "tabel_buget_container",
                backgroundColor: '#f7f8fa',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
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
    }

    $(document).ready(function () {

        // Closes the sidebar menu
        $("#menu-close").click(function (e) {
            e.preventDefault();
            $("#sidebar-wrapper").toggleClass("active");
        });

        // Opens the sidebar menu
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#sidebar-wrapper").toggleClass("active");
        });

        // Scrolls to the selected menu item on the page
        $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function () {
            return false;
        });

        $("#to-top").click(function(){
            $("body").animate({"scrollTop":"0"},1000);
        });

        //#to-top button appears after scrolling
        var fixed = false;
        $(document).scroll(function () {
            if ($(this).scrollTop() > 250) {
                if (!fixed) {
                    fixed = true;
                    // $('#to-top').css({position:'fixed', display:'block'});
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


        $('#buton').on('click', submitForm);

        $('#sal_net').keypress(function (e) {
            if (e.which === 13) {
                $('#buton').trigger('click');
            }
        });

        $('.close-button').click(function(){
            $(this).parent('.not-verified-popout').hide();
        });

        $(document).on('click', function(event){
            var container = $(".not-verified-popout");
            if (!container.is(event.target) &&
                container.has(event.target).length === 0)
            {
                $(container).hide();
            }
        });
    });

});