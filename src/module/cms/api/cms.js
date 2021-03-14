//public是对axios的工具类封装，定义了http请求方法
import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

//页面查询
export const page_list = (page,size,params) => {
  //将params对象数据拼装成key/value串
  let queryString = querystring.stringify(params);
  //请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl+'/cms/page/list/'+page+'/'+size+"?"+queryString);
}

//站点查询
export const site_list = () => {
  //请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl+'/cms/site/list');
}

//模板查询
export const template_list = () => {
  //请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl+'/cms/template/list');
}
