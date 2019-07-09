var migrationLayer = {
	layer:null,
	addEffectLayer(map){
		var syData = [];
		for(var i = 0,len=suyuanMsg_cq.length;i<len;i++){
			var item = suyuanMsg_cq[i];
			var syItem = {
				start:{
					X:item.x,
					Y:item.y
				},
				end: {
					X: 106.57027,
					Y: 29.69333
				}
			}
			syData.push(syItem);
		}
		var option = {
			id:"migrationLine"
		}
		this.layer = ArcgisMapVisual(map, syData,option);
	},
	clearLayer(){
		if(this.layer){
			this.layer.removeLayer();
		}
	}
}


