var info, list;

module.exports = GooglePlaylist;
function GooglePlaylist(info, list){
	this.info = info;
	this.list = list;
}
//get the info for this particular playlist
GooglePlaylist.prototype.getInfo = function(){
	return this.info;
}
//get the list of songs in this playlist
GooglePlaylist.prototype.getList = function(){
	return this.list;
};