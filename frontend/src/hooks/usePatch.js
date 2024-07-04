import { toast } from "react-toastify"
import izzo from "../axios"

function usePatch( url, data, message ) {
  async function patch() {
    try {
      await izzo.patch(url,data)
      toast( message, { type: "info" })
      return null
    } catch (error) {
      toast(error.response.data.message, { type: "error" })
    }
  }
  return patch()
}

export default usePatch
