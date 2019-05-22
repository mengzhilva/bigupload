<?php
class Action_upload extends MAction
{
	public function test()
	{
		ini_set('memory_limit','800M');
		deldir('./upload/');
		$this->xcontext->tpl = "test.html";
	}
	function up(){
		//var_dump($_FILES);exit;
		//实例化并获取系统变量传参
		$hz = pathinfo($_POST['file_name'],PATHINFO_EXTENSION);
		$file_putname = $this->request->attr['file_putname'];
		$putfilename = md5($_POST['file_name'].time().rand(11111,99999)).'.'.$hz;
		if($file_putname){
			$putfilename = $file_putname;
		}
	
	
		$upload = new bigupload($_FILES['file']['tmp_name'],$_POST['blob_num'],$_POST['total_blob_num'],$putfilename,$_POST['file_name']);
		//调用方法，返回结果
		$upload->apiReturn();
	}
	function downfile(){
		$json = $this->request->attr['json'];
		$allzipname = $this->request->attr['allzipname'];
		//var_dump($json);exit;
		$file = json_decode($json,true);
		$downfile = new bigupload();
		$downfile->downfiles($file,$allzipname);
	
	}
}
?>
