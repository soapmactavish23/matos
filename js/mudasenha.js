$('form').submit(function() {
	if ( $('#novasenha').val() != $('#confirmanovasenha').val() ) {
		alert('A senha de confirmação é diferente da nova senha');
		$('input').val('');
		return false;
	}

	var formData = $(this).serializeArray();
	formData.push({name: 'classe', value: 'usuario'});
	formData.push({name: 'metodo', value: 'mudarSenha'});
	formData.push({name: 'token', value: token});
	$.ajax({
		type: 'POST',
		url: url + 'api.php',
		data: formData,
		success: function(result) {	
			if ( result.token ) {
				alert('Sua senha foi alterada com sucesso');
				sessionStorage.setItem('token', result.token);
				location.replace( pathname );
			} else {
				if (result.error) alert(result.error);
				else console.log(result);
				$('input').val('');
			}
		}
	});	
	
	return false;
});	