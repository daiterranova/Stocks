import { createContext, useState } from "react";

export const WatchListContext = createContext();

export const WatchListContextProvider = ({ children }) => {

    const [watchList, setWatchList] = useState(["GOOGL", "MSFT", "AMZN"]);

    return (
        <WatchListContext.Provider value={watchList}>
            {children}
        </WatchListContext.Provider>
    )
}