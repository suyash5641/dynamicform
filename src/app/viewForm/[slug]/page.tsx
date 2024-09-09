"use client";
import { getGeoLocation } from "@/app/schemaActions";
import DynamicForm from "@/components/DynamicForm";
import { fetchFormFields } from "@/slice/formSlice";
import { fetchUser } from "@/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function Page({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const isSubmit = searchParams.get("isSunmit") === "true";

  const fetchGeoLocation = async (id: string) => {
    await getGeoLocation(id);
  };

  //   useEffect(() => {
  //     // fetchGeoLocation();
  //     dispatch(fetchFormFields({ formId: params?.slug }));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [params?.slug]);

  //   useEffect(() => {
  //     fetchGeoLocation(params?.slug);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [params?.slug]);

  useEffect(() => {
    if (params?.slug) {
      console.log("hit");
      // Fetch form fields and geo-location when slug changes
      dispatch(fetchFormFields({ formId: params?.slug }));
      fetchGeoLocation(params?.slug);
      console.log("hit after");
    }
  }, [params?.slug, dispatch]);

  return (
    <DynamicForm formNewId={params?.slug} isEdit={false} isSubmit={false} />
  );
}
