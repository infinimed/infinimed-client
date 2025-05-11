import { Flex } from '@radix-ui/themes';
import Recommendation from '@/components/Recommendation';
import SelectArea from '@/components/SelectArea';
import ServiceList from '@/components/ServiceList';
import SearchIcon from '@/components/SearchIcon';
import NotificationIcon from '@/components/NotificationIcon';
import SearchBar from '@/components/SearchBar';
import ServiceSliders from '@/components/ServiceSliders';
import NavbarTop from '@/components/desktop/NavbarTop';
import SideNavbar from '@/components/desktop/SideNavbar';
import UpcomingAppointment from '@/components/UpcomingAppointment';
import CartIconTopbar from '@/components/CartIconTopbar';
import ProfilePicture from '@/components/ProfilePicture';

export default function Home() {
  return (
    <>
      {/* desktop navbar  */}

      <NavbarTop></NavbarTop>
      <Flex
        className="w-full overflow-x-hidden p-3 relative mb-[10vh]"
        justify={'center'}
        direction="column"
      >
        {/* For Mobile */}
        <div className="lg:hidden">
          <Flex justify={'between'} align={'center'}>
            <Flex className="" justify={'start'} align={'center'}>
              <ProfilePicture></ProfilePicture>
              <SelectArea></SelectArea>
            </Flex>

            <Flex className="" justify={'between'}>
              <SearchIcon></SearchIcon>
              <NotificationIcon></NotificationIcon>
              <CartIconTopbar></CartIconTopbar>
            </Flex>
          </Flex>
          <SearchBar></SearchBar>
          <Recommendation></Recommendation>
          <UpcomingAppointment></UpcomingAppointment>
          <ServiceList></ServiceList>
          <ServiceSliders></ServiceSliders>
        </div>

        <div className="hidden lg:flex mt-[7vh]">
          <div className="w-[20vw] fixed h-full border-gray-300 border-r-[1px]">
            <SideNavbar></SideNavbar>
          </div>
          <div className="w-[70vw] ml-[25vw]">
            <Recommendation></Recommendation>
            <UpcomingAppointment></UpcomingAppointment>
            <ServiceList></ServiceList>

            <ServiceSliders></ServiceSliders>
          </div>
        </div>
      </Flex>
    </>
  );
}
