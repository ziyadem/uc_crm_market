import Back from "../../components/back";
import StatistikaList from "./components/StatistikaList";

const Statistika = () => {
  return (
    <section className="p-4 page">
      <div className="border border-secondary border-opacity-50 rounded-5 bg-secondary p-4 bg-opacity-25 h-100">
        <Back />
        <StatistikaList />
      </div>
    </section>
  );
};

export default Statistika;
