/* process.env.NODE_ENV设置生产环境模式 */
/*JAVA app.java.workflowsoft.com  NET dotnet.workflowsoft.com*/
// #ifndef MP
const baseURL = process.env.NODE_ENV === "production" ?
	"https://app.java.workflowsoft.com" : "http://localhost:30000" // 接口前缀
const define = {
	baseURL: baseURL,
	webSocketUrl: process.env.NODE_ENV === "production" ? "wss://app.java.workflowsoft.com/websocket" :
		"ws://localhost:30000/api/message/websocket",
	comUploadUrl: baseURL + '/api/file/Uploader/',
	timeout: process.env.NODE_ENV === 'production' ? 1000000 : 1000000,
	report: process.env.NODE_ENV === 'development' ? 'http://localhost:8200' : baseURL + '/Report'
}
// #endif

// #ifdef MP
const baseURL = "http://192.168.20.23:30000" // "https://app.java.workflowsoft.com" 
const define = {
	baseURL: baseURL,
	webSocketUrl: "ws://192.168.20.23:30000/api/message/websocket", //"ws://app.java.workflowsoft.com/api/message/websocket"
	comUploadUrl: baseURL + '/api/file/Uploader/',
	timeout: process.env.NODE_ENV === 'production' ? 1000000 : 1000000,
	report: baseURL + '/Report'
}
// #endif
export default define
