let cartoes = [];

$(document).ready(function(){

    $.getJSON("cartoes.json", function(data){

        cartoes = data.cartoes;

        cartoes.forEach(c=>{
            $("#cartao").append(
                `<option value="${c.codigo}">${c.nome}</option>`
            );
        });

    });

});

$("#cartao").on("change", function(){

    const codigo = $(this).val();
    $("#parcelas").html('<option value="">Selecione</option>');

    const cartao = cartoes.find(c => c.codigo === codigo);

    if(!cartao) return;

    cartao.taxas.forEach(t => {

        $("#parcelas").append(`
            <option value="${t.parcelas}" data-taxa="${t.taxa}">
                ${t.parcelas}x - ${(t.taxa*100).toFixed(2)}%
            </option>
        `);

    });

});

$("#btnSimular").on("click", function(){

    const modo = $("input[name='modo']:checked").val();
    const valor = parseFloat($("#valor").val());
    const parcelas = parseInt($("#parcelas").val());
    const taxa = parseFloat($("#parcelas option:selected").data("taxa"));

    if(!valor || !parcelas) return;

    let valorInvestido, valorPagar, juros;

    if(modo === "cobrar"){
        valorInvestido = valor/(1-taxa);
        valorPagar = valor;
        juros = valorInvestido - valor;
    } else {
        valorInvestido = valor;
        juros = valor*taxa;
        valorPagar = valor - juros;
    }

    const parcela = valorInvestido/parcelas;

    const format = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

    $("#valorInvestido").text(format(valorInvestido));
    $("#valorPagar").text(format(valorPagar));
    $("#valorParcela").text(format(parcela));
    $("#qtdParcelas").text(parcelas);
    $("#taxaTotal").text((taxa*100).toFixed(2)+"%");
    $("#valorJuros").text(format(juros));

});