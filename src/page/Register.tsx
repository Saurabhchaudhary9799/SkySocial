import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";


const Register = () => {


  return (
    <div className="h-screen flex justify-center items-center ">
      <Tabs defaultValue="login" className="w-[250px] sm:w-[400px] h-[400px] ">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="login" >Login</TabsTrigger>
          <TabsTrigger value="signup"  >Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
           <Login/>
        </TabsContent>
        <TabsContent value="signup"><Signup/></TabsContent>
      </Tabs>
    </div>
  );
};

export default Register;
