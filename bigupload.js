
function bigUpload(){

	var options = {};//參數
	var allfiles = []; //所有的文件，作为返回值用
	var readonly = 0; //是否是查看模式
    var fileForm = {}; //file表单
    var stopBtn = {}; //暂停功能暂时不用
    var objForm = {}; // 表单
    var j1 = {}; //进度条
    var inum = 0; //多个文件的第几个
    var is_stop = 0 //是否删除
    var is_running = 0 //是否正在上传
    var maxlength = 5; //最多上传数量
    var _self = this;
    var uploadurl = '/upload_up';//上传地址
    var downloadurl = '/upload_downfile';//下载地址
	this.config = function(option){
		options = option;
		allfiles = [];
		
    	init();//初始化
    	
    	fileForm = document.getElementById('file');
        stopBtn = document.getElementsByClassName('shanchuBtn');
        objForm = document.getElementById("objForm");
        j1=document.getElementsByClassName('fujianItemBox')[0];
    	isdisabledupload()
	    fileForm.onchange = function(){
			var upload = new Upload();
	    	var fileCount = this.files;
	        // 同时选择五个以上的文件
	        console.log(111);
	        if(fileCount.length > maxlength){

	        	fileCount = isdisableduploads(fileCount)
	        }
	        	isdisabledupload()
	        	fileCount = isdisableduploads(fileCount)
	            //多个文件上传
	            for(var i=0;i<fileCount.length;i++){
	    	        console.log(3333);
	        		upload.addFileAndSend(this.files[i],inum);
	        		inum++;
	            }
	        	$('#file').val('')
	        
	        stopBtn.onclick = function(){
	            this.value = "停止中";
	            upload.stop();
	            this.value = "已停止";
	        }
	    }
	}
    function init(){
    	if(options.uploadurl){
    		uploadurl = options.uploadurl;
    	}
    	if(options.downloadurl){
    		downloadurl = options.downloadurl;
    	}
    	//初始化html
        if(options.readonly == 1&&options.files.length==0){
        	alert('暂无文件');
        }else{
        	sethtml();
        }
    	
    }
    function isdisableduploads(fileCount){
        var childNum = document.getElementsByClassName('fujianItemBox')[0].children.length;
    	if((fileCount.length+childNum)>=maxlength){
    		var files = [];
    		var leng = (maxlength-childNum)
    		for(var i in fileCount){
    			if(i<leng){
    				files.push(fileCount[i])
    			}
    		}
			return files;    		
    	}   else{

			return fileCount; 
    	}
    }
    function isdisabledupload(){
        var childNum = document.getElementsByClassName('fujianItemBox')[0].children.length;
        // 一共上传的个数超过五个的上传按钮不能点击
        if(childNum>=maxlength){
            fileForm.style.display='none'
	        disabupload()
            return false;
        }else{
        	abledupload()
            fileForm.style.display='block'
        }
    	
    }
    function disabupload(){
    	$('.fujianBoxBtn').addClass('fujianBoxBtndisab');
    	$("#file").attr('disabled','disabled')
    }
    function abledupload(){
    	$('.fujianBoxBtn').removeClass('fujianBoxBtndisab');
    	$("#file").removeAttr('disabled','disabled')
    }
   	sethtml = function(){
        console.log(options)
        console.log(options.files)
        $(".fujianBox").remove();
   		var html = '    <div class="fujianBox">'+
           ' <div class="fujianBoxTop">'+
       ' 附件上传<i>（最多上传'+maxlength+'个文件）</i>'+
       ' <span></span>'+
  '  </div>'+
  '  <div class="fujianBoxBot">'
  if(options.readonly == 0){
	  html += '     <span class="fujianBoxBtn">'+
	     '       <span>上传</span>'+
	     '       <form action="" id="objForm">'+
	     '           <input type="file" name="file" id="file" multiple="multiple" required="required">'+
	     '       </form>'+
	     '   </span>'
  }
     if(options.files&&options.files.length!=0){
    	 html += '  <div class="fujianItemBox clearfloat showactive">'
    	 for(var i in options.files){
    		 var temphtml = getfiles(options.files[i])
    		 html +=temphtml;
    	 }
     }else{

    	 html += '  <div class="fujianItemBox clearfloat">'
     }
     html +='  </div>'+
    '</div>'+
    '<div class="fujianFootBox">'
    if(options.readonly == 0){
    	html +='       <button class="fujianFootYes">确定</button>'
        	html +='      <button class="fujianFootNo">取消</button>'
    }else{
    	html +='       <button class="downloadall">打包下载</button>'
            	html +='      <button class="fujianFootNogb">关闭</button>'
    }
    html += '   </div>'+
'</div>'+
  '  <div class="TpsBOX">'+
  '  <p class="TpsBOXP">'+
 '       提示'+
  '      <span></span>'+
   ' </p>'+
    '<p class="TpsBOXCont">'+
     '   请耐心等待文件上传完成或移除未完成上传文件后再点击确定。'+
    '</p>'+
    '<div class="TpsBOXBtn">'+
    '    <button class="TpsBOXBtnOk">好的</button>'+
    '</div>'+
'</div>'+
'<div class="TpsBOX2">'+
'    <p class="TpsBOXP2">提示<span></span> </p>'+
'    <p class="TpsBOXCont2">'+
'            取消后将不会保存此次附件编辑结果。'+
'    </p>'+
'    <div class="TpsBOXfoot2">'+
'        <button class="TpsBOXBtnjixu">继续取消</button>'+
'        <button class="TpsBOXBtnreturn">返回</button>'+
'    </div>'+
'</div>'
    ;
		$('body').append(html)
	    $(".fujianBox").show();
   	}
   	function getfiles(files){
     var html = '   <div class="fujianItem fujianItem_'+files.id+' ">'+
    '    <div class="fujianItemTop clearfloat">'+
    '    <p class="fujianItemP">'+
     '   <span class="fujianItemName">'+files.filename+'</span>'+
     '   <span class="fujianItemSize">('+files.filesize+'M)</span>'+
     '   </p>'+
    '    <p class="fujianItemBtn">'+
    '    <span class="xiazaiBtn" attrid="'+files.id+'">下载</span>'

    if(options.readonly == 0){
     html+='<span class="shanchuBtn"  attrid="'+files.id+'">删除</span>'
    }
    html+='   </p></div>'+
    '    <div class="fujianItembottom clearfloat" isfinsh="1">'+
     '   <span class="wanch">完成</span>'+
	'	</div>'+
	'	</div>'
		allfiles.push({'id':files.id,'filename':files.filename,'showfilename':files.showfilename,'filesize':files.filesize,'path':files.path})
		inum = files.id+1
		return html;
   	}
    $("body").on("click",".TpsBOXBtnOk",function(e){

	    $(".TpsBOX").hide();
    })
    $("body").on("click",".fujianFootYes",function(e){
    	var flage = 1;
    	$('.fujianBox').find('.fujianItembottom').each(function(){
    		if($(this).attr('isfinsh')!='1'){
    			flage = 0;
    		}
    	})
    	if(flage != 1){
    	    $(".TpsBOX").show();
    	}else{
    	    $(".fujianBox").remove();
        	return _self.finish($(this));
    	}
    })
    $("body").on("click",".shanchuBtn",function(e){
    	var attid = $(this).attr('attrid');
    	if(typeof(attid) == 'undefined'){
    		attid = (inum-1);
    		is_stop = 1;
    	}
	    $(".fujianItem_"+attid).remove();
	    console.log(allfiles)
	    for(var i in allfiles){
		    console.log(allfiles[i])
	    	if(allfiles[i].id == attid){
	    		allfiles.splice(i,1); 
	    	}
	    }
        isdisabledupload();
    })
    
    
    $("body").on("click",".xiazaiBtn",function(e){
	    var id = $(this).attr('attrid');
		var fil = [];
    	for(var i in allfiles){
    		if(allfiles[i].id == id){
    			fil.push(allfiles[i]);
    		}
    	}
		fil = JSON.stringify(fil);
		document.location.href=downloadurl+'?json='+fil;
  
    })
    $("body").on("click",".fujianFootNo",function(e){
	    $(".TpsBOX2").show();
    })
    $("body").on("click",".fujianFootNogb",function(e){
	    $(".fujianBox").remove();
    })
    $("body").on("click",".TpsBOXBtnreturn",function(e){
	    $(".TpsBOX2").hide();
    })
    $("body").on("click",".TpsBOXBtnjixu",function(e){
	    $(".TpsBOX2").hide();
	    $(".fujianBox").remove();
    })
    $("body").on("click",".downloadall",function(e){
    	var fil = JSON.stringify(allfiles);
		document.location.href=downloadurl+'?allzipname='+options.allzipname+'&json='+fil;
    	
    })
    this.finish = function(_this){
    	return this.getallfile;
    }
    this.getallfile = function(){
    	return allfiles;
    }
	function getClass(classname) {
        return document.getElementsByClassName(classname);
    }
    function Upload(){
        var xhr = new XMLHttpRequest();
        const LENGTH = 1024 * 1024*2;  //单个片的大小
        var start = {'0':0};  //
        var end = {'0':start[0] + LENGTH};
        var blob = {'0':0};
        var path;
        var blob_num = {'0':1}; //第几片
        var file_putname = {'0':''}; //文件在服务器存放名称md5 保证唯一性
        var showfilename = ''; //显示名称
        //对外方法，传入文件对象
        //inum第几个文件
        this.addFileAndSend = function(that,inum){
             start[inum] = 0;
             is_stop = 0;
             end[inum] = start[inum] + LENGTH;
             file_putname[inum] = '';
             showfilename = '';
        		blob_num[inum] = 1;
        		path = '';
                j1.style.display='block';
                    var f=new FileReader;
                    //创建
                    var html = '';
                    f.jin=document.createElement('div');
                    f.jin.classList.add('fujianItem')
                    f.jin.classList.add('fujianItem_'+inum)
                    j1.appendChild(f.jin);
                    f.jin2=document.createElement('div');
                    f.jin2.classList.add('fujianItemTop')
                    f.jin2.classList.add('clearfloat')
                    f.jin.appendChild(f.jin2);
                    f.jin3=document.createElement('p') ;
                    f.jin3.classList.add('fujianItemP')
                    f.jin2.appendChild(f.jin3);
                    f.jin4=document.createElement('span') ;
                    f.jin4.classList.add('fujianItemName')
                    f.jin3.appendChild(f.jin4);
                    f.jin5=document.createElement('span') ;
                    f.jin5.classList.add('fujianItemSize')
                    f.jin3.appendChild(f.jin5);
                    f.jin6=document.createElement('p') ;
                    f.jin6.classList.add('fujianItemBtn')
                    f.jin2.appendChild(f.jin6);
                    f.jin7=document.createElement('span') ;
                    f.jin7.classList.add('xiazaiBtn')
                    f.jin6.appendChild(f.jin7);
                    f.jin8=document.createElement('span') ;
                    f.jin8.classList.add('shanchuBtn')
                    f.jin6.appendChild(f.jin8);
                    f.jin9=document.createElement('div');
                    f.jin9.classList.add('fujianItembottom')
                    f.jin9.classList.add('clearfloat')
                    f.jin.appendChild(f.jin9);
                    f.jin10=document.createElement('div');
                    f.jin10.classList.add('fujianItemJin')
                    f.jin9.appendChild(f.jin10);
                    f.jin11=document.createElement('span');
                    f.jin11.classList.add('fujianItemJinImg')
                    f.jin11.classList.add('fujianItemJinImg_'+inum)
                    f.jin10.appendChild(f.jin11);
                    f.jin12=document.createElement('div');
                    f.jin12.classList.add('fujianItemJinNum')
                    f.jin12.classList.add('fujianItemJinNum_'+inum)
                    f.jin9.appendChild(f.jin12);
                    f._name=that.name;
                    f._size=that.size;
                    f.jin4.innerHTML= f._name;
                    f.jin5.innerHTML= '('+(f._size/1024/1024).toFixed(2)+'M)';
                   // f.jin7.innerHTML= '下载';
                    f.jin8.innerHTML= '删除';
                    var file = that;
                    blob[inum] = cutFile(file,inum);
                    is_running = 1;
                    sendFile(blob,file,inum);
                    blob_num[inum]  += 1;
                    isdisabledupload();
        }
        //停止文件上传
        this.stop = function(){
            xhr.abort();
            is_stop = 1;
            alert(is_stop)
        }
        //切割文件
        function cutFile(file,inum){
            var file_blob = file.slice(start[inum],end[inum]);
            start[inum] = end[inum];
            end[inum] = start[inum] + LENGTH;
            return file_blob;
        };
        //发送文件
        function sendFile(blob,file,inum){
            var form_data = new FormData();
        	var blobs = [];
            var total_blob_num = {'0':1};
          total_blob_num[inum] = Math.ceil(file.size / LENGTH);
            form_data.append('file',blob[inum]);
            form_data.append('blob_num',blob_num[inum]);
            form_data.append('total_blob_num',total_blob_num[inum]);
            form_data.append('file_name',file.name);
            form_data.append('file_putname',file_putname[inum]);
            xhr.open('POST',uploadurl,false);
            xhr.onreadystatechange  = function () {
        if (xhr.readyState==4 && xhr.status==200){

            console.log(xhr.responseText);
       		$(".fujianItem_"+inum).find('.shanchuBtn').attr('attrid',inum)
            var returns = JSON.parse(xhr.responseText)
            console.log(returns);
            file_putname[inum] = returns.file_putname;
            var progress = 0;
            	if(total_blob_num[inum] == 1){
                   progress = '100.00%';
       	       }else{
       	           progress = Math.min(100,(blob_num[inum]/total_blob_num[inum])* 100 ).toFixed(2) +'%';
       	       }
       	           console.log(progress);
       	           console.log('分割');
       	       var childNum2 = document.getElementsByClassName('fujianItemBox')[0].children.length;
       	       for(var j =0;j<childNum2;j++){
       	           getClass('fujianItemJinImg_'+inum)[0].style.width = progress;
       	           getClass('fujianItemJinNum_'+inum)[0].innerHTML = progress;
       	       }
	           	if(progress == "100.00%"){
	           		$(".fujianItem_"+inum).find('.fujianItembottom').html('<span class="wanch">完成</span>')
	           		$(".fujianItem_"+inum).find('.fujianItembottom').attr('isfinsh',1);
	           		$(".fujianItem_"+inum).find('.xiazaiBtn').attr('attrid',inum)
	           		$(".fujianItem_"+inum).find('.xiazaiBtn').html('下载')
	           		$(".fujianItem_"+inum).find('.shanchuBtn').attr('attrid',inum)
	        	}
	            console.log(start)
	            console.log(file.size)
	            
	               if(returns.code == 2){
	                   showfilename = returns.showfilename;
	                  	allfiles.push({'id':inum,'filename':file.name,'showfilename':showfilename,'filesize':(file.size/1024/1024).toFixed(2),'path':returns.file_path})
	                  	///is_stop = 1;
	                    is_running = 0;
	               }
       	       var t = setTimeout(function(){
       	           if(start[inum] < file.size && is_stop === 0){
       	                blob[inum] = cutFile(file,inum);
       	               sendFile(blob,file,inum);
       	                blob_num[inum]  += 1;
       	           }else{
       	               setTimeout(t);
       	           }
       	       },500);
       	   }
        }
        
        xhr.send(form_data);
      
    }
}

}

 