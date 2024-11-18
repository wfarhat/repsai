"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useAuth } from "@clerk/nextjs";


export default function HomePage() {
  
  const { isSignedIn } = useAuth();
  
  return (
    <main className="main-container text-light-1">
      <section className="w-full max-w-4xl mx-auto text-center py-20 relative">
        <div
          className="absolute inset-0 flex justify-center items-center opacity-10 z-0"
          style={{ transform: 'translateY(-40px)' }}
        >
          <Image
            src="/assets/logo.png"
            alt="RepsAI Logo Background"
            width={850}
            height={850}
            className="object-contain"
          />
        </div>

        <h1 className="head-text text-4xl sm:text-5xl font-extrabold relative z-10">
          Welcome to RepsAI
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-light-3 max-w-xl mx-auto relative z-10">
          Your all-in-one fitness companion for tracking progress, generating detailed workouts, and reaching new heights.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link
            href={isSignedIn ? "/create-workout" : "/sign-in"}
            className="user-card_btn px-5 py-3 bg-green-500 hover:bg-green-600 text-light-1 font-semibold rounded-lg"
          >
            Get Started
          </Link>
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="user-card_btn px-5 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 font-semibold rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>


      <section className="mt-10 w-full max-w-5xl mx-auto py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {[
          {
            imgSrc: "/assets/progress.png",
            title: "Track Your Progress",
            description: "Log and view your workouts with our interactive calendar to stay consistent and motivated.",
          },
          {
            imgSrc: "/assets/generate.png",
            title: "Generate Detailed Workouts",
            description: "Customize your routines with ease and tailor each workout to your fitness level.",

          },
          {
            imgSrc: "/assets/save.png",
            title: "Save & Track Workouts",
            description: "Save your workouts and track your improvements over time to reach your goals faster.",
          },
        ].map((feature, index) => (
          <div key={index} className="user-card p-6 bg-dark-3 rounded-lg hover:shadow-lg transition duration-300 flex flex-col items-center">
            <Image src={feature.imgSrc} alt={feature.title} width={60} height={60} className="mb-4 image-white" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-light-3">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="w-full max-w-3xl mx-auto text-center py-20">
        <h2 className="head-text text-3xl font-semibold mb-6">Take Control of Your Fitness Journey</h2>
        <p className="text-lg text-light-3 max-w-lg mx-auto">
          Join RepsAI and access all the tools you need to stay motivated, consistent, and reach your fitness goals.
        </p>
      </section>

      <section className="w-full max-w-6xl mx-auto text-center py-20 bg-dark-2 rounded-lg mt-12">
        <h2 className="text-heading1-bold font-semibold text-light-1 mb-8">Membership Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Basic",
              price: "Free",
              benefits: ["Track your workout days", "Access basic workout routines", "Save workout progress"],
              disabled: true,
              buttonText: "Current Plan",
            },
            {
              title: "Pro",
              price: "$9.99/month",
              benefits: ["All features from Basic", "Generate custom workout routines", "Priority support", "Personalized progress reports"],
              disabled: true,
              buttonText: "Join Pro",
            },
            {
              title: "Elite",
              price: "$19.99/month",
              benefits: ["All features from Pro", "1-on-1 Coaching Sessions", "Advanced analytics & insights", "Exclusive content & workouts"],
              disabled: true,
              buttonText: "Join Elite",
            },
          ].map((plan, index) => (
            <div key={index} className="user-card p-6 bg-dark-3 rounded-lg hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <ul className="text-sm text-light-3 list-disc list-inside mb-6 text-left">
                {plan.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
              <p className="text-sm text-primary-500 mb-4">{plan.price}</p>

              <button
                className="user-card_btn bg-gray-500 px-4 py-2 rounded-lg text-light-1 font-semibold cursor-not-allowed opacity-50"
                disabled={plan.disabled}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
