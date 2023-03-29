import { StockList } from "../components/StockList"
import { Autocomplete } from "../components/Autocomplete"
import img from "../images/trading.jpg"

export const StockOverviewPage = () => {
  return <div>
    <div className="text-center">
      <img src={img} />
    </div>
    <Autocomplete />
    <StockList />
  </div>
}