import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import CircleLoader from "./CircleLoader";

type FormValues = {
  old_password:string;
  new_password:string;
  confirm_password:string;
};

export function UpdatePassword() {
  const { user, updateUser } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      old_password:"",
      new_password:"",
      confirm_password:"",
    },
  });

  
  const onSubmit = async (data: FormValues) => {
    // const formData = new FormData();

    if (!data.old_password) {
      toast.error("please enter old password")
      return;
    }

    
    if (!data.new_password) {
        toast.error("please enter new password")
        return;
    }

    if (!data.confirm_password) {
        toast.error("please enter confirm password")
        return;
    } 

    if(data.new_password !== data.confirm_password){
        toast.error("confirm password doesn't  matches")
        return;
    }
    console.log(data)
    

    try {
      setLoading(true);
      console.log("hii")
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/users/updatePassword`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        toast.success("password updated successfully!");

        // Update the user context with the new data
        localStorage.setItem("userData",JSON.stringify(response.data))
    
        // Close the dialog
        setOpen(false);
      } else {
        toast.error("Failed to update password");
      }
    } catch (error: any) {
        console.error(`Error: ${error.response?.data?.message || error.message}`)
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild><Button variant="secondary">Update Password</Button></DrawerTrigger>
  <DrawerContent className="w-full bg-gray-800 px-4">
    <DrawerHeader>
      <DrawerTitle>Update Password</DrawerTitle>
      <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
    </DrawerHeader>
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="old_password" className="text-right">
               Old Password
            </Label>
            <Input id="old_password" className="col-span-3" {...register("old_password")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new_password" className="text-right">
               New Password
            </Label>
            <Input id="new_password" className="col-span-3" {...register("new_password")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_password" className="text-right">
               Confirm Password
            </Label>
            <Input id="confirm_password" className="col-span-3" {...register("confirm_password")} />
          </div>
          <DrawerFooter>
            <Button type="submit">
            { loading ?  <span className="gap-x-2 flex justify-center items-center"><CircleLoader/> updating password</span> : "Update Password"}
            </Button>
          </DrawerFooter>
        </form>
  </DrawerContent>
</Drawer>

    </>
  );
}
