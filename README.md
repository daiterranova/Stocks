# Stocks

## Initialize project

After cloning or fork the project, run the following command on the terminal to install dependencies:

```
npm install
```

Then, run the project with this command:

```
npm run dev
```

## Create the project from scratch

Run the following commands in order of apperance:

```
npm create vite@latest stocks -- --template react
```

```
npm install
```

```
npm run dev
```

The first command creates a template project, the second one install all dependencies and the last one builds the project and you can see it in the http://localhost:5173/.
We can make a first commit to remove the default content of the `App.jsx`, `index.css`, `App.css` files.

### Styles

We will be using **Bootstrap's library** for styling.
Go to [Bootstrap's library](https://getbootstrap.com/docs/5.3/getting-started/introduction/) site, copy the CDN CSS's link and add it to the `<head>` section of your html file.

### React Router DOM

For navigation between pages, we have to install React Router DOM package:

```
npm i react-router-dom
```

### Routing and Project Basic Structure

Inside of the **src** folder, create a new folder call pages, and inside of it add two files called `StockDetailPage.jsx` and `StockOverviewPage.jsx`

In the `App.jsx` file, create the routing for our app:

```
 <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StockOverviewPage/>}/>
          <Route path="/detail/:symbol" element={<StockDetailPage/>}/>
        </Routes>
      </BrowserRouter>
    </main>
```

So, when we navigate to `/`, we will be rendering the home page and when we navigate to `/detail/:symbol ` path, we will be rendering the detail of the stock in matter, defined by the symbol variable specified in the url (e.g: 'mft' will show the microsoft stock's graph).

In addition, inside of the `src` folder, create a new folder called `components`, where will be contained it all the components of our app:

- StockList (table to show the stocks)
- Autocomplete (logo and searchbar)

Inside in each component, return a div with the name of the component, export them and import them in the `StockOverviewPage`.

### Fetching Data from finnHub's API

First, install axios dependency inside of your local folder's project:

```
  npm i axios
```

Then, in a new folder called apis, create a file 'finnHub.js' and import axios.
Create a new instance with axios to specify the endpoint of the API that we'll be using on our `StockList` component.

```
import axios from "axios";

export default axios.create({
    baseURL: "https://finnhub.io/api/v1"
})

```

According to the documentation of [Finnhub's API](https://finnhub.io/docs/api), the request needs a token parameter `token=apiKey` in the URL, in order to get the stock that we want to show.
You can generate your apiKey register in the [API's Platform](https://finnhub.io/register)
The way to access to the data will be through the quote and the symbol as an argument:
`URL/quote?symbol=AAPL&token=apiKey`.

So, in addition to the baseURL, we define a second parameter that will be the object params with a property token that receives the apiKey as a value:

```
  const TOKEN = 'apiKey'
  export default axios.create({
      baseURL: "https://finnhub.io/api/v1",
      params: {
        token: TOKEN
      }
  })
```

Then, in the Stocklist component:

1. Import the `finnHub` file.
2. Create an useEffect hook to fetch the data with an asynchronous function. The response will have the following sections:

- in the `try` part: return the `finnHub` baseURL and with the get method, add the endpoint `/quote` as the first parameter, and as the second one, the object params with a property symbol and its value will be receive every stock. In order to get that, we use `Promise.all` to map the watchList array.

```
  const responses = await Promise.all(watchList.map((stock) => {
                      return finnHub.get('/quote', {
                          params:{
                              symbol:stock
                          }
                      })
                  }))
```

Now we get the whole response and we only want the data from that object, so again we storage our data mapping through the array of responses and return the following object:

```
              const data =  responses.map((response)=>{
                 return {
                      data: response.data,
                      symbol: response.config.params.symbol
                  }

               })
```

For avoid fetching the data in every render, we establish the condition that only when the variable `isMounted` is true, we `setStock` with the `data`.

- we catch the error

```
  catch(err){

          }
```

- we call to `fetchData`
- we return an arrow function that sets again to the variable `isMounted` to false.

### Rendering Table of Stocks

Inside of the `StockList` component, return a `<table>` and for styling use the bootstrap's classes.

- the `<thead>`:
  ```
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
  ```
- the `<tbody>`
  ```
  stock.map((stockData) =>{
                           return (
                            <tr className="table-row" key={stockData.symbol}>
                                <th scope="row">{stockData.symbol}</th>
                                <td>{stockData.data.c}</td>
                                <td>{stockData.data.d}</td>
                                <td>{stockData.data.dp}</td>
                                <td>{stockData.data.h}</td>
                                <td>{stockData.data.l}</td>
                                <td>{stockData.data.o}</td>
                                <td>{stockData.data.pc}</td>
                            </tr>
                           )
                        })
  ```

We add the class `thead-color` inside of the `index.css` file in order to change the default color of the table:

```
.thead-color{
    color: rgb(79, 89, 102);
}
```

#### Set color for changes columns

To show the change columns in green when the change is rising or red with the change is decreasing, we will create a function that applies a bootstrap's color text class depending on the value of `change`:

```
   const changeColor = (change) => {
       return change > 0 ? "success" : "danger"
    }
```

On both rows:

```
 <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d}</td>
 <td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp}</td>
```

#### Adding bootstrap icons

Install `react-icons` dependency:

```
npm install react-icons --save
```

Once installed, go to [Bootstrap Icons](https://react-icons.github.io/react-icons/icons?name=bs), copy the name of the two icons that we need, and import them in the `StockList` file:

```
import { BsFillCaretUpFill, BsFillCaretDownFill} from "react-icons/bs"
```

And now we will create another function to render the proper icon depending on the change status: if goes down, we return `<BsFillCaretDownFill>`, if goes up `<BsFillCaretUpFill>`.

```
const renderIcon = (change) => change > 0 ? <BsFillCaretUpFill/> : <BsFillCaretDownFill/>;
```

### Autocomplete Search Component

Create the basic structure of the component:

```
<div>
  <div>
    <input>
    <label>
    <ul>
      <li>
      <li>
      <li>
    <ul>
  </div>
</div>
```

For styling, we will using bootstrap's classes to create a controlled form:

```
<div className="w-50 p-5 rounded mx-auto">
            <div className="form-floating dropdown">
                <input style={{backgroundColor: 'rgba(145, 158, 171, 0.04)'}}
                id="search" type="text" className="form-control" placeholder="Search" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                <label htmlFor="search">Search</label>
                <ul className="dropdown-menu">
                    <li>stock1</li>
                    <li>stock2</li>
                    <li>stock3</li>
                </ul>
            </div>
        </div>
```

#### Fetch data for dropdown menu

Simmilar to the `<Stocklist/>` component, we'll create a useEffect to fetch the data using the baseURL + `'/search'` as the endpoint, and as the second parameter, we will pass the object params that receives the value of search (giving by the user)

```
const response = await finnHub.get("/search", {
                    params: {
                        q: search
                    }
                })
```

Once we get the response, we establish the condition to set that data on our results state variable only when the component is mounted.

```
 try {
                const response = await finnHub.get("/search", {
                    params: {
                        q: search
                    }
                })
                if (isMounted) {
                    setResults(response.data.result)
                }
            }
            catch (err) {

            }
```

In addition, we establish that we only fetch the data when search has some value, if is not, we reset the state to an empty array.

```
if (search.length > 0) {
            fetchData()
        }
        else {
            setResults([])
        }
```

Finally, this useEffect will be executed only when the value of `search` changes, so we pass to the hook search as a second parameter.

Our code will be looking like this:

```
    useEffect(() => {
        let isMounted = true
        const fetchData = async () => {
            try {
                const response = await finnHub.get("/search", {
                    params: {
                        q: search
                    }
                })
                if (isMounted) {
                    setResults(response.data.result)
                }
            }
            catch (err) {

            }
        }
        if (search.length > 0) {
            fetchData()
        }
        else {
            setResults([])
        }

    }, [search])
```

#### Render dropdown results

For render the dropdown menu, we'll be using a function that will assign a class based on the value of `search`.

Define a variable that stores which class will be assigned is search is true or false.

```
const dropDownClass = search ? "show" : null
```

Return the list, mapping the results with the description and the symbol value for every stock:

```
return (
            <ul style={{
                height: "500px",
                overflowY: "scroll",
                overflowX: "hidden",
                cursor: "pointer"
            }}
                className={`dropdown-menu ${dropDownClass}`}>
                {
                    results.map((result) => {
                        console.log(result)
                        return (
                            < li key={result.symbol} className="dropdown-item" >
                                {result.description}  ({result.symbol})
                            </li>
                        )
                    })
                }
            </ul >
        )
```

Call the function `renderDropDown` in the return of the component.

```
  {renderDropDown()}
```

### Context API

Because we want that everytime the user searchs for a stock and it is displayed on the dropdown menu, when the user clicks the stock, it must be added to the stocklist.
To communicate both components ( `Autocomplete` and `StockList`), we'll create a component `Provider`, giving it access to information so he can passes to other components as a props.

- In the **src** folder's menu, create a folder called **context**.
- Inside of it, create a new file component: `watchListComponent.jsx`.
- Import from React's Library `{createContext}` and create the context:

```
export const watchListContext = createContext();
```

- Then, create a provider component and return the context using the provider component as a wrapper:

```
export const WatchListContextProvider = ({  }) => {
    return (
        <WatchListContext.Provider >
        </WatchListContext.Provider>
    )
}
```

We pass to our component the `children` props, so we can render any component or element that our passed in as a child.
In our case, we want to access to the WatchList from the StockList component. So, we put it inside of the Provider and pass it as a value

```
export const WatchListContextProvider = ({ children }) => {

    const [watchList, setWatchList] = useState(["GOOGL", "MSFT", "AMZN"]);

    return (
        <WatchListContext.Provider value={watchList}>
            {children}
        </WatchListContext.Provider>
    )
}
```

- In the App.js file, wrap the entire App with the Provider component:

```
<main className="container">
      <WatchListContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StockOverviewPage />} />
            <Route path="/detail/:symbol" element={<StockDetailPage />} />
          </Routes>
        </BrowserRouter>
      </WatchListContextProvider>
    </main>
```

- In the StockList component, import the `useContext` hook and using destructuring grab the value of watchList making use of the hook:

```
const { watchList } = useContext(WatchListContext);
```

#### Adding stock

When the user make a search on the search input, and we show the matches on the dropdown menu, if the user clicks on one of the results, we want to added it to the stock list.
So, create a function to handle the onClick event that we'll be setting on the element `<li>` of our dropdown menu.

```
 const addStock = (stock) => {
        if (!watchList.includes(stock)) {
            setWatchList([...watchList, stock])
        }
    }
```

Let's breaking in this down:

- `stock` represents the result selected by the user when clicks on it.
- if the list doesn't includes this result, then we added it to the list, setting the watchList variable with the content of the current list plus the result selected.

In the Autocomplete component, we add the onClick event listener:

```
 < li key={result.symbol} className="dropdown-item" onClick={() => {
                                addStock(result.symbol)
                                setSearch("")
                            }}
```

Note: we set again the search variable to an empty string because after the user clicks on the result and this one is added to the table, we want to close the dropdown menu, and we achieve returning the state as it was at the beginning.

#### Delete stock

For now, we only create the function to eliminate a stock from the list:

```
 const deleteStock = (stock) => {
        const filteredList = watchList.filter((el) => {
            return el !== stock
        })
        setWatchList(filteredList)
    }
```

Using the `filter` method, we go through the watchList array and return it except of the selected stock.
We set the value of the `watchList` variable to this new filtered list.

### useNavigate Hook

When the user clicks on a row, we want to be re-directed to the detail of the stock.
In order to achieve it, we import the `useNavigate` hook on `StockList` component, and inside of the function, we store the hook in a varible:

```
import { useNavigate } from "react-router-dom"

const navigate = useNavigate();

```

Then, we create a handle function that receives the symbol of the stock and, with it, we call the hook passing the route based on the correspondent symbol:

```
 const handleStockSelect = (symbol) => {
        navigate(`detail/${symbol}`)
    }
```

Finally, pass the handle function inside of the row's stock:

```
<tr style={{ cursor: "pointer" }} onClick={() => handleStockSelect(stockData.symbol)} className="table-row" key={stockData.symbol}>
```

### Fetching historical data

Inside of the `StockDetailPage` component:

First, import `useParams` hook to extract the **symbol**:

```
const { symbol } = useParams()
```

Then, we implement a **useEffect** hook to fetch the data:

- Create a date object `const date = new Date()`
- Get the current time ```const currentTime = Math.floor(date.getTime() / 1000)````
- Establish the necessary conditions to contemplate the weekend days when there are no new quotes.

```
if (day === 6) { // saturday
                oneDay = currentTime - 2 * 24 * 60 * 60
            }
            else if (day === 0) { //sunday
                oneDay = currentTime - 3 * 24 * 60 * 60
            }
            else {
                oneDay = currentTime - 24 * 60 * 60
            }
```

- Using **Promise.all** and taking into account the finnhub endpoint for the [stock candles](https://finnhub.io/docs/api/stock-candles), we get the data that we need hitting to the **/stock/candle's endpoint** as the first parameter, and as the second one, the object params with the required arguments (symbol,from,to,resolution). We fetch three requests to obtain the historical data of a day, a week and a year.

```

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
```

#### Formatting data

Now that we have the responses we need, we store them on a new state variable `chartData`, and inside of the useEffect we set the variable with an object with the properties day,week and year, and each one of them calls the **formatData** function that receives the data property for every request made it.

Outside of the StockDetailPage component, we create the formatData function:

```
const formatData = (data) => {
    return data.t.map((el, index) => {
        return {
            x: el * 1000,
            y: data.c[index]
        }
    })

}
```

The previous function mapping through the `data.t` property (corresponding to the timestamp of the stock) takes every timestamp and multiplies it for 1000 (because the API receives the time on miliseconds), and then assigns to the `x` property on the returned object. Overmore, the `y` property on the same object, receives as a value the `data.c` (corresponding to the close price) accordingly to the index that is being mapped.

So, we create an object that matches the timestamp with the closest price of the stock requested, and within this format, we set the state variable `chartData` to consider the period of time it pretends to show (a day, a week or a year).

### Creating chart

We'll be using the [Apex Charts Library](https://apexcharts.com/) for showing the graph of the selected stock, implementing the integration for [React Charts](https://apexcharts.com/docs/react-charts/).

First, install the following dependencies:

```
npm install apexcharts
```

```
npm install --save react-apexcharts apexcharts
```

Then, create a new file and component called `StockChart.jsx`.

Import the `Chart` component from react-apexcharts.

Destructure the properties `day, week and year` from the `chartData` variable.

Now, we'll customize the chart based on what we want to render:

- title
- chart
- colors
- date format

```
 const options = {
        //colors: [color],
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
```

Note: we'll configure color to show the corresponding color depending on whether the stock goes up or down. For now we leave the line of code commented.

For additional information, you can go to the docs for options on the [apexcharts' web page](https://apexcharts.com/docs/options/).

Return the `Chart` component and pass it the **options** property with the value of **options** object.

Now we'll create the buttons so the user can choose between different periods of historical data stock.

```
<div>
           <button>24 hs</button>
           <button>7 days</button>
           <button>1 Year</button>
</div>
```

When the user clicks on one of them, we want to display the proper data. Therefore, we can create a function to determine which information is shown.

Before of our function, create a state variable `dateFormat` and initialize it with a value of **'24hs'**.

Now on the `onClick` method of every button, set the state of the dateFormat variable with the value of every period of time:

```
<div>
            <button onClick={() => { setDateFormat("24h") }}>24 hs</button>
            <button onClick={() => { setDateFormat("7D") }}>7 days</button>
            <button onClick={() => { setDateFormat("1Y") }}>1 Year</button>
        </div>
```

Now we evaluate every case with a switch statement:

```
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
```

Create the object `series` with the following properties:

```
  const series = [{
        name: symbol,
        data: determineTimeFormat()
    }]
```

And pass it to the `Chart` component.

```
 <Chart options={options} series={series} type="area" width="100%" />
```

For the color of the buttons, we make this function:

```
    const renderButtonSelect = (button) => {
        const classes = "btn m-1 "
        if (button === dateFormat) {
            return classes + "btn-primary"
        } else {
            return classes + "btn-outline-primary"
        }
    }
```

And pass it to every button:

```
 <div>
            <button className={renderButtonSelect("24h")} onClick={() => { setDateFormat("24h") }}>24 hs</button>
            <button className={renderButtonSelect("7d")} onClick={() => { setDateFormat("7D") }}>7 days</button>
            <button className={renderButtonSelect("1y")} onClick={() => { setDateFormat("1Y") }}>1 Year</button>
```

`renderButtonSelect` assigns to all the buttons the bootstrap's classes `btn m-1` and, according to which button is active selected (what is defined by the value of dateFormat("24h, 7d or 1y")), add the class `btn-primary` or `btn-outline-primary`.

For the color of the graph area depending on the value of the stock:

```
    const color = determineTimeFormat()[determineTimeFormat().length - 1].y - determineTimeFormat()[0].y > 0 ? "#00FF00" : "#FF0000"
```

Let's break it down this logic:

- `determineTimeFormat()` returns the object `day, year or week` depending on the value that receives from `dateFormat`.

- For every period (day, week or year), to determine if the stock is going down or up, we can compare the oldest input with the newest input. So, we grab the newest value with `determineTimeFormat()[determineTimeFormat().length - 1].y` and compare it against the oldest value of the array `determineTimeFormat()[0].y`

```
determineTimeFormat()[determineTimeFormat().length - 1].y - determineTimeFormat()[0].y
```

- With a ternary operator we evaluate if the result of the statement is greater than 0 (goes up), return **green color**; else, return **red color**

```
    const color = determineTimeFormat()[determineTimeFormat().length - 1].y - determineTimeFormat()[0].y > 0 ? "#00FF00" : "#FF0000"
```

Now, we can uncomment the line inside of the **options** object:

```
const options = {
        colors: [color]
```

### Stock Data component

In the `StockDetailPage`, besides the stock chart, we want to show additional information of the selected stock.

In order to do that, create a new component `<StockData/>` that receives the `symbol` prop.

Inside of it, create a useEffect hook for fetch the data from the finnHub API, following the instructions of the section [Company Profile 2](https://finnhub.io/docs/api/company-profile2)

```
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await finnHub.get("stock/profile2", {
                    params: {
                        symbol
                    }
                })
                if (isMounted) {
                    setStockData(response.data)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
        return () => (isMounted = false)
    }, [symbol])
```

#### Considerations:

- We want that this useEffect executes every time that `symbol` changes, therefore, we pass it the prop as a second parameter.
- We store the response in a state variable called `stockData`, through the `setStockData` function only when isMounted is true, so we only fetch the date when the component is mounted.
- isMounted changes its value to false when the component is unmounted.

Now that we have the data, we return a row using bootstrap's classes for styling:

```
 <div className="row border bg-white rounded shadow-sm p-4 mt-5">
                    <div className="col">
                        <div>
                            <span className="fw-bold">name: </span>
                            {stockData.name}
                        </div>
                        <div>
                            <span className="fw-bold">country: </span>
                            {stockData.country}
                        </div>
                        <div>
                            <span className="fw-bold">ticker: </span>
                            {stockData.ticker}
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <span className="fw-bold">Exchange: </span>
                            {stockData.exchange}
                        </div>
                        <div>
                            <span className="fw-bold">Industry: </span>
                            {stockData.finnhubIndustry}
                        </div>
                        <div>
                            <span className="fw-bold">IPO: </span>
                            {stockData.ipo}
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <span className="fw-bold">MarketCap: </span>
                            {stockData.marketCapitalization}
                        </div>
                        <div>
                            <span className="fw-bold">Shares Outstanding: </span>
                            {stockData.shareOutstanding}
                        </div>
                        <div>
                            <span className="fw-bold">url: </span>
                            <a href={stockData.weburl}>{stockData.weburl}</a>
                        </div>
                    </div>
                </div>
```

Bear in mind that this table is shown when there's data (that means when `stockData` is true).

Following, import the component on the `StockDetailPage` component and returned it like this:

```
    <StockData symbol={symbol} />
```

### Logo image

Finally, in our `StockOverviewPage` file, import the **trading** logo `import img from "../images/trading.jpg" ` and return it inside of the component:

```
 return <div>
    <div className="text-center">
      <img src={img} width="400" />
    </div>
```
