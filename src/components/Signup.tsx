import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircleLoader from "./CircleLoader";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  profile_image: z.instanceof(File).nullable(),
  cover_image: z.instanceof(File).nullable(),
});

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading ,setLoading] = useState(false)
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL :import.meta.env.VITE_PRODURL 
console.log('BASE_URL',BASE_URL);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      profile_image: null,
      cover_image: null,
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "profile_image" | "cover_image"
  ) => {
    const file = event.target.files?.[0] || null;
    form.setValue(fieldName, file); // Set the selected file to the appropriate field
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log("Form Data:", data);
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.profile_image) {
        formData.append("profile_image", data.profile_image);
      }
      if (data.cover_image) {
        formData.append("cover_image", data.cover_image);
      }
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("userData", JSON.stringify(response.data));
      // console.log(response.data);
      toast("Registered Succesfully");
      
      navigate("/");
      setLoading(false)
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred during registration.");
      }
      console.error("Error submitting form data:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={passwordVisible ? "text" : "password"} {...field} />
                </FormControl>
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <IoEye size={20} /> : <IoMdEyeOff size={20} />}
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "profile_image")}
                  accept="image/*"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "cover_image")}
                  accept="image/*"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
        { loading ?  <span className="gap-x-2 flex justify-center items-center"><CircleLoader/> Signing up</span> : "Signup"}
        </Button>
      </form>
    </Form>
  );
};

export default Signup;
