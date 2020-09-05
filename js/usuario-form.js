// Load Form
$('.modal-title').text('Novo usuário');
$('.phone_with_ddd').mask('(99) 99999-9999');

if ( data ) {
	$('.modal-title').text('Usuário #'+data.idusuario);
	$('input[name="idusuario"]').val(data.idusuario);
	$('input[name="nome"]').val(data.nome);
	$('input[name="email"]').val(data.email);
	$('input[name="contato"]').val(data.contato);
	$('input[name="whatsapp"]').val(data.whatsapp);
} else {
	data = {
		idusuario: null, 
		orgao: null, 
		permissao: '', 
		ativado: null
	};
}

// Select Picker para Orgao
var selectOrgao = $('select[name="idorgao"]');
// Carrega options
$.ajax({
	type: 'POST',
	url: url+'api.php',
	data: {classe: "orgao", metodo: "obterTodos", token: token},
	success: function(result) {	
		if ( ! result.data ) result.data = [];

		selectOrgao.append( $('<option>', {text: '-- Novo orgão --'}) );
		$.each( result.data, function(index, element) {
			selectOrgao.append( $('<option>', {value: element.idorgao, text: element.orgao}) );
		});
		
		selectOrgao.val(data.idorgao);
		selectOrgao.selectpicker();
	}
});	

// Select Picker para permissao
var selectPermissao = $('select[name="permissao[]"]');
// Carrega options
$.each(menu.responseJSON.items, function(index, element) {
	if (element.subitems) {
		var optgroup = "<optgroup label='"+element.label+"'>";
		$.each(element.subitems, function(subIndex, subElement) {
			//select.append( $('<option>', {value: element.id, text: element.label+': '+element.label}) );
			optgroup += "<option value='"+subElement.id+"'>"+subElement.label+"</option>";
		});
		optgroup += "</optgroup>";
		selectPermissao.append(optgroup);
	} else {
		selectPermissao.append( $('<option>', {value: element.id, text: element.label}) );
	}	
});
selectPermissao.val(data.permissao.split(','));
selectPermissao.selectpicker();

if ( data.idusuario ) {
	if (data.ativado=='S') $('#ativado').prop('checked',true);
	// oculta o botao excluir
	$('#btn-excluir').show();
} else {
	// oculta o botao excluir e renova senha
	$('#btn-excluir').hide();
	$('#btn-renovar-senha').hide();
}			

$('#idorgao').change( function() {
	if ($(this).val() == '-- Novo orgão --') {
		$('#div-setor').html("<input class='form-control' type='text' id='orgao' name='orgao' placeholder='Escreva o nome do orgão' required>");
		$('#orgao').focus();		
	}
});

$('form').submit(function(){
	var formData = $(this).serializeArray();
	formData.push({name: 'classe', value: 'usuario'});
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
				$('input[name="idusuario"]').val(result.idusuario);
				$('#btn-renovar-senha').show();
				$('#btn-excluir').show();
				alert('Usuário ID '+result.idusuario+' salvo!');
				datatable.ajax.reload(null, false);
			}
		}
	});
	return false;
});	

$('#btn-excluir').click(function(){
	if ( confirm('Tem certeza que deseja excluir este registro?') ) {
		var formData=[];
		formData.push({name: 'classe', value: 'usuario'});
		formData.push({name: 'metodo', value: 'excluir'});
		formData.push({name: 'token', value: token});
		formData.push({name: 'idusuario', value: $('input[name="idusuario"]').val()});
		$.ajax({
			type: 'POST',
			url: url+'api.php',
			data: formData,
			success: function(result) {	
				if ( result.error ) {
					alert(result.error);
				} else {
					$('input[name="idusuario"]').val(null);
					$('#btn-renovar-senha').hide();
					$('#btn-excluir').hide();

					alert('ID '+result.idusuario+' excluído!');
					datatable.ajax.reload(null, false);
				}
			}
		});	
	}
});

$('#btn-renovar-senha').click(function(){
	var formData=[];
	formData.push({name: 'classe', value: 'usuario'});
	formData.push({name: 'metodo', value: 'renovarSenha'});
	formData.push({name: 'token', value: token});
	formData.push({name: 'idusuario', value: $('input[name="idusuario"]').val()});
	formData.push({name: 'email', value: $('input[name="email"]').val()});
	$.ajax({
		type: 'POST',
		url: url+'api.php',
		data: formData,
		success: function(result) {	
			if ( result.error ) {
				alert(result.error);
			} else {
				alert('Senha do usuário ID '+result.idusuario+' renovada!');
				datatable.ajax.reload(null, false);
			}
		}
	});	
});