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
import { BASE_URL } from "@/Config/socketConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Define the Zod schema for form validation
const formSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  image: z.instanceof(File).nullable(),
  tags: z.string(), // Accept both File and null
});

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>;

const isCommaSeparated = (str:string) => {
  const trimmedStr = str.trim();
  console.log(trimmedStr);

  // Check if the string contains at least one comma
  if (!trimmedStr.includes(",")) {
    return false;
  }

  // Split the string by commas and trim each word
  const wordsArray = trimmedStr.split(",").map((word) => word.trim());

  // Ensure each word is non-empty
  for (let word of wordsArray) {
    if (word === "") {
      return false;
    }
  }

  return true;
};

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePostContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{
    bio: string;
    tags: string;
  } | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);

  async function uploadToGemini(file: File) {
    if (!file) {
      console.error("File is missing.");
      return null;
    }

    // Convert File to base64
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Remove the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // async function run() {
  //   // TODO Make these files available on the local file system
  //   // You may need to update the file paths
  //   const files = [await uploadToGemini("02.jpg", "image/jpeg")];

  //   const chatSession = model.startChat({
  //     generationConfig,
  //     history: [
  //       {
  //         role: "user",
  //         parts: [
  //           {
  //             fileData: {
  //               mimeType: files[0].mimeType,
  //               fileUri: files[0].uri,
  //             },
  //           },
  //           { text: "suggest a bio and tags for this post" },
  //         ],
  //       },
  //       {
  //         role: "model",
  //         parts: [
  //           {
  //             text: "Here's a possible bio and tags for a social media post featuring the image of the butterfly:\n\n**Bio Options:**\n\n* **Option 1 (Short & Sweet):**  A glimpse of nature's beauty. This delicate butterfly caught my eye today. #butterfly #nature #insects #wildlife #photography\n\n* **Option 2 (More Descriptive):**  Found this stunning, slightly tattered butterfly resting on a leaf.  The intricate details of its wings are mesmerizing.  Anyone know the species? #butterflyidentification #naturephotography #macro #wildlife #butterfliesofinstagram #insectphotography\n\n* **Option 3 (Focus on Location):**  Enjoying the vibrant butterflies of [Location - e.g., my backyard, the local park, Costa Rica].  Nature's wonders are all around us! #naturelover #[Location specific hashtag - e.g., #CostaRicaWildlife] #butterfly #travelphotography\n\n\n**Tags:**\n\nThese tags would be useful regardless of which bio option you choose:\n\n* #butterfly\n* #nature\n* #naturephotography\n* #insects\n* #insectphotography\n* #wildlife\n* #wildlife photography\n* #macro\n* #macro photography\n* #butterflies\n* #beautiful\n* #wings\n* #insect\n* #photography\n* #photooftheday\n* #instagood\n* #naturelover\n* #beautifulcreatures\n\n**Optional Tags (depending on your content):**\n\n* Species-specific tags (if you know the butterfly species):  Use the scientific name and common name.  For example,  #Junoniaorithya  #CommonYellowFlat\n* Location-specific tags (if you are sharing the location): #[Location name] #[Location related tags]\n* Equipment tags (if you want to share what camera or lens you used).\n\n\nRemember to select tags relevant to your audience and the platform you are using.  The more specific your tags are, the more likely your post will be discovered by interested users.\n",
  //           },
  //         ],
  //       },
  //     ],
  //   });

  //   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  //   console.log(result.response.text());
  // }

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
    if (file && !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    setSelectedFile(file);
    console.log("selected file", selectedFile);
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
      console.log(response.data);
      if (response.status === 200) {
        toast.success("user found");
        navigate(`/${response.data.result[0].id}`);
        setUsername("");
      } else {
        toast.error("user not found");
      }
    } catch (error: any) {
      toast.error(`${error.message}`);
      console.error(error.message);
    }
  };

  const handleGenerateBio = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);

      // Upload image to Gemini
      const base64Image = await uploadToGemini(selectedFile);

      if (!base64Image) {
        toast.error("Failed to process image.");
        return;
      }

      // Start chat session with image
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: selectedFile.type,
                  data: base64Image,
                },
              },
              {
                text: "Suggest a creative bio and 5-7 relevant tags for this social media post. Provide the bio first, followed by tags separated by commas bio should be in 100 words.",
              },
            ],
          },
        ],
      });

      // Send message to generate bio and tags
      const result = await chatSession.sendMessage("Generate bio and tags");
      const responseText = result.response.text();
      console.log(responseText);
      // // Parse the response (assuming format: Bio text\n\nTags: tag1, tag2, tag3)
      // const [bio, tagsLine] = responseText.split('\n\nTags:').map(s => s.trim());
      // const tags = tagsLine || responseText.split(',').slice(0, 7).join(',');

      // // Set generated content
      // setGeneratedContent({ bio, tags });
      const bioMatch = responseText.match(
        /\*\*Bio:\*\*\n([\s\S]*?)\n\*\*Tags:\*\*/
      );
      const tagsMatch = responseText.match(/\*\*Tags:\*\*\n([\s\S]*)/);

      const bio = bioMatch ? bioMatch[1].trim() : ""; // Get bio text
      const tags = tagsMatch ? tagsMatch[1].trim() : ""; // Get tags text

      // Set generated content
      setGeneratedContent({ bio, tags });
      // Update form values
      form.setValue("bio", bio);
      form.setValue("tags", tags);

      toast.success("Bio and tags generated successfully!");
      console.log("Generated Content:", { bio, tags });
    } catch (error) {
      toast.error("Failed to generate bio and tags.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4 bg-gray-800 p-4 rounded-xl">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for friends, groups, pages"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pr-10 text-white"
        />
        <Search
          onClick={exploreUser}
          className="absolute right-3 text-gray-400 cursor-pointer"
          size={18}
        />
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
                  <Button
                    className="w-full bg-blue-600 "
                    disabled={loading || !selectedFile}
                    onClick={handleGenerateBio}
                  >
                    {loading ? (
                      <span className="gap-x-2 flex justify-center items-center">
                        <CircleLoader /> searching
                      </span>
                    ) : (
                      "Ask ai for bio"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
