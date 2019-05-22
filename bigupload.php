<?php
class bigupload{

	private $filepath = './uploads/tmp/'; //上传目录

	private $tmpPath;  //PHP文件临时目录

	private $blobNum; //第几个文件块

	private $totalBlobNum; //文件块总数

	private $fileName; //文件名
	private $showfilename; //文件显示用名

	



	public function __construct($tmpPath=0,$blobNum=0,$totalBlobNum=0,$fileName=0,$showfilename=0){

		if($blobNum){
		ini_set('memory_limit','800M');
		$this->tmpPath =  $tmpPath;

		$this->blobNum =  $blobNum;

		$this->totalBlobNum =  $totalBlobNum;

		$this->fileName =  $fileName;
		$this->showfilename =  $showfilename;

		 
		$this->moveFile();

		$this->fileMerge();
		}
	}

	 

	//判断是否是最后一块，如果是则进行文件合成并且删除文件块

	private function fileMerge(){
		ini_set('memory_limit','2000M');

		if($this->blobNum == $this->totalBlobNum){

			$blob = '';

			for($i=1; $i<= $this->totalBlobNum; $i++){

				$blob = file_get_contents($this->filepath.'/'. $this->fileName.'__'.$i);

				file_put_contents($this->filepath.'/'. $this->fileName,$blob,FILE_APPEND);

			}

			 

			$this->deleteFileBlob();

		}

	}

	 

	//删除文件块

	private function deleteFileBlob(){

		for($i=1; $i<= $this->totalBlobNum; $i++){

			@unlink($this->filepath.'/'. $this->fileName.'__'.$i);

		}

	}

	 

	//移动文件

	private function moveFile(){

		$this->touchDir();

		$filename = $this->filepath.'/'. $this->fileName.'__'.$this->blobNum;

		move_uploaded_file($this->tmpPath,$filename);

	}

	 

	//API返回数据

	public function apiReturn(){

		if($this->blobNum == $this->totalBlobNum){

			if(file_exists($this->filepath.'/'. $this->fileName)){

				$data['code'] = 2;

				$data['msg'] = 'success';
				
				$data['showfilename'] = $this->showfilename;
				$data['file_putname'] = '';
				
				$data['file_path'] = dirname($_SERVER['DOCUMENT_URI']).str_replace('.','',$this->filepath).'/'. $this->fileName;
				
			}

		}else{

			if(file_exists($this->filepath.'/'. $this->fileName.'__'.$this->blobNum)){

				$data['code'] = 1;

				$data['msg'] = 'waiting for all';

				$data['showfilename'] = $this->showfilename;
				$data['file_putname'] = $this->fileName;
				$data['file_path'] = '';

			}

		}

		header('Content-type: application/json');

		echo json_encode($data);

	}
	//建立上传文件夹

	private function touchDir(){

		if(!file_exists($this->filepath)){

			return mkdir($this->filepath);

		}

	}
	function download($file_url){
		if(!isset($file_url)||trim($file_url)==''){
			return '500';
		}
		if(!file_exists($file_url)){//检查文件是否存在
			return '404';
		}
		ob_clean();
		$file_name=basename($file_url);
		$file_type=explode('.',$file_url);
		$file_type=$file_type[count($file_type)-1];
		$filename = basename($file_url);
		//输入文件标签phpernote
		header("Content-type: application/octet-stream");
		header("Accept-Ranges: bytes");
		header("Accept-Length: ".filesize($file_url));
		header("Content-Disposition: attachment; filename=".$file_name);
		//输出文件内容
		@readfile($file_url);
	}
	function downfile($file){
		
		ini_set('memory_limit','2000M');
		$path = $file['path'];
		$filename = $file['filename'];
		$path = str_replace('//', '/', $path);
		$res = file_get_contents('.'.$path);
		$newpath = $this->filepath.'/'. $file['showfilename'];;
		if(file_exists($newpath)){
			unlink($newpath);
		}
		file_put_contents($newpath,$res,FILE_APPEND);

		$data['path'] = $newpath;
		return $data;
	}
	function downfiles($files,$allzipname='cs'){
		$filelist = array();
		foreach ($files  as $k=>$v){
			
			$filelist[] = $this->downfile($v);
		}
		if(count($filelist) == 1){
		
			$file = $filelist[0]['path'];
			if(file_exists($file)){
			$filename = basename($file);
			$this->download($file);
			}
		}else{
			ob_clean();
			$name = $allzipname;
			$image = array();
			$zip = new ZipArchive();
			$filename = $name.'.zip';
			
			$path = $this->filepath.$filename;
			//unlink($path);
			if ($zip->open ( $path, ZIPARCHIVE::CREATE ) !== TRUE) {
				exit ( '无法打开文件，或者文件创建失败' );
			}
			//先下载到临时文件夹，再下载
			
			foreach ($filelist as $k=>$v){
				//$v['img'] = 'http://oftcn.fthome.com/uploads/goods/201807/goods153094369954699.png';
				//var_dump($v['path']);
				$v['path'] = str_replace('./', '/', $v['path']);
				$filepath = BASEPATH.str_replace(IMAGE_OSS_HTTP, '', $v['path']);
				if(strpos( $v['path'], 'http')!==false){
					$filepath = oss::downfile($v['path'], BASEPATH.str_replace(IMAGE_OSS_HTTP, '', $v['path']));
				}
				//var_dump($filepath);
				$zip->addFile($filepath, basename ( $v['path'] ));
			}
			$zip->close();
			//exit;
			// 下载文件
			header("Cache-Control: public");
			header("Content-Description: File Transfer");
			header('Content-disposition: attachment; filename='.basename($filename)); //文件名
			header("Content-Type: application/zip"); //zip格式的
			header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件
			header('Content-Length: '. filesize($path)); //告诉浏览器，文件大小
			@readfile($path);
		}
		
					
	}
}
