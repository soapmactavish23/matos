<?php

class produto extends database {
	
	public function obterTodos() {
		$sql = "SELECT * FROM produto";
	
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
		
		$this->idproduto = @ $_REQUEST['idproduto'];
		$this->descricao = addslashes(@ $_REQUEST['descricao']);
		$this->estoque = (@ $_REQUEST['estoque']);
		$this->unidade_medida = (@ $_REQUEST['unidade_medida']);
	
		if ( $this->idproduto ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
			
			global $_user;
			$this->saveLog("alterou produto #$this->idproduto", $_user->idusuario);
		} else {
			$this->idproduto = $this->insert();
			
			global $_user;
			$this->saveLog("inserir produto #$this->idproduto", $_user->idusuario);
		}
		
		return array ( 'idproduto' => $this->idproduto );
	}


	public function obterUnidadeMedidas(){
		$sql = "SELECT unidade_medida FROM produto";
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

	public function excluir() {
		if ( @ $_REQUEST['idproduto'] ) {
			$this->idproduto = $_REQUEST['idusuidprodutoario'];	
			$this->delete();
			global $_user;
			$this->saveLog( "excluiu produto #$this->idproduto", $_user->idusuario);
			return array ( 'idproduto' => $this->idproduto );
		}
	}

}
?>