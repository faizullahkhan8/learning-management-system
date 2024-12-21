import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidbar/dist/css/styles.css";

import {
    HomeOutlined,
    ArrowForwardIos,
    ArrowBackIos,
    PeopleOutlined,
    ReceiptOutlined,
    BarChartOutlined,
    MapOutlined,
    Groups,
    OndemandVideo,
    VideoCall,
    Web,
    Quiz,
    Wysiwyg,
    ManageHistory,
    Settings,
    ExitToApp,
} from "./Icons";

import DefaultAvatar from "@/public/images/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useState } from "react";

interface ItemProps {
    title: string;
    to: string;
    icon: React.JSX.Element;
    selected: string;
    setSelected: (selected: string) => void;
}

const item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
    return (
        <MenuItem
            active={selected === title}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography className="!text-[15px] !font-Poppins">
                {title}
            </Typography>
            <Link href={to} />
        </MenuItem>
    );
};

const AdminSideBar = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [logout, setLogout] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const logoutHandler = () => {
        setLogout(true);
    };

    return <div>AdminSideBar</div>;
};

export default AdminSideBar;
