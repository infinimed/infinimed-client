'use client';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import { Flex, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setIsLoggedIn } from '@/lib/features/auth/isLoggedIn';
import { getUser } from '@/services/getUser';
import { IUser } from '@/interfaces/IUser';

type profileProps = object;

const Profile: React.FC<profileProps> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser()
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setUser(res);
      })
      .catch((e) => {
        setError(e);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    dispatch(setIsLoggedIn(false));
    router.push('/');
  }
  function handleProfilePictureChange() {
    router.push('./profile/picture-change');
  }

  return (
    <>
      {error && <p>Faced a server error. Please refresh</p>}
      {loading && <p>Fetching User</p>}
      {!loading && user?.first_name && (
        <Flex
          width={'full'}
          gap={'2'}
          direction={'column'}
          justify={'center'}
          align={'center'}
          className="lg:mt-[10vh]"
        >
          <Flex
            width={'full'}
            height={'20vh'}
            direction={'column'}
            justify={'center'}
            align={'center'}
          >
            <Avatar.Root>
              <Avatar.Image
                src={user?.profile_picture}
                alt="profile-pic"
                className="w-[20vw] h-[20vw] object-cover lg:w-[10vw] lg:h-[10vw] rounded-full"
              ></Avatar.Image>
            </Avatar.Root>
          </Flex>
          <Flex
            direction={'column'}
            width={'100%'}
            align={'center'}
            justify={'start'}
            className="bg-indigo-900 rounded-2xl pt-[10vh] lg:pt-[5vh] h-[80vh] lg:h-[50vh]"
          >
            {/* <Text as="p" className="lg:mb-[3vh] lg:text-white lg:font-bold">
              {`${user?.first_name} ${user?.last_name}${user?.date_of_birth ? `,${user?.date_of_birth}` : ''}`}
            </Text> */}
            <Tabs.Root
              className="flex flex-col w-[300px] shadow-[0_2px_10px] shadow-blackA2"
              defaultValue="tab1"
            >
              <Tabs.List
                className="shrink-0 flex border-b border-mauve6"
                aria-label="Manage your account"
              >
                <Tabs.Trigger
                  className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab1"
                >
                  Address
                </Tabs.Trigger>
                {/* <Tabs.Trigger
                  className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab2"
                >
                  Password
                </Tabs.Trigger> */}
                <Tabs.Trigger
                  className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                  value="tab3"
                >
                  Account
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab1"
              >
                <p className="mb-5 text-mauve11 text-[15px] leading-normal">
                  Make changes to your account here. Click save when you are
                  done.
                </p>
                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                  <label
                    className="text-[13px] leading-none mb-2.5 text-violet12 block"
                    htmlFor="name"
                  >
                    Address
                  </label>
                  <input
                    className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                    id="address"
                    defaultValue="Pedro Duarte"
                  />
                </fieldset>

                <div className="flex justify-end mt-5">
                  <button className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default">
                    Save changes
                  </button>
                </div>
              </Tabs.Content>
              <Tabs.Content
                className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab2"
              >
                <p className="mb-5 text-mauve11 text-[15px] leading-normal">
                  Password
                </p>
                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                  <label
                    className="text-[13px] leading-none mb-2.5 text-violet12 block"
                    htmlFor="currentPassword"
                  >
                    Current password
                  </label>
                  <input
                    className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                    id="currentPassword"
                    type="password"
                  />
                </fieldset>
                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                  <label
                    className="text-[13px] leading-none mb-2.5 text-violet12 block"
                    htmlFor="newPassword"
                  >
                    New password
                  </label>
                  <input
                    className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                    id="newPassword"
                    type="password"
                  />
                </fieldset>
              </Tabs.Content>
              <Tabs.Content
                className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab3"
              >
                <p
                  onClick={handleProfilePictureChange}
                  className="mb-5 text-mauve11 text-[15px] leading-normal cursor-pointer"
                >
                  Change Profile Picture
                </p>
                <p
                  onClick={handleLogout}
                  className="mb-5 text-mauve11 text-[15px] leading-normal cursor-pointer"
                >
                  Logout
                </p>
                {/* <p className="mb-5 text-mauve11 text-[15px] leading-normal">
                Delete
              </p> */}
              </Tabs.Content>
            </Tabs.Root>
          </Flex>
        </Flex>
      )}
    </>
  );
};
export default Profile;
