import React from "react";
import {
  FaAward,
  FaClock,
  FaHeart,
  FaHospitalUser,
  FaShieldAlt,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import { assets } from "../assets/assets";
import ChatBot from "./ChatBot";

const valueCards = [
  {
    title: "Compassion First",
    body: "Every interaction is designed around empathy, respect, and human-centered care.",
    icon: FaHeart,
  },
  {
    title: "Trusted Care",
    body: "Verified doctors and transparent appointment processes help patients feel confident and safe.",
    icon: FaShieldAlt,
  },
  {
    title: "Professional Excellence",
    body: "We continuously improve quality standards to deliver reliable outcomes for every visit.",
    icon: FaAward,
  },
  {
    title: "Accessible Experience",
    body: "Simple scheduling and clear communication make healthcare easier for families and individuals.",
    icon: FaHospitalUser,
  },
];

const trustCards = [
  {
    title: "Qualified Doctors",
    body: "Our network includes experienced professionals across multiple specialties.",
    icon: FaUserMd,
  },
  {
    title: "Patient-Centered Support",
    body: "Friendly assistance and clear guidance from first booking to follow-up.",
    icon: FaUsers,
  },
  {
    title: "Timely Appointments",
    body: "Efficient scheduling reduces waiting time and improves service consistency.",
    icon: FaClock,
  },
];

const projectStats = [
  { value: "20k+", label: "Patients Served" },
  { value: "120+", label: "Doctor Partners" },
  { value: "96%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Access" },
];

const About = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/40 to-white pb-16 pt-8">
      <ChatBot />

      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl motion-safe:animate-pulse" />

      <section className="mx-auto grid w-[92%] max-w-7xl grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7 lg:grid-cols-2 lg:p-9">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-800">
            About Us
          </span>

          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Caring Healthcare,
            Built Around People
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            We are committed to making healthcare more approachable, transparent, and dependable.
            Our platform helps patients connect with trusted doctors, manage appointments easily,
            and receive care with confidence at every step.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-900">
              Trusted Doctors
            </span>
            <span className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-900">
              Easy Booking
            </span>
            <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-900">
              Better Experience
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <img
            src={assets.about_image}
            alt="Healthcare team and patient care"
            className="h-full max-h-[360px] w-full rounded-2xl border border-slate-200 object-cover shadow-lg"
          />

          <div className="grid grid-cols-2 gap-3">
            {projectStats.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-base font-extrabold text-teal-700 sm:text-lg">{item.value}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-[92%] max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Story</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            We started with one simple goal: to remove stress from healthcare access. Too often,
            patients struggle with delayed responses, confusing appointment systems, and limited
            communication. We built this platform to change that experience and make care journeys
            simpler, faster, and more human.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              To deliver accessible, efficient, and patient-friendly healthcare experiences through
              reliable digital services and compassionate support.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              To become a trusted healthcare companion for families by connecting quality medical
              care with seamless digital convenience.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-6 w-[92%] max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What We Value</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Our values guide every feature, every interaction, and every decision we make.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon className="text-xl text-blue-700 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-6 w-[92%] max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why People Choose Us</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Patients and doctors choose us for consistency, clarity, and a care-first approach.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {trustCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-100/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
                      <Icon className="text-sm" />
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-6 w-[92%] max-w-7xl rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-teal-900 p-6 text-white shadow-[0_15px_35px_rgba(15,23,42,0.3)] sm:p-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Join Our Healthcare Community</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-100/90 sm:text-base">
          Whether you are booking your first consultation or managing ongoing care, we are here
          to support you with trusted professionals, smooth scheduling, and a healthcare experience
          built around your needs.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold sm:text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1">Patient Focused</span>
          <span className="rounded-full bg-white/15 px-3 py-1">Trusted Doctors</span>
          <span className="rounded-full bg-white/15 px-3 py-1">Care With Confidence</span>
        </div>
      </section>
    </div>
  );
};

export default About;
