import type { HttpClient, RequestConfig } from '../http/types'
import type { UploadResult } from '../types/api.types'

export function createBaseService(http: HttpClient) {
  return {
    uploadFile(formData: FormData) {
      return http.post<UploadResult>('/file/upload', formData)
    },

    getLastAppVersion(config?: Pick<RequestConfig, 'noLoading'>) {
      return http.post<any>('/sys/versionApp/getLastAppVersion', undefined, config)
    },

    getTreeByDeptInspection(config?: Pick<RequestConfig, 'noLoading'>) {
      return http.post<any>('/inspection/info/getTreeByDeptInspection', {}, config)
    },
  }
}
