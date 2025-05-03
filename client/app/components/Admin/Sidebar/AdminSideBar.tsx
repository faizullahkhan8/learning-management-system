import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css"; // Added CSS import
import { Box, IconButton, Typography } from "@mui/material";

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

const Item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
    const { theme } = useTheme();

    return (
        <MenuItem
            active={selected === title}
            onClick={() => setSelected(title)}
            href={to}
            icon={icon}
        >
            <Typography
                className="!text-[15px] !font-Poppins"
                sx={{ color: theme === "dark" ? "#ffffffc1" : "#000" }}
            >
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
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const logoutHandler = () => {
        setLogout(true);
    };

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${
                        theme === "dark"
                            ? "#111C43 !important"
                            : "#fff !important"
                    }`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 28px !important",
                    color: `${theme === "dark" ? "#ffffffc1" : "#000"}`,
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
                "& .pro-menu-item": {
                    color: `${theme !== "dark" && "#000"}`,
                },
            }}
        >
            <Sidebar
                collapsed={isCollapsed}
                rootStyles={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: isCollapsed ? "0%" : "16%",
                    backgroundColor: theme === "dark" ? "#111C43" : "white",
                }}
            >
                <Menu>
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={
                            isCollapsed ? (
                                <ArrowForwardIos
                                    style={{
                                        color:
                                            theme === "dark"
                                                ? "#ffffffc1"
                                                : "#000",
                                    }}
                                />
                            ) : undefined
                        }
                        style={{ margin: "10px 0 20px 0" }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Link href="/">
                                    <h3
                                        style={{
                                            fontSize: "25px",
                                            fontFamily: "Poppins",
                                            color:
                                                theme === "dark"
                                                    ? "#ffffffc1"
                                                    : "#000",
                                        }}
                                    >
                                        Elearning
                                    </h3>
                                </Link>
                                <IconButton
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="inline-block"
                                >
                                    <ArrowBackIos
                                        style={{
                                            color:
                                                theme === "dark"
                                                    ? "#ffffffc1"
                                                    : "#000",
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>
                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <Image
                                    alt="profile-user"
                                    width={100}
                                    height={100}
                                    src={
                                        user.avatar
                                            ? user.avatar.url
                                            : DefaultAvatar
                                    }
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                        border: "3px solid #5b6fe6",
                                    }}
                                />
                            </Box>
                            <Box textAlign={"center"}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        m: "10px 0 0 0",
                                        color:
                                            theme === "dark"
                                                ? "#ffffffc1"
                                                : "#000",
                                    }}
                                    className="!text-[20px]"
                                >
                                    {user?.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        m: "10px 0 0 0",
                                        color:
                                            theme === "dark"
                                                ? "#ffffffc1"
                                                : "#000",
                                    }}
                                    className="!text-[20px]"
                                >
                                    - {user?.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to="/admin"
                            icon={
                                <HomeOutlined className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            sx={{
                                m: "15px 0 5px 25px",
                                color: theme === "dark" ? "#ffffffc1" : "#000",
                            }}
                            className="!text-[18px] !font-[400]"
                        >
                            {!isCollapsed && "Data"}
                        </Typography>
                        <Item
                            title="Users"
                            to="/admin/users"
                            icon={
                                <Groups className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Invoices"
                            to="/admin/invoices"
                            icon={
                                <ReceiptOutlined className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className="!text-[18px] text-black dark:text-[#ffffffc1] !font-[400]"
                        >
                            {!isCollapsed && "Content"}
                        </Typography>
                        <Item
                            title="Create Course"
                            to="/admin/create-course"
                            icon={
                                <VideoCall className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Live Course"
                            to="/admin/live-course"
                            icon={
                                <OndemandVideo className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className="!text-[18px] text-black dark:text-[#ffffffc1] !font-[400]"
                        >
                            {!isCollapsed && "Customization"}
                        </Typography>
                        <Item
                            title="Hero"
                            to="/admin/hero"
                            icon={
                                <Web className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="FAQ"
                            to="/admin/faq"
                            icon={
                                <Quiz className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Categories"
                            to="/admin/categories"
                            icon={
                                <Wysiwyg className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className="!text-[18px] text-black dark:text-[#ffffffc1] !font-[400]"
                        >
                            {!isCollapsed && "Controller"}
                        </Typography>
                        <Item
                            title="Team"
                            to="/admin/team"
                            icon={
                                <PeopleOutlined className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className="!text-[18px] text-black dark:text-[#ffffffc1] !font-[400]"
                        >
                            {!isCollapsed && "Analytics"}
                        </Typography>
                        <Item
                            title="Course Analytics"
                            to="/admin/course-analytics"
                            icon={
                                <BarChartOutlined className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Order Analytics"
                            to="/admin/orders-analytics"
                            icon={
                                <MapOutlined className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Users Analytics"
                            to="/admin/users-analytics"
                            icon={
                                <ManageHistory className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 25px" }}
                            className="!text-[18px] text-black dark:text-[#ffffffc1] !font-[400]"
                        >
                            {!isCollapsed && "Extras"}
                        </Typography>
                        <Item
                            title="Settings"
                            to="/admin/settings"
                            icon={
                                <Settings className="text-black dark:text-white" />
                            }
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <div onClick={logoutHandler}>
                            <Item
                                title="Logout"
                                to="/"
                                icon={
                                    <ExitToApp className="text-black dark:text-white" />
                                }
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    );
};

export default AdminSideBar;
