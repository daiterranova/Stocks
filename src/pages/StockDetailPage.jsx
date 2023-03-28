import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import finnHub from "../apis/finnHub"


const formatData = () => {

}

export const StockDetailPage = () => {

    const { symbol } = useParams()
    const [chartData, setChartData] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date()
            const currentTime = Math.floor(date.getTime() / 1000)
            let oneDay;
            let day = date.getDay();
            if (day === 6) { // saturday
                oneDay = currentTime - 2 * 24 * 60 * 60
            }
            else if (day === 0) { //sunday
                oneDay = currentTime - 3 * 24 * 60 * 60
            }
            else {
                oneDay = currentTime - 24 * 60 * 60
            }
            const oneWeek = currentTime - 7 * 24 * 60 * 60
            const oneYear = currentTime - 365 * 24 * 60 * 60

            try {
                const responses = await Promise.all([
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneDay,
                            to: currentTime,
                            resolution: 30
                        }
                    }),
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneWeek,
                            to: currentTime,
                            resolution: 60
                        }
                    }),
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneYear,
                            to: currentTime,
                            resolution: "M"
                        }
                    })
                ])
                setChartData({
                    day: formatData(responses[0].data),
                    week: formatData(responses[1].data),
                    year: formatData(responses[2].data)
                })

            }
            catch (err) {

            }
        }
        fetchData()
    }, [])


    return <div>StockDetailPage {symbol}</div>
} 