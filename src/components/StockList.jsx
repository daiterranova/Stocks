import { useState, useEffect, useContext } from "react"
import finnHub from "../apis/finnHub"
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs"
import { WatchListContext } from "../context/watchListComponent"
import { useNavigate } from "react-router-dom"

export const StockList = () => {
    const [stock, setStock] = useState([])
    const { watchList, deleteStock } = useContext(WatchListContext);
    const changeColor = (change) => change > 0 ? "success" : "danger";
    const navigate = useNavigate();
    const renderIcon = (change) => change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;

    const handleStockSelect = (symbol) => {
        navigate(`detail/${symbol}`)
    }

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const responses = await Promise.all(watchList.map((stock) => {
                    return finnHub.get('/quote', {
                        params: {
                            symbol: stock
                        }
                    })
                }))
                const data = responses.map((response) => {
                    return {
                        data: response.data,
                        symbol: response.config.params.symbol
                    }

                })
                if (isMounted) {
                    setStock(data)
                }
            }
            catch (err) {

            }
        }
        fetchData()
        return () => (isMounted = false)
    }, [watchList])


    return (
        <div>
            <table className="table hover mt-5">
                <thead className="thead-color">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Last</th>
                        <th scope="col">Chg</th>
                        <th scope="col">Chg%</th>
                        <th scope="col">High</th>
                        <th scope="col">Low</th>
                        <th scope="col">Open</th>
                        <th scope="col">Pclose</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stock.map((stockData) => {
                            return (
                                <tr style={{ cursor: "pointer" }} onClick={() => handleStockSelect(stockData.symbol)} className="table-row" key={stockData.symbol}>
                                    <th scope="row">{stockData.symbol}</th>
                                    <td>{stockData.data.c}</td>
                                    <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d}{renderIcon(stockData.data.d)}</td>
                                    <td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp}{renderIcon(stockData.data.d)}</td>
                                    <td>{stockData.data.h}</td>
                                    <td>{stockData.data.l}</td>
                                    <td>{stockData.data.o}</td>
                                    <td>{stockData.data.pc} <button className="btn btn-danger btn-sm ml-3 d-inline-block delete-button" onClick={(e) => {
                                        e.stopPropagation()
                                        deleteStock(stockData.symbol)
                                    }}>Remove</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}