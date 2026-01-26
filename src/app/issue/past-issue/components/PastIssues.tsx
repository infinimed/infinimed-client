'use client';
import { Flex, Grid } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { getPastIssues } from '@/services/getPastIssues';
import { IIssueDetails } from '@/interfaces/IIssue';
import Skeleton from '@/components/Skeleton';

type PastOrdersListProps = {
  children?: string;
};

const PastIssuesList: React.FC<PastOrdersListProps> = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    setPage(1);
    getPastIssues(false, page)
      .then((res) => res.json())
      .then((res) => {
        setIssues(res);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, [page]);

  return (
    <div className="w-full mt-4">
      {loading && (
        <Grid className="lg:grid-cols-3 grid-cols-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-48 mb-2 mr-2" />
          ))}
        </Grid>
      )}

      {!loading && issues.length === 0 && (
        <Flex className="w-full p-3 justify-center">
          <p>There are no past issues</p>
        </Flex>
      )}
      {error !== '' && (
        <Flex className="w-full p-3 justify-center">
          <p>Server Error please refresh</p>
        </Flex>
      )}

      {!loading && (
        <Grid className="lg:grid-cols-3 grid-cols-1">
        {issues.map((item: IIssueDetails) => {
          return (
            item.assets.length > 0 && (
              <Flex
                align={'center'}
                key={item._id}
                justify={'between'}
                className="border-2 p-2 rounded-md mb-2 mr-2 shadow-md w-[98%]"
              >
                <Link
                  href={`/issue/schedule?issue_id=${item._id}&service_name=${item.service_id.name}&sub_category_name=${item.service_id.sub_category.name}&category_name=${item.service_id.sub_category.category_id?.name || ''}`}
                >
                  <Flex
                    direction={'column'}
                    wrap={'wrap'}
                    className="items-start"
                  >
                    <Flex
                      align={'center'}
                      justify={'start'}
                      className="p-2 ml-2 w-full lg:w-full"
                    >
                      {item?.assets.slice(0, 2).map((asset) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={asset}
                          src={asset}
                          height={100}
                          width={100}
                          alt="service-asset"
                          className="mr-2 w-1/3 h-[100px] object-contain"
                        ></img>
                      ))}
                      <p>
                        {item?.assets.length - 2 > 0 &&
                          `See ${item.assets.length - 2} More`}
                      </p>
                    </Flex>
                    <div className="ml-2">
                      <p className="font-poppins font-bold text-gray-500 lg:text-sm text-lg">
                        Uploaded for {item?.service_id?.name}{' '}
                        {item?.service_id?.sub_category?.name} Service
                      </p>
                    </div>
                  </Flex>
                </Link>

                {/* <div className="rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 px-1 border border-transparent text-base text-white font-poppins transition-all shadow-lg ">
                  {item.status}
                </div> */}
              </Flex>
            )
          );
        })}
        </Grid>
      )}
    </div>
  );
};
export default PastIssuesList;
