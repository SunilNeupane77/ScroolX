"use client";

import type { Prisma } from "@prisma/client";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardFooter } from "../ui/card";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
console.log("ImageKit URL Endpoint:", urlEndPoint);

type ShortCardProps = {
  short: Prisma.ShortsGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
        };
      };
    };
  }>;
};

const ShortCard: React.FC<ShortCardProps> = ({ short }) => {
  const relativePath = short.url.startsWith(urlEndPoint)
    ? short.url.replace(urlEndPoint, "")
    : short.url;

  console.log("Short URL:", short.url);
  console.log("Relative Path for IKVideo:", relativePath);

  return (
    <Card className="p-0 w-[360px] h-[640px] flex flex-col items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
      <ImageKitProvider urlEndpoint={urlEndPoint}>
        <IKVideo
          path={relativePath.startsWith("/") ? relativePath : `/${relativePath}`}
          transformation={[{ height: "640", width: "360" }]}
          autoPlay
          muted
          loop
          controls
          className="absolute inset-0 w-full h-full object-cover"
        />
      </ImageKitProvider>

      {/* Channel Information */}
      <CardFooter className="absolute bottom-20 -left-2 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="" alt="channel owner photo" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold">{short.title}</h3>
              <span className="text-sm">{short.user.name}</span>
            </div>
          </div>
          <div className="text-sm mt-2">
            <p>{short.description}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShortCard;
