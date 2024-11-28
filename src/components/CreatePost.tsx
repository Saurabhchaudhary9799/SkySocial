import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostContext } from "@/context/PostContext";
import CircleLoader from "./CircleLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// Define the Zod schema for form validation
const formSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  image: z.instanceof(File).nullable(),
  tags: z.string(), // Accept both File and null
});

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

const isCommaSeparated = (str: String) => {
 
  const trimmedStr = str.trim();

  if (!trimmedStr.includes(",")) {
    return false;
  }

  const wordsArray = trimmedStr.split(",").map((word) => word.trim());
  for (let word of wordsArray) {
    if (word === "" || word.includes(" ")) {
      return false;
    }
  }

  return true;
};
const CreatePost: React.FC = () => {
  const navigate = useNavigate()
  const { createPost } = usePostContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
 const [username,setUsername] = useState("")

 const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL :import.meta.env.VITE_PRODURL ;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      image: null,
      tags: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    form.setValue("image", file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    // console.log(values.tags)

    if (!isCommaSeparated(values.tags)) {
      toast.error("please put tags comma-separated like placeholder");
      return;
    }

    try {
      setLoading(true);
      await createPost(values.bio, values.tags, selectedFile);
      // Success toast
      toast.success("Post created successfully!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Failed to create post. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const exploreUser = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const authToken = userData ? JSON.parse(userData).authToken : null;
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/search-user`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data)
      if (response.status === 200) {
         toast.success("user found")
         navigate(`/${response.data.result[0].id}`)
         setUsername("")
      } else {
        toast.error("user not found");
      }
    } catch (error: any) {
      toast.error(`${error.message}`)
      console.error(error.message);
    }
  }

  return (
    <div className="flex items-center justify-between space-x-4 bg-gray-800 p-4 rounded-xl">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for friends, groups, pages"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="pr-10 text-white"
        />
        <Search onClick={exploreUser} className="absolute right-3 text-gray-400 cursor-pointer" size={18} />
      </div>

      {/* Add New Post Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-white text-black text-sm md:text-lg hover:bg-gray-200 rounded-2xl flex items-center space-x-2">
            <span>Add New Post</span>
            <span className="font-bold text-xl">+</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="text-black h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription className="text-black">
              
                Fill in the details and select a file if needed. Click save when
                you're done.

            </DialogDescription>
            <div className="grid gap-4 py-4">
              {/* Bio Input */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Bio" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* File Input */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="code,post,enjoy"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* File Preview */}
                  {selectedFile && (
                    <div className="col-span-4 mt-4">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-96 h-auto rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 "
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="gap-x-2 flex justify-center items-center">
                        <CircleLoader /> posting
                      </span>
                    ) : (
                      "post"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button className="bg-white text-black text-sm md:text-lg hover:bg-gray-200 rounded-2xl flex items-center space-x-2">
            <span>Add New Post</span>
            <span className="font-bold text-xl">+</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full   text-black  px-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>
              <p className="text-black">
                Fill in the details and select a file if needed. Click save when
                you're done.
              </p>
            </DialogDescription>
          </DialogHeader>
         
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default CreatePost;
