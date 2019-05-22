<h2>大文件、多文件分片上传插件</h2>

支持多文件上传，显示进度条，大文件分片上传，文件下载，打包下载等功能。

前台js+css

后台php

<h4>文件说明</h4>

test.html 示例页面

bigupload.php 上传类库

upload_act.php 示例控制器文件

<h4>使用方法</h4>

文件引入

<link rel="stylesheet" type="text/css" href="bigupload.css"/>
<script type="text/javascript" src="bigupload.js"></script>

前台js

var bigUpload = new bigUpload();
$(".fujianBtn").click(function(){ //点击附件的时候初始化
	var files = $(this).attr('files'); //已经上传文件 格式 [{"id":2,"filename":"1.jpg","showfilename":"1.jpg","filesize":"0.14","path":"//uploads/tmp//f258da8fdfb280e2bf8ff620949f898a.jpg"}]
	if(typeof(files)!='undefined')
	files = JSON.parse(files)
	bigUpload.config({'number':'5','readonly':'0',"files":files,'allzipname':"全部下载"})
	
	bigUpload.finish = function(){ //上传完成点击确定的回调函数

	}
})

后台php

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
