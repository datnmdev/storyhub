import { RequestInit } from "@apis/api.type"
import axiosInstance from "libs/axios"

const moderationRequestApi = {
  createModerationRequest: (options: RequestInit) => {
    return axiosInstance().post('/moderation-request', options.body)
  }
}

export default moderationRequestApi