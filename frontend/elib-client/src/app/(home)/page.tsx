// 'use client' to make it as client component

import Banner from "@/app/(home)/component/Banner";
import Image from "next/image";
import { BookList } from "./component/BookList";
import { error } from "console";

export default async function Home() {
  //data fetching

  const response = await fetch(`${process.env.BACKEND_URL}/books/`);
  if (!response.ok) {
    throw new Error("error while fecthing the books");
  }
  const books = await response.json();
  console.log("books", books);

  //server component,by default it is an server component
  //client component
  return (
    <>
      <Banner />
      <BookList books={books} />
    </>
  );
}
