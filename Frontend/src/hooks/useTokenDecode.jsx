import { useEffect, useState } from "react";

export default function useTokenDecode() {
    const [payload, setPayload] = useState();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            setPayload( JSON.parse(atob(token.split('.')[1])) );
        }
    }, [])

    return payload;
}