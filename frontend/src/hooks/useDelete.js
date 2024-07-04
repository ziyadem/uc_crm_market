import { toast } from "react-toastify"
import izzo from "../axios"

function useDelete(url) {
  async function deleted() {
    try {
      await izzo.delete(url)
      toast("deleted", { type: "success" })
      return null
    } catch (error) {
      toast(error.response.data.message, { type: "error" })
    }
  }
  return deleted()
}

export default useDelete
