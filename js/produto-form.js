$('.modal-title').text('Novo Produto');
$('#btn-excluir').hide();

if(data){
    $('.modal-title').text(data.descricao);
    $('input[name="idproduto"]').val(data.idproduto);
    $('input[name="descricao"]').val(data.descricao);
    $('input[name="estoque"]').val(data.estoque);
}

//Select Picker para Unidade de Medida
var selectunidade_medida = $('select[name="unidade_medida"]');
$.ajax({
    type: 'POST',
    url: url + "/api.php",
    data: { classe: "produto", metodo: "obterUnidadesMedidas", token: token },
    success: function(result) {
        if (!result.data) result.data = [];
        selectunidade_medida.append($('<option>', { text: '-- Nova Unidade de Medida --' }));
        $.each(result.data, function(index, element) {
            selectunidade_medida.append($('<option>', { value: element.unidade_medida, text: element.unidade_medida }));
        });

        if (data) selectunidade_medida.val(data.unidade_medida);
        else selectunidade_medida.val(null);

        selectunidade_medida.selectpicker();
    }
});

$('#unidade_medida').change(function() {
    if ($(this).val() == '-- Nova Unidade de Medida --') {
        $('#div-unidade_medida').html("<input class='form-control' type='text' id='unidade_medida' name='unidade_medida' placeholder='Digite a nova Unidade de Medida' required>");
        $('#unidade_medida').focus();
    }
});

$('form').submit(function(){
	var formData = $(this).serializeArray();
	formData.push({name: 'classe', value: 'produto'});
	formData.push({name: 'metodo', value: 'salvar'});
	formData.push({name: 'token', value: token});
	$.ajax({
		type: 'POST',
		url: url+'api.php',
		data: formData,
		success: function(result) {	
			if ( result.error ) {
				alert(result.error);
			} else {
				$('input[name="idproduto"]').val(result.idproduto);
				$('#btn-excluir').show();
				alert('Produto ID '+result.idproduto+' salvo!');
				datatable.ajax.reload(null, false);
			}
		}
	});
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var formData=[];
		formData.push({name: 'classe', value: 'produto'});
		formData.push({name: 'metodo', value: 'excluir'});
		formData.push({name: 'token', value: token});
		formData.push({name: 'idproduto', value: $('input[name="idproduto"]').val()});
		$.ajax({
			type: 'POST',
			url: url+'api.php',
			data: formData,
			success: function(result) {	
				if ( result.error ) {
					alert(result.error);
				} else {
					$('input[name="idproduto"]').val(null);
					$('#btn-excluir').hide();

					alert('ID '+result.idproduto+' excluído!');
					datatable.ajax.reload(null, false);
				}
			}
		});	
	}
});