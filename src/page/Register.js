import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
const Register = () => {
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    console.log(BASE_URL);
    return (_jsx("div", { className: "h-screen flex justify-center items-center ", children: _jsxs(Tabs, { defaultValue: "login", className: "w-[250px] sm:w-[400px] h-[400px] ", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 ", children: [_jsx(TabsTrigger, { value: "login", children: "Login" }), _jsx(TabsTrigger, { value: "signup", children: "Signup" })] }), _jsx(TabsContent, { value: "login", children: _jsx(Login, {}) }), _jsx(TabsContent, { value: "signup", children: _jsx(Signup, {}) })] }) }));
};
export default Register;
