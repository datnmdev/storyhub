import { RequestInit } from "@apis/api.type"
import axiosInstance from "libs/axios"

const moderationRequestApi = {
  createModerationRequest: (options: RequestInit) => {
    return axiosInstance().post('/moderation-request', options.body)
  },
  getModerationRequests: (options: RequestInit) => {
    return axiosInstance().get('/moderation-request', {
      params: options.queries
    })
  },
  updateModerationRequest: (options: RequestInit) => {
    return axiosInstance().put(`/moderation-request/${options.params.moderationRequestId}`, options.body)
  }
}

export default moderationRequestApi