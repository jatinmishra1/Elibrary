import { NextFunction, Request, Response, raw } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  //   console.log("files", req.files);
  const files = req.files as { [filename: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    // console.log(bookFileUploadResult);
    // console.log(uploadResult);
    const _req = req as AuthRequest;
    let newBook;
    try {
      const { title, genre } = req.body;
      newBook = await bookModel.create({
        title,
        genre,
        author: _req.userId,
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(500, "book creation failed"));
    }

    //deleting temperory files which got uploaded on derver i.e in our public folder
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (err) {
      console.log(err);
      return next(createHttpError(404, "temp file deletion failed"));
    }

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "error while uploading image and file"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "you can not update others book"));
  }

  const files = req.files as { [filename: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    completeCoverImage = fileName;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      files.file[0].filename
    );
    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;
    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-covers",
      format: "pdf",
    });
    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updateBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    {
      new: true,
    }
  );
  res.json(updateBook);
};

export { createBook, updateBook };
