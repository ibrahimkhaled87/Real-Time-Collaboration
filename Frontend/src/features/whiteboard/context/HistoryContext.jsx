import { createContext, useContext, useRef } from "react";

const HistoryContext = createContext();

export function HistoryProvider({children}) {
    const historyRef = useRef([]);
    const redoRef = useRef([]);

    return (
        <HistoryContext.Provider value={{historyRef, redoRef}}>
            {children}
        </HistoryContext.Provider>
    )
}

export function useHistory() {
    return useContext(HistoryContext);
}