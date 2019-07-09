function insertImg(id,data){
	if(data==0){
		$("#"+id).parent().find(".datagrid-body").css("text-align","center");
		$("#"+id).parent().find(".datagrid-body").html("<img src='../image/index/nohistory.png'>")
            	
	};
}