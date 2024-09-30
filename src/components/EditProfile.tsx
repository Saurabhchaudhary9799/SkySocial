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
  bio: string;
  profile_image: File | null;
  cover_image: File | null;
};

export function EditProfile() {
  const { user, updateUser } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      bio: user?.bio || "",
      profile_image: null,
      cover_image: null,
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "profile_image" | "cover_image"
  ) => {
    const file = event.target.files?.[0] || null;
    setValue(fieldName, file);
  };

  const onSubmit = async (data: FormValues) => {
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
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");

        // Update the user context with the new data
        updateUser({
          ...user!,
          bio: response.data.data.bio || user!.bio,
          profile_image:
            response.data.data.profile_image || user!.profile_image,
          cover_image: response.data.data.cover_image || user!.cover_image,
        });

        // Close the dialog
        setOpen(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild><Button variant="secondary">Edit Profile</Button></DrawerTrigger>
  <DrawerContent className="w-full bg-gray-800 px-4">
    <DrawerHeader>
      <DrawerTitle>Edit profile</DrawerTitle>
      <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
    </DrawerHeader>
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input id="bio" className="col-span-3" {...register("bio")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile_image" className="text-right">
              Profile Image
            </Label>
            <Input
              type="file"
              id="profile_image"
              className="col-span-3"
              onChange={(e) => handleFileChange(e, "profile_image")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cover_image" className="text-right">
              Cover Image
            </Label>
            <Input
              type="file"
              id="cover_image"
              className="col-span-3"
              onChange={(e) => handleFileChange(e, "cover_image")}
            />
          </div>
          <DrawerFooter>
            <Button type="submit">
            {loading ? (
                      <span className="gap-x-2 flex justify-center items-center">
                        <CircleLoader/> saving changes
                      </span>
                    ) : (
                      "Save changes"
                    )}
            </Button>
          </DrawerFooter>
        </form>
  </DrawerContent>
</Drawer>

    </>
  );
}
