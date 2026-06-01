import { useState, useEffect } from "react";
import useTokenDecode from "./useTokenDecode";
import api from "../utils/axios";

export function useFetchTeamBoards(team) {
    const [boards, setBoards] = useState([]);
    useEffect(() => {
        if(!team) return;

        const getData = async() => {
            const response = await api.get(`/teams/${team}/boards`);
            setBoards(response.data);
        }
        getData();
    }, [team])

    return {boards, setBoards};
}

export function useFetchTeamMessages() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const getData = async() => {
            const response = await api.get(`/teams/${1}/messages`);
            setMessages(response.data);
        }
        getData();
    }, [])

    return {messages, setMessages};
}

export function useFetchTeamMembers(team) {
    const [members, setMembers] = useState([]);
    useEffect(()=> {
        if(!team) return;

        const getData = async() => {
            const response = await api.get(`/teams/${team}/members`);
            setMembers(response.data);
        }
        getData();
    }, [team])

    return {members, setMembers}
}

export function useFetchNotifications(user) {
    const [notifications, setNotifications] = useState([]);
    useEffect(()=> {
        if(!user) return;

        const getData = async() => {
            const response = await api.get(`/users/${user}/notifications`);
            setNotifications(response.data);
        }
        getData();
    }, [user])

    return {notifications, setNotifications};
}