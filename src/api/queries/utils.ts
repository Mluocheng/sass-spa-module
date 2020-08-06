
/**
 * 将请求参数拼接到url上
 * @param url 
 * @param params 
 */
export function splitParamsToUrl<P extends {}>(url: string, params: P): string {

  Object.keys(params).forEach(key => {
    url = url.replace(new RegExp(`{${key}}`), params[key]);
  });

  return url;
}
