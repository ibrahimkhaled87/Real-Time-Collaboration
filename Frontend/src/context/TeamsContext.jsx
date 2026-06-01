import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import useTokenDecode from "../hooks/useTokenDecode";
import api from "../utils/axios";

const TeamsContext = createContext();

export function TeamsProvider({children}) {
    const payload = useTokenDecode();
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        if(!payload) return;

        const getData = async() => {
            const response = await api.get("/teams", {params: {current:payload.username}})
            setTeams(response.data);
        }
        getData();
    }, [payload])

    return (
        <TeamsContext.Provider value={{ teams, setTeams }}>
            {children}
        </TeamsContext.Provider>
    );
}


export function useTeams() {
    const context = useContext(TeamsContext);

    return context;
}