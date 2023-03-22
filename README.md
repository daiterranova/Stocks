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
Go to [Bootstrap's library](https://getbootstrap.com/docs/5.3/getting-started/introduction/ ) site, copy the CDN CSS's link and add it to the `<head>` section of your html file.

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

* StockList (table to show the stocks)
* Autocomplete (logo and searchbar)

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
  - in the `try` part:  return the `finnHub` baseURL and with the get method, add the endpoint `/quote`  as the first parameter, and as the second one, the object params with a property symbol and its value will be receive every stock. In order to get that, we use `Promise.all` to map the watchList array.

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

Inside of the `StockList` component, return a  `<table>` and for styling use the bootstrap's classes.
- the  `<thead>`:
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