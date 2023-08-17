'use client';
import React, { useState } from 'react';

const OnlineAdmission = () => {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };
    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full lg:max-w-xl">
                <h2 className="text-lg font-medium mb-4">Step {step} of 2</h2>
                <div className="flex mb-4">
                    <div
                        className={`w-1/2 border-r border-gray-400 ${step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                            } p-2 text-center cursor-pointer`}
                        onClick={() => setStep(1)}
                    >
                        Step 1
                    </div>
                    <div
                        className={`w-1/2 ${step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                            } p-2 text-center cursor-pointer`}
                        onClick={() => setStep(2)}
                    >
                        Step 2
                    </div>
                </div>
                {step === 1 ? <Step1 /> : <Step2 />}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button
                            className="bg-gray-300 px-6 py-1.5 rounded-lg text-gray-700 hover:bg-gray-400"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    )}
                    {step < 2 && (
                        <button
                            className="bg-blue-500 px-6 py-1.5 rounded-lg text-white hover:bg-blue-600"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Step1 = () => (
    <div>
        <h3 className="text-lg font-medium mb-4">Step 1</h3>
        <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700" htmlFor="name">
                Name
            </label>
            <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-400 p-2"
            />
        </div>
        <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700" htmlFor="email">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-400 p-2"
            />
        </div>
        <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700" htmlFor="email">
                Email
            </label>

            <label for="frm-whatever" className="sr-only">My field</label>
            <select className="appearance-none w-full py-1 px-2 bg-white" name="whatever" id="frm-whatever">
                <option value="">Please choose&hellip;</option>
                <option value="1">Item 1</option>
                <option value="2">Item 2</option>
                <option value="3">Item 3</option>
            </select>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>

    </div>
);

const Step2 = () => (
    <div>
        <h3 className="text-lg font-medium mb-4">Step 2</h3>
        <div className="mb-4">
            <label
                className="block font-medium mb-2 text-gray-700"
                htmlFor="password"
            >
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-gray-400 p-2"
            />
        </div>
    </div>
);

export default OnlineAdmission;