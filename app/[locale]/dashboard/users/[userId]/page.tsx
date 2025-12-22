import DynamicElementPage from "@/app/_components/_dashboard/_dynamicComponents/DynamicElementPage";
import NotFoundItem from "@/app/_components/_dashboard/NotFoundItem";
import { UpdateUserinputs } from "@/app/constants/_dashboard/InputsArrays";
import React from "react";

export default async function UserPage({ params }: any) {
  const { userId } = await params;

  if (!userId) return <NotFoundItem />;

  return (
    <>
      <DynamicElementPage
        api={"/user"}
        updateEndPoint={"/update-user"}
        id={userId}
        inputsData={UpdateUserinputs}
        direct={""}
      />
    </>
  );
}
