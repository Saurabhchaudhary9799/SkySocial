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
export function EditProfile() {
    const { user, updateUser } = useUser();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            bio: user?.bio || "",
            profile_image: null,
            cover_image: null,
        },
    });
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    const handleFileChange = (event, fieldName) => {
        const file = event.target.files?.[0] || null;
        setValue(fieldName, file);
    };
    const onSubmit = async (data) => {
        const formData = new FormData();
        if (data.bio) {
            formData.append("bio", data.bio);
        }
        if (data.profile_image) {
            formData.append("profile_image", data.profile_image);
        }
        if (data.cover_image) {
            formData.append("cover_image", data.cover_image);
        }
        try {
            setLoading(true);
            const response = await axios.patch(`${BASE_URL}/api/v1/users`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user?.authToken}`,
                },
            });
            console.log(response);
            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                // Update the user context with the new data
                updateUser({
                    ...user,
                    bio: response.data.data.bio || user.bio,
                    profile_image: response.data.data.profile_image || user.profile_image,
                    cover_image: response.data.data.cover_image || user.cover_image,
                });
                // Close the dialog
                setOpen(false);
            }
            else {
                toast.error("Failed to update profile");
            }
        }
        catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs(Drawer, { open: open, onOpenChange: setOpen, children: [_jsx(DrawerTrigger, { asChild: true, children: _jsx(Button, { variant: "secondary", children: "Edit Profile" }) }), _jsxs(DrawerContent, { className: "w-full bg-gray-800 px-4", children: [_jsxs(DrawerHeader, { children: [_jsx(DrawerTitle, { children: "Edit profile" }), _jsx(DrawerDescription, { children: "Make changes to your profile here. Click save when you're done." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "bio", className: "text-right", children: "Bio" }), _jsx(Input, { id: "bio", className: "col-span-3", ...register("bio") })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "profile_image", className: "text-right", children: "Profile Image" }), _jsx(Input, { type: "file", id: "profile_image", className: "col-span-3", onChange: (e) => handleFileChange(e, "profile_image") })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "cover_image", className: "text-right", children: "Cover Image" }), _jsx(Input, { type: "file", id: "cover_image", className: "col-span-3", onChange: (e) => handleFileChange(e, "cover_image") })] }), _jsx(DrawerFooter, { children: _jsx(Button, { type: "submit", children: loading ? (_jsxs("span", { className: "gap-x-2 flex justify-center items-center", children: [_jsx(CircleLoader, {}), " saving changes"] })) : ("Save changes") }) })] })] })] }) }));
}
