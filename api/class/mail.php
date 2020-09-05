<?PHP

# carrega classe MYSQLi
require_once "phpmailer/class.phpmailer.php";

class mail extends PHPMailer {

	// Configuração dos dados do servidor e tipo de conexão (Estes dados você obtem com seu host)
	public function __construct() {
		// Define que a mensagem será SMTP
		$this->IsSMTP();
		// Endereço do servidor SMTP
		$this->Host = 'mail.prodepa.pa.gov.br'; 
		$this->Port = 587;
		// Autenticação (True: Se o email será autenticado ou False: se o Email não será autenticado)
		$this->SMTPAuth = true; 
		// Usuário do servidor SMTP
		$this->Username = 'disquedenuncia@segup.pa.gov.br'; 
		// A Senha do email indicado acima
		$this->Password = 'senhado181'; 
		// Remetente (Identificação que será mostrada para quem receber o email)
		$this->From = "disquedenuncia@segup.pa.gov.br";
		$this->FromName = "Disque Denuncia 181/SEGUP";
		// Define que o e-mail será enviado como HTML
		$this->IsHTML(true); 
		$this->CharSet = 'UTF-8';
	}

}

?>