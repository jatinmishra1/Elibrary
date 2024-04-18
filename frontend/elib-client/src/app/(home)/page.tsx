// 'use client' to make it as client component

import Banner from "@/app/(home)/component/Banner";
import Image from "next/image";
import { BookList } from "./component/BookList";
import { error } from "console";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function Home() {
  //data fetching

  //server component,by default it is an server component
  //client component
  return (
    <>
      <Banner />
      <Suspense fallback={<Loading />}>
        <BookList />
      </Suspense>
    </>
  );
}
