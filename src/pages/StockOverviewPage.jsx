import { StockList } from "../components/StockList"
import { Autocomplete } from "../components/Autocomplete"
import img from "../images/trading.jpg"

export const StockOverviewPage = () => {
  return <div>
    <div className="text-center">
      <img src={img} width="400" />
    </div>
    <Autocomplete />
    <StockList />
  </div>
}