import axios from "axios";

let TOKEN = "cgd20g1r01qum7u5quagcgd20g1r01qum7u5qub0"
export default axios.create({
    baseURL: "https://finnhub.io/api/v1",
    params:{
        token: TOKEN
    }
})