import axios from "axios";

let TOKEN = "cggt9g1r01qv7vi3iom0cggt9g1r01qv7vi3iomg"
export default axios.create({
    baseURL: "https://finnhub.io/api/v1",
    params:{
        token: TOKEN
    }
})