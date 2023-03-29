import ApexCharts from 'apexcharts'
import { useState } from 'react'
import Chart from "react-apexcharts"

export const StockChart = ({ chartData, symbol }) => {
    const { day, week, year } = chartData
    const [dateFormat, setDateFormat] = useState('24h')
    const options = {
        title: {
            text: symbol,
            align: "center",
            style: {
                fontSize: "24px"
            }
        },
        chart: {
            id: "stock data",
            animations: {
                speed: 1300
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
                datetimeUTC: false
            }
        },
        tooltip: {
            x: {
                format: "MMM dd HH:MM"
            }
        }
    }
    const determineTimeFormat = () => {
        switch (dateFormat) {
            case "24h":
                return day;
            case "7D":
                return week;
            case "1Y":
                return year;
            default:
                return day;
        }
    }

    const series = [{
        name: symbol,
        data: determineTimeFormat()
    }]

    const renderButtonSelect = (button) => {
        const classes = "btn m-1 "
        if (button === dateFormat) {
            return classes + "btn-primary"
        } else {
            return classes + "btn-outline-primary"
        }
    }
    return <div className='mt-5 p-4 shadow-sm bg-white'>
        <Chart options={options} series={series} type="area" width="100%" />
        <div>
            <button className={renderButtonSelect("24h")} onClick={() => { setDateFormat("24h") }}>24 hs</button>
            <button className={renderButtonSelect("7d")} onClick={() => { setDateFormat("7D") }}>7 days</button>
            <button className={renderButtonSelect("1y")} onClick={() => { setDateFormat("1Y") }}>1 Year</button>
        </div>
    </div >

}
