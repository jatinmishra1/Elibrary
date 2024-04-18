import React from "react";
import { Book } from "@/types";
import { BookCard } from "./BookCard";

export function BookList({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-7xl mx-auto mb-10">
      {books.map((book) => {
        return (
          <>
            <BookCard key={book._id} book={book} />
          </>
        );
      })}
    </div>
  );
}
