"use client";

import { useState, useEffect } from "react";
import PersonalDetailsTab from "@/components/profile/PersonalDetailsTab";

export default function ProfileDetailsPage() {
    const [userName, setUserName] = useState("IndiNest Member");
    const [userEmail, setUserEmail] = useState("member@indinest.com");

    useEffect(() => {
        setUserName(localStorage.getItem("userName") || "IndiNest Member");
        setUserEmail(localStorage.getItem("userEmail") || "member@indinest.com");
    }, []);

    const handleUpdateInfo = (name: string, email: string) => {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        setUserName(name);
        setUserEmail(email);
        window.dispatchEvent(new Event("auth-change"));
    };

    return (
        <PersonalDetailsTab
            userName={userName}
            userEmail={userEmail}
            onUpdateInfo={handleUpdateInfo}
        />
    );
}
