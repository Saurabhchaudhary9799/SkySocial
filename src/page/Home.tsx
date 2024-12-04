import CreatePost from '@/components/CreatePost';
import Posts from '@/components/Posts';
import ProfileBox from '@/components/ProfileBox';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostProvider } from '@/context/PostContext';
import SuggestedPeople from '@/components/SuggestedPeople';
import CustomChallenge from '@/components/CustomChallenge';


// interface User {
//   authtoken: string;
//   userid: string;
//   username: string;
//   useremail: string;
// }

const Home = () => {
  // const [user, setUser] = useState<User | null>(null); 
  const navigate = useNavigate();

   useEffect(()=>{
     const storedData = localStorage.getItem('userData');
     if(!storedData){
       navigate("/register")
     }
   },[navigate])
  // useEffect(() => {
  //   const storedData = localStorage.getItem('userData');
  //   // console.log(storedData);
  //   if (!storedData) {
  //     navigate("/register");
  //   } else {
  //     const { authToken, result } = JSON.parse(storedData);
  //     const userDetails: User = {
  //       authtoken: authToken,
  //       userid: result.user.id,
  //       username: result.user.username,
  //       useremail: result.user.email,
  //     };
  //     setUser(userDetails);
  //   }
  // }, [navigate]);

  return (
    <>
    <PostProvider>
      <div className="home-section container mx-auto p-4">
        {/* Main grid for three-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4">
          
          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3  space-y-5">
            <ProfileBox />
            <CustomChallenge/>
          </div>

          {/* Main Feed */}
          <div className="col-span-1 md:col-span-6 lg:col-span-6 rounded-xl space-y-5 ">
            
            <CreatePost/>
            <Posts/>
            
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3 bg-gray-800 p-4 rounded-xl space-y-6 h-[330px]   overflow-y-auto">
             <SuggestedPeople/>
          </div>

        </div>
      </div>
      </PostProvider>
    </>
  );
}

export default Home;


