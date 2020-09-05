$('#btn-denunciar').click(function() {
	window.open('denuncie.html','_blank');
});

$('form').submit(function() {
	var formData = $(this).serializeArray();
	$.ajax({
		type: 'POST',
		url: url + 'autentique.php',
		data: formData,
		success: function(result) {	
			if (result) {
				if (result.token) {
					sessionStorage.setItem('token', result.token);
					window.location.reload();
				} else {
					console.log(result);
				}
			} else {
				// Nenhum resultado
				alert('E-mail ou senha inválidos! Tente novamente.');
				$('input[name=password]').val(null);
			}
		}
	});	
	return false;
});
