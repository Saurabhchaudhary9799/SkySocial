import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import CircleLoader from "./CircleLoader";
export function UpdatePassword() {
    const { user, updateUser } = useUser();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
    });
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    const onSubmit = async (data) => {
        // const formData = new FormData();
        if (!data.old_password) {
            toast.error("please enter old password");
            return;
        }
        if (!data.new_password) {
            toast.error("please enter new password");
            return;
        }
        if (!data.confirm_password) {
            toast.error("please enter confirm password");
            return;
        }
        if (data.new_password !== data.confirm_password) {
            toast.error("confirm password doesn't  matches");
            return;
        }
        console.log(data);
        try {
            setLoading(true);
            console.log("hii");
            const response = await axios.patch(`${BASE_URL}/api/v1/users/updatePassword`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user?.authToken}`,
                },
            });
            console.log(response.data);
            if (response.status === 201) {
                toast.success("password updated successfully!");
                // Update the user context with the new data
                localStorage.setItem("userData", JSON.stringify(response.data));
                // Close the dialog
                setOpen(false);
            }
            else {
                toast.error("Failed to update password");
            }
        }
        catch (error) {
            console.error(`Error: ${error.response?.data?.message || error.message}`);
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs(Drawer, { open: open, onOpenChange: setOpen, children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { variant: "secondary", children: "Update Password" }) }), _jsxs(DrawerContent, { className: "w-full bg-gray-800 px-4", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Update Password" }), _jsx(DrawerDescription, { children: "Make changes to your profile here. Click save when you're done." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "old_password", className: "text-right", children: "Old Password" }), _jsx(Input, { id: "old_password", className: "col-span-3", ...register("old_password") })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "new_password", className: "text-right", children: "New Password" }), _jsx(Input, { id: "new_password", className: "col-span-3", ...register("new_password") })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "confirm_password", className: "text-right", children: "Confirm Password" }), _jsx(Input, { id: "confirm_password", className: "col-span-3", ...register("confirm_password") })] }), _jsx(DrawerFooter, { children: _jsx(Button, { type: "submit", children: loading ? _jsxs("span", { className: "gap-x-2 flex justify-center items-center", children: [_jsx(CircleLoader, {}), " updating password"] }) : "Update Password" }) })] })] })] }) }));
}
