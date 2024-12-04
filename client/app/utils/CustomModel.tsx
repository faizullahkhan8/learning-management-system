/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

interface ICustomModelOptions {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    component: any;
    setRoute: (route: string) => void;
}

const CustomModel: FC<ICustomModelOptions> = ({
    open,
    setOpen,
    setRoute,
    component: Component,
}) => {
    return (
        <Modal
            style={{ width: "100%" }}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    );
};
export default CustomModel;
