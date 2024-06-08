import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import type { InitialUserData, User } from "../../types";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";

const prisma = new PrismaClient();

// export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const users: User[] = await prisma.user.findMany();
//     res.status(200).json({
//       status: "success",
//       data: {
//         users,
//       },
//     });
//   } catch (error) {
//     // Assert error as an instance of Error
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "error",
//         message: error.message,
//       });
//     } else {
//       res.status(500).json({
//         status: "error",
//         message: "An unknown error occurred",
//       });
//     }
//   }
// };

export const createUserIfNotExist = async (req: Request, res: Response): Promise<void> => {
  const sentUser: InitialUserData = req.body;
  console.log("Sentuser: ", sentUser);
  try {
    let user = await prisma.user.findUnique({ where: { google_id: sentUser.google_id } });

    if (user) {
      console.log("User already exists");
      res.status(200).json({
        status: "success",
        message: "User already exists",
        data: { user },
      });
    } else {
      // Generate a friendcode, check if it exists in the database
      // If it does, generate another one until a unique one is found
      // If it doesn't exist, create the user
      let friendCode;
      while (true) {
        const generatedFriendCode = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: "-",
          length: 3,
        });

        const friendCodeExists = await prisma.user.findUnique({
          where: { friendcode: generatedFriendCode },
        });

        if (!friendCodeExists) {
          friendCode = generatedFriendCode;
          break;
        }
      }

      user = await prisma.user.create({
        data: {
          google_id: sentUser.google_id,
          first_name: sentUser.first_name,
          last_name: sentUser.last_name,
          friendcode: friendCode,
          avatar_url: sentUser.avatar_url,
        },
      });

      res.status(200).json({
        status: "success",
        message: "User created successfully",
        data: { user },
      });
    }
  } catch (error) {
    // Assert error as an instance of Error
    if (error instanceof Error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An unknown error occurred",
      });
    }
  }
};
