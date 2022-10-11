import "./App.css";
import Table from "./components/table";

export default function Index() {
  return (
    <div className="h-screen">
      <div className="min-h-full w-full flex justify-center items-center">
        <Table />
      </div>
    </div>
  );
}
