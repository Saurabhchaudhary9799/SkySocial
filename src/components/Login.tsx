import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import CircleLoader from "./CircleLoader";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password:z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
})

const Login = () => {
const [loading ,setLoading] = useState(false)
const [passwordVisible, setPasswordVisible] = useState(false);
const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password:""
    },
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form submission
  const onSubmit = async (data:  z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response= await axios.post(`${import.meta.env.VITE_BASEURL}/api/v1/users/login`,data,{
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // console.log(response.data)
      localStorage.setItem("userData", JSON.stringify(response.data));

      // Display success toast
      toast.success("Login Successfully");

      // Navigate to the home page
      navigate("/");
   setLoading(false)
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred during login.");
      }
      console.error("Error submitting form data:", error);
  
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    

    
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
       
        
        <Button type="submit" className="w-full ">{ loading ? <span className="gap-x-2 flex justify-center items-center"><CircleLoader/> logging in</span> : "Login"}</Button>
      </form>
    </Form>
    
  );
};

export default Login;
