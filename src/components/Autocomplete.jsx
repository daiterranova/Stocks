import { useEffect, useState } from "react"
import finnHub from "../apis/finnHub"

export const Autocomplete = () => {
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await finnHub.get("/search", {
                    params: {
                        q: search
                    }
                })
            }
            catch (err) {

            }
        }
        if (search.length > 0) {
            fetchData()
        }

    }, [search])

    return (
        <div className="w-50 p-5 rounded mx-auto">
            <div className="form-floating dropdown">
                <input style={{ backgroundColor: 'rgba(145, 158, 171, 0.04)' }}
                    id="search" type="text" className="form-control" placeholder="Search" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                <label htmlFor="search">Search</label>
                <ul className="dropdown-menu">
                    <li>stock1</li>
                    <li>stock2</li>
                    <li>stock3</li>
                </ul>
            </div>
        </div>
    )
}