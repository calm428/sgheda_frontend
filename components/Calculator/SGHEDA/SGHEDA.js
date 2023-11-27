import { Button } from "@components/Button";
import { MotionBTTContainer } from "@components/Motion";
import { SectionContainer } from "@components/Section";
import { StepperComponent } from "@components/Stepper";
import axios from "axios";
import { Form, Formik } from "formik";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DesignResultSection } from "./DesignResultSection";
import { FluidPropSection } from "./FluidPropSection";
import { PipeDesignSection } from "./PipeDesignSection";
import { PumpInfoSection } from "./PumpInfoSection";
import { SoilPropSection } from "./SoilPropSection";
import { SystemDesignSection } from "./SystemDesignSection";
import { useToasts } from "react-toast-notifications";

const toggleLinks = [
    {
        name: "Room Load Calculator",
        link: "/calculator/rlc"
    },
    {
        name: "SGHEDA",
        link: "/calculator/sgheda"
    },
    {
        name: "EAHED",
        link: "/calculator/eahed"
    },
    {
        name: "Interior Finish Selection",
        link: "/calculator/ifs"
    }
];

const steps = [
    {
        name: "System Design",
        icon: "/images/calculator/sgheda/system_design.svg"
    },
    {
        name: "Fluid Properties",
        icon: "/images/calculator/sgheda/fluid_properties.svg"
    },
    {
        name: "Soil Properties",
        icon: "/images/calculator/sgheda/soil_properties.svg"
    },
    {
        name: "Pipe Design",
        icon: "/images/calculator/sgheda/pipe_design.svg"
    },
    {
        name: "Pump Info",
        icon: "/images/calculator/sgheda/pump_info.svg"
    },
    {
        name: "Design Result",
        icon: "/images/calculator/sgheda/design_result.svg"
    },
    {
        name: "Analysis",
        icon: "/images/calculator/sgheda/analysis.svg"
    }
];

