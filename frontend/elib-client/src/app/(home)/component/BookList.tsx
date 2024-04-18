import React from "react";

import { BookCard } from "./BookCard";
import { Book } from "@/types";

export async function BookList() {
  const response = await fetch(`${process.env.BACKEND_URL}/books/`);
  if (!response.ok) {
    throw new Error("error while fecthing the books");
  }
  const books = await response.json();
  console.log("books", books);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-7xl mx-auto mb-10">
      {books.map((book: Book) => {
        return (
          <>
            <BookCard key={book._id} book={book} />
          </>
        );
      })}
    </div>
  );
}
