import { toast } from "react-toastify"
import izzo from "../axios";

function usePost(url, data) {
  console.log(data,'data');
  async function post() {
    try {
      await izzo.post(url, data)
      toast("created", { type: "success" })
      return null
    } catch (error) {
      toast(error.response.data.message, { type: "error" })
    }
  }
  return post()
}

export default usePost