export const SGHEDA = () => {
    const { addToast } = useToasts();
    const [currentStep, setCurrentStep] = useState(-1);
    const [result, setResult] = useState(null);
    const [maxStep, setMaxStep] = useState(0);

    const validationSchema = [
        Yup.object().shape({
            system: Yup.object().shape({
                heatLoad: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Heat Load is required"),
                inputFluidTemperature: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Input Fluid Temperature is required"),
                type: Yup.number().required("Ring Type is required")
            })
        }),
        Yup.object().shape({
            fluid: Yup.object().shape({
                fluidType: Yup.string().required("Fluid Type is required"),
                viscosity: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Viscosity is required"),
                specificHeat: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Specific Heat is required"),
                density: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Density is required")
            })
        }),
        Yup.object().shape({
            soil: Yup.object().shape({
                thermalConductivity: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Thermal Conductivity is required"),
                thermalDiffusivity: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Thermal Diffusivity is required"),
                groundTemperature: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Ground Temperature is required")
            })
        }),
        Yup.object().shape({
            pipe: Yup.object().shape({
                outerDiameter: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Outer Diameter is required"),
                innerDiameter: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Inner Diameter is required"),
                pipeConductivity: Yup.number().required(
                    "Pipe Conductivity is required"
                ),
                buriedDepth: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Buried Depth is required")
            })
        }),
        Yup.object().shape({
            pump: Yup.object().shape({
                requiredPower: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Required Power is required"),
                fluidVelocity: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Fluid Velocity is required"),
                pumpMotorEfficiency: Yup.number()
                    .test(
                        "gt-zero",
                        "Value must be greater than zero",
                        (val) => val > 0
                    )
                    .required("Pump Motor Efficiency is required")
            })
        })
    ];

    let initialValues = {};

    try {
        if (localStorage.getItem("SGHEDA"))
            initialValues = JSON.parse(localStorage.getItem("SGHEDA"));
        else throw new Error();
    } catch (error) {
        initialValues = {
            system: {
                heatLoad: null,
                inputFluidTemperature: null,
                type: 0
            },
            fluid: {
                fluidType: "Water",
                viscosity: null,
                specificHeat: null,
                density: null
            },
            soil: {
                thermalConductivity: null,
                thermalDiffusivity: null,
                groundTemperature: null
            },
            pipe: {
                outerDiameter: null,
                innerDiameter: null,
                pipeConductivity: null,
                buriedDepth: null
            },
            pump: {
                requiredPower: null,
                fluidVelocity: null,
                pumpMotorEfficiency: null
            }
        };
    }

    function handleSubmit(values, actions) {
        if (currentStep === 4) {
            confirmDialog({
                message: `This will use ${process.env.NEXT_PUBLIC_SGHEDA_CREDIT_AMOUNT} credits. \n Are you sure you want to submit?`,
                header: "Confirmation",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    axios
                        .post("/api/calculator/sgheda/calculate", {
                            inputData: values
                        })
                        .then((result) => {
                            if (result.status === 200) {
                                localStorage.setItem(
                                    "SGHEDA",
                                    JSON.stringify(values)
                                );
                                localStorage.setItem(
                                    "SGHEDA.currentStep",
                                    Math.max(maxStep, currentStep + 1)
                                );

                                setResult(result.data.data);
                                localStorage.setItem(
                                    "SGHEDA.designResult",
                                    JSON.stringify(result.data.data)
                                );

                                setMaxStep(Math.max(maxStep, currentStep + 1));
                                setCurrentStep(currentStep + 1);
                            } else {
                                addToast(result.data.message, {
                                    appearance: "error",
                                    autoDismiss: true
                                });
                            }
                        })
                        .catch((err) => {
                            addToast(err.response.data.message, {
                                appearance: "error",
                                autoDismiss: true
                            });
                        });
                    // axios
                    //     .post("http://localhost:8000/sgheda", values)
                    //     .then((res) => {
                    //         if (res.status === 200) {
                    //             localStorage.setItem(
                    //                 "SGHEDA",
                    //                 JSON.stringify(values)
                    //             );
                    //             localStorage.setItem(
                    //                 "currentStep",
                    //                 Math.max(maxStep, currentStep + 1)
                    //             );

                    //             setResult(res.data);
                    //             localStorage.setItem(
                    //                 "designResult",
                    //                 JSON.stringify(res.data)
                    //             );

                    //             setMaxStep(Math.max(maxStep, currentStep + 1));
                    //             setCurrentStep(currentStep + 1);

                    //             const inputData = JSON.stringify(values);
                    //             const outputData = JSON.stringify(result);
                    //             const amount = 30;

                    //             axios
                    //                 .post("/api/calculator/saveHistory", {
                    //                     inputData,
                    //                     outputData,
                    //                     type: "SGHEDA",
                    //                     amount
                    //                 })
                    //                 .then((result) => {
                    //                     if (result.status === 200) {
                    //                         console.log(result.data);
                    //                     }
                    //                 });
                    //         }
                    //     });
                },
                reject: () => {}
            });
            // actions.setSubmitting(false);
        } else if (currentStep === 5) {
            setCurrentStep(0);
            setResult(null);
            setMaxStep(0);
            localStorage.removeItem("SGHEDA");
            localStorage.removeItem("SGHEDA.currentStep");
            localStorage.removeItem("SGHEDA.designResult");
            actions.resetForm({
                values: {
                    system: {
                        heatLoad: null,
                        inputFluidTemperature: null,
                        type: 0
                    },
                    fluid: {
                        fluidType: "Water",
                        viscosity: null,
                        specificHeat: null,
                        density: null
                    },
                    soil: {
                        thermalConductivity: null,
                        thermalDiffusivity: null,
                        groundTemperature: null
                    },
                    pipe: {
                        outerDiameter: null,
                        innerDiameter: null,
                        pipeConductivity: null,
                        buriedDepth: null
                    },
                    pump: {
                        requiredPower: null,
                        fluidVelocity: null,
                        pumpMotorEfficiency: null
                    }
                }
            });
        } else {
            localStorage.setItem("SGHEDA", JSON.stringify(values));
            localStorage.setItem(
                "SGHEDA.currentStep",
                Math.max(maxStep, currentStep + 1)
            );

            setMaxStep(Math.max(maxStep, currentStep + 1));
            setCurrentStep(currentStep + 1);
            actions.setSubmitting(false);
        }
    }

    function handleBack() {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    }

    const footer = (className) => {
        return (
            <div className={`w-full flex ${className} justify-between`}>
                {currentStep > 0 && currentStep < 5 && (
                    <Button
                        type="button"
                        className="btn btn--black w-auto mt-4 text-white flex flex-row"
                        onClick={handleBack}
                    >
                        <span>Previous</span>
                    </Button>
                )}

                {currentStep === 5 && (
                    <Button
                        type="submit"
                        className="btn btn--black w-auto mt-4 text-white flex flex-row"
                    >
                        <span>Save Design</span>
                    </Button>
                )}

                {currentStep < 5 && (
                    <Button
                        type="submit"
                        className="btn btn--secondary w-auto ml-auto mt-4 text-white lemonsqueezy-button flex flex-row"
                    >
                        {currentStep === 4 ? "Calculate" : "Next"}
                    </Button>
                )}
                {currentStep === 5 && (
                    <>
                        <Button
                            type="submit"
                            className="btn btn--secondary w-auto mt-4 text-white lemonsqueezy-button flex flex-row"
                        >
                            Redesign
                        </Button>
                        <Button
                            type="button"
                            className="btn btn--black w-auto mt-4 text-white flex flex-row"
                            onClick={() => {
                                setCurrentStep(currentStep - 1);
                            }}
                        >
                            <span>Go to Analysis</span>
                        </Button>
                    </>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (currentStep === -1) {
            setCurrentStep(
                localStorage.getItem("SGHEDA.currentStep")
                    ? parseInt(localStorage.getItem("SGHEDA.currentStep"))
                    : 0
            );

            setResult(
                localStorage.getItem("designResult")
                    ? JSON.parse(localStorage.getItem("SGHEDA.designResult"))
                    : null
            );

            setMaxStep(
                localStorage.getItem("currentStep")
                    ? parseInt(localStorage.getItem("SGHEDA.currentStep"))
                    : 0
            );
        }
    }, [currentStep]);

    return (
        <SectionContainer
            id={"sgheda"}
            className="page-banner--container p-4 pb-0"
        >
            <SectionContainer className="page-banner--inner-container w-full h-full z-10 flex lg:flex-row flex-col rounded-lg gap-4 bg-[url('/images/background/calculator.jpg')] bg-center bg-cover no-repeat">
                <SectionContainer className="w-full h-full flex gap-12 bg-[#09112D]/80 justify-center flex-col rounded-lg p-12 md:px-12 px-4">
                    <ConfirmDialog />
                    <MotionBTTContainer
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="w-full"
                    >
                        <div className="relative w-[95%] h-full bg-[#09112D] mx-auto p-4 py-8 rounded-3xl overflow-hidden">
                            <StepperComponent
                                steps={steps}
                                currentStep={currentStep}
                                maxStep={maxStep}
                                setCurrentStep={setCurrentStep}
                            />
                            <div className="w-full bg-white backdrop-filter backdrop-blur-md bg-opacity-10 h-1 rounded-xl my-4"></div>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema[currentStep]}
                                onSubmit={handleSubmit}
                            >
                                <Form>
                                    {currentStep === 0 && (
                                        <SystemDesignSection footer={footer} />
                                    )}
                                    {currentStep === 1 && (
                                        <FluidPropSection footer={footer} />
                                    )}
                                    {currentStep === 2 && (
                                        <SoilPropSection footer={footer} />
                                    )}
                                    {currentStep === 3 && (
                                        <PipeDesignSection footer={footer} />
                                    )}
                                    {currentStep === 4 && (
                                        <PumpInfoSection footer={footer} />
                                    )}
                                    {currentStep === 5 && (
                                        <DesignResultSection
                                            footer={footer}
                                            data={result}
                                        />
                                    )}
                                </Form>
                            </Formik>
                        </div>
                    </MotionBTTContainer>
                </SectionContainer>
            </SectionContainer>
        </SectionContainer>
    );
};
