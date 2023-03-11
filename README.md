# Stocks

## Initialize project

After cloning or fork the project, run the following command to install dependencies on the terminal:

```
npm install
```
Then, run the project with this command:

```
npm run dev
```

## Create the project from scratch

Run the following commands in the same order:

```
npm create vite@latest stocks -- --template react
```
```
npm install
```
```
npm run dev
```
The first commands creates a template project, the second one install all dependencies and the last one builds the project and you can see it in the http://localhost:5173/. 
We can make a first commit to remove the default content of the `App.jsx`, `index.css`, `App.css` files. 

### Styles

We will be using **Bootstrap's library** for styling.
Go to [Bootstrap's library](https://getbootstrap.com/docs/5.3/getting-started/introduction/ )site, copy the CDN CSS link and add it to the `<head>` section of your html file.

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
So, when we navigate to `/`, we will be rendering the home page and when we navigate to `/detail/:symbol ` path, we will be rendering the detail of the stock in matter, define by the symbol variable specify in the url (e.g: 'mft' will show the microsoft stock's graph).

In addition, inside of the `src` folder, create a new folder called `components`, where will be containing all the components of our app:

* StockList (table to show the stocks)
* Autocomplete (logo and searchbar)

Inside in each component, return a div with the name of the component, export them and import them in the `StockOverviewPage`. 
