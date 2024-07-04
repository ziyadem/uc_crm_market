import { useEffect, useState } from "react"
import izzo from "../axios"

function useGet(url,reload) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let unmounted = false;
    async function getData() {
      try {
        setLoading(true);
        let res = await izzo.get(url)
        if (!unmounted && res.status === 200) setData(res.data)
      } catch (error) {
        // toast(error.response.data.message, { type: "error" })
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getData()
    return () => {
      unmounted = true
    }
  }, [reload])
  return [data, loading]
}

export default useGet
