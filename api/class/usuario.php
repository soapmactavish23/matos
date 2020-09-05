<?php

class usuario extends database {
	
	public function autenticar ( $login, $password ) {
		$sql = "SELECT idusuario, nome, permissao, idorgao, if(md5(email)=senha,true,false) mudasenha
		FROM usuario
		WHERE binary email='" . addslashes($login) . "' and binary senha='" . md5( addslashes($password) ) . "' and ativado='S'
		LIMIT 1";
	
		if ( $rs = parent::fetch_all($sql) ) {
			$row = array_shift($rs);
			$this->saveLog('Entrou',$row['idusuario']);
			$rows['token'] = createJWT ($row, 36000);
			return $rows;
		} 
	}

	public function mudarSenha() {
		global $_user;
		$sql = "SELECT idusuario, nome, permissao FROM usuario
		WHERE binary idusuario='".$_user->idusuario."' and binary senha='".md5( addslashes($_REQUEST['senha']) )."' 
		LIMIT 1";
		if ( $rs = parent::fetch_all($sql) ) {
			$this->idusuario = $_user->idusuario;
			$this->senha = md5( addslashes ($_REQUEST['novasenha']) );
			$this->update();
			$this->saveLog("mudou sua senha", $_user->idusuario);

			$row = array_shift($rs);
			$row['mudasenha'] = false;
			return array ('token' => createJWT ($row, 36000));
		} else {
			return array ('error' => 'Senha atual invalida');
		}
	}
	
	public function obterTodos() {
		$sql = "SELECT idusuario, nome, orgao, email, contato, whatsapp, u.idorgao, permissao, dt_update, ativado 
		FROM usuario u
		INNER JOIN orgao o on u.idorgao=o.idorgao";
	
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = stripslashes($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}

	public function obterTodosComEncaminhamento(){
		$sql = "SELECT idusuario, nome FROM usuario WHERE permissao like '%encaminhamento-denuncia%'";
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = stripslashes($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}

	public function salvar() {
		if ( @ $_REQUEST['orgao'] ) {
			require_once ('class/orgao.php');
			$_orgao = new orgao();
			$orgao = $_orgao->salvar();
			$_REQUEST['idorgao'] = $orgao['idorgao'];
		}
		
		$this->idusuario = @ $_REQUEST['idusuario'];
		$this->nome = addslashes(@ $_REQUEST['nome']);
		$this->email = (@ $_REQUEST['email']);
		$this->contato = (@ $_REQUEST['contato']);
		$this->whatsapp = (@ $_REQUEST['whatsapp']);
		$this->idorgao = (@ $_REQUEST['idorgao']);
		$this->permissao = implode(',', @ $_REQUEST['permissao']);

		if ( @ $_REQUEST['ativado'] ) $this->ativado = 'S';
		else $this->ativado = 'N';
	
		if ( $this->idusuario ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
			
			global $_user;
			$this->saveLog("alterou usuario #$this->idusuario", $_user->idusuario);
		} else {
			$this->senha = md5($this->email);
			$this->idusuario = $this->insert();
			
			global $_user;
			$this->saveLog("inserir usuario #$this->idusuario", $_user->idusuario);
		}
		
		return array ( 'idusuario' => $this->idusuario );
	}

	public function excluir() {
		if ( @ $_REQUEST['idusuario'] ) {
			$this->idusuario = $_REQUEST['idusuario'];	
			$this->delete();
			global $_user;
			$this->saveLog( "excluiu usuario #$this->idusuario", $_user->idusuario);
			return array ( 'idusuario' => $this->idusuario );
		}
	}

	public function renovarSenha() {
		if ( @ $_REQUEST['idusuario'] && @ $_REQUEST['email'] ) {
			$this->idusuario = $_REQUEST['idusuario'];
			$this->senha = md5( addslashes($_REQUEST['email']) );
			$this->update();
			global $_user;
			$this->saveLog( "renovou senha do usuario #$this->idusuario", $_user->idusuario);
			return array ('idusuario' => $this->idusuario );
		}
	}

	public function obterTodosAtivados() {
		$sql = "SELECT idusuario, nome, orgao
		FROM usuario u
		INNER JOIN orgao o ON u.idorgao=o.idorgao
		WHERE ativado='S'
		ORDER BY orgao,nome";
	
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = stripslashes($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}
	
	public function obterTodosAtivadosDoOrgao() {
		$sql = "SELECT idusuario, nome
		FROM usuario u
		WHERE idorgao='".$_REQUEST['idorgao']."' and ativado='S'
		ORDER BY nome";
	
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}

	public function obterOutrosRegistradores() {
		global $_user;
		
		$sql = "SELECT idusuario, nome
		FROM usuario u
		WHERE instr(permissao,'registro-denuncia') 
		AND idusuario<>'$_user->idusuario'
		AND ativado='S'
		ORDER BY nome";
	
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}

}
?>