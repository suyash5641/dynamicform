"use client";
import DynamicForm from "@/components/DynamicForm";
import { fetchFormFields } from "@/slice/formSlice";
import { fetchUser } from "@/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function Page({ params }: { params: { formId: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const isSubmit = searchParams.get("isSunmit") === "true";
  //   const user = useSelector((state: RootState) => state?.userInfo?.user);
  useEffect(() => {
    //   dispatch(fetchFormFields({ formId: params?.formId, userId: user?.id }));
    dispatch(fetchFormFields({ formId: params?.formId }));
  }, [dispatch, params.formId]);

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <DynamicForm
      formNewId={params.formId}
      isEdit={isEdit}
      isSubmit={isSubmit}
    />
  );
}
