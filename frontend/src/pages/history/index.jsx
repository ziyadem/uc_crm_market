import HistoryInfo from './components/historyInfo'
import HistoryList from './components/historyList'


const History = () => {
  return (
    <section className="p-4 page">
      <div className="row row-cols-2 h-100">
        <HistoryList />
        <HistoryInfo />
      </div>
    </section>
  )
}

export default History
