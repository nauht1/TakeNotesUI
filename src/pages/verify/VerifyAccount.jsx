import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosNoToken } from "../../config/ApiConfig.js";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axiosNoToken.post(`/auth/verify?code=${code}`);
        if (response.status === 200) {
          toast.success("Account verified successfully. Please log in.");
          navigate('/verifySuccessfully');
        } else {
          toast.error("Verification failed. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred during verification. Please try again.");
      }
    };

    if (code) {
      verifyAccount();
    }
  }, [code, navigate]);

  return (
    <div className="verify-container">
      <ToastContainer />
    </div>
  );
}

export default VerifyAccount;
