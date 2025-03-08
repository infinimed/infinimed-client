'use client';
import Topbar from '@/components/Topbar';
import UploadImage from '@/components/UploadImage';
import { IGender } from '@/interfaces/IIssue';
import { createIssue } from '@/services/createIssue';
import { Flex } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

export default function Docs() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const service_id = searchParams.get('service_id');
  const service_name = searchParams.get('service_name');
  const for_someone = searchParams.get('for_someone');
  const name = searchParams.get('name');
  const dob = searchParams.get('dob');
  const gender = searchParams.get('gender');
  const price = searchParams.get('price');

  const [successfullyUploaded, setSuccessfullyUploaded] =
    useState<boolean>(false);

  async function onUploadImage(assets: string[]) {
    const JWTToken = localStorage.getItem('token');
    const createdIssueResponse = await createIssue({
      token: JWTToken as string,
      for_someone: for_someone ? true : false,
      service_id: service_id as string,
      assets: assets,
      patient_details: {
        name: name as string,
        dob: new Date(dob as string),
        gender: gender as IGender,
      },
    });
    const createdIssue = await createdIssueResponse.json();

    setSuccessfullyUploaded(true);
    router.push(
      `./schedule?issue_id=${createdIssue._id}&service_name=${service_name}&price=${price}`,
    );
  }

  async function handleSkip() {
    const JWTToken = localStorage.getItem('token');
    const createdIssueResponse = await createIssue({
      token: JWTToken as string,
      for_someone: for_someone ? true : false,
      service_id: service_id as string,
      assets: [],
      patient_details: {
        name: name as string,
        dob: new Date(dob as string),
        gender: gender as IGender,
      },
    });
    const createdIssue = await createdIssueResponse.json();

    setSuccessfullyUploaded(true);
    router.push(
      `./schedule?issue_id=${createdIssue._id}&service_name=${service_name}&price=${price}`,
    );
  }

  return (
    <>
      <Topbar
        title="Upload Documents"
        leftIcon={<IoIosArrowBack fontSize={'24px'} />}
      />
      <div className="min-h-[90vh] lg:min-h-[70vh] w-full flex items-center justify-center bg-gray-100">
        {successfullyUploaded ? (
          <>
            <label className="block text-lg font-medium text-gray-700 mb-2 p-3">
              Your History has been created Successfully. Redirecting you to the
              Schedule Page.
            </label>
          </>
        ) : (
          <Flex direction={'column'}>
            <p className="font-poppins w-full p-2 text-center mb-[5vh] text-lg">
              Please upload your test reports or any other relevant
              pictures/documents here
            </p>
            <UploadImage
              cloudinaryUrl="https://api.cloudinary.com/v1_1/dgn4bscl4/upload"
              uploadPreset="infinimed"
              onUploadImage={onUploadImage}
              handleSkip={handleSkip}
            />
          </Flex>
        )}
      </div>
    </>
  );
}
