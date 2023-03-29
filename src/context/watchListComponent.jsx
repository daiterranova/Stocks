import { createContext, useState, useEffect } from "react";
import { StockList } from "../components/StockList";

export const WatchListContext = createContext();

export const WatchListContextProvider = ({ children }) => {

    const [watchList, setWatchList] = useState(["GOOGL", "MSFT", "AMZN"]);

    useEffect(() => {
        localStorage.setItem("watchList", watchList)
    }, [watchList])

    const addStock = (stock) => {
        if (!watchList.includes(stock)) {
            setWatchList([...watchList, stock])
        }
    }
    const deleteStock = (stock) => {
        const filteredList = watchList.filter((el) => {
            return el !== stock
        })
        setWatchList(filteredList)
    }
    return (
        <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
            {children}
        </WatchListContext.Provider>
    )
}