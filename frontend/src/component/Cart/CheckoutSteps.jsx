import React from "react";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: "Shipping Details",
      icon: <LocalShippingIcon className="text-xl md:text-2xl" />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheckIcon className="text-xl md:text-2xl" />,
    },
    {
      label: "Payment",
      icon: <AccountBalanceIcon className="text-xl md:text-2xl" />,
    },
  ];

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        className="flex flex-col items-center mt-8"
      >
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index}
            completed={activeStep >= index}
            className="flex items-center justify-center"
          >
            <StepLabel
              className={`${activeStep >= index ? "text-red-500" : "text-gray-500"
                } flex flex-col items-center`}
              icon={item.icon}
            >
              <Typography
                className={`${activeStep >= index ? "text-red-500" : "text-gray-500"
                  } text-sm md:text-base`}
              >
                {item.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
