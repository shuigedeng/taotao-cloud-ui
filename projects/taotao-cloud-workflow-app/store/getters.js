const getters = {
	token: state => state.user.token,
	userInfo: state => state.user.userInfo,
	dictionaryList: state => state.base.dictionaryList,
	relationData: state => state.base.relationData,
	badgeNum: state => state.chat.badgeNum,
	msgInfo: state => state.chat.msgInfo,
}
export default getters
