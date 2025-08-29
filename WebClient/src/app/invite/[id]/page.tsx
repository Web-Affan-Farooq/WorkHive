"use client";
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const Invitepage = () => {
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    const joinOrg = async () => {
      try {
        console.log("token : ", id);

        const response = await axios.post("/api/invite/verify", {
          token: id,
        });
        Notify.success(response.data.message);
        router.push(response.data.redirect);
      } catch (err) {
        ShowClientError(err, "Organization joining error");
      }
    };
    joinOrg();
  }, [id, router]);

  return <div>Please wait</div>;
};

export default Invitepage;
