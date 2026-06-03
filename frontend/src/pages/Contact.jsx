import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaRegClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ChatBot from "./ChatBot";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast.success("Thanks for contacting us. We will respond shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  /*const onSubmitHandler = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/chat/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Thanks for contacting us. We will respond shortly.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } else {
      toast.error("Failed to send message");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};*/

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-cyan-50/40 to-white pb-16 pt-8">
      <ChatBot />

      <div className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -right-16 top-52 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl motion-safe:animate-pulse" />

      <section className="mx-auto grid w-[92%] max-w-7xl grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7 lg:grid-cols-2 lg:p-9">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-800">
            Contact Us
          </span>

          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            We Are Here To Support Your Care Journey
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Reach out to our team for appointment assistance, service guidance, or general
            information. We aim to respond quickly and help you connect with the right care.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-900">
              Fast Response
            </span>
            <span className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-900">
              Friendly Support
            </span>
            <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-900">
              Trusted Assistance
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <img
            className="h-full max-h-[360px] w-full rounded-2xl border border-slate-200 object-cover shadow-lg"
            src={assets.contact_image}
            alt="Contact support team"
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Support Hours</p>
            <p className="mt-1 text-sm text-slate-600">Monday to Saturday, 9:00 AM to 8:00 PM</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 grid w-[92%] max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Get In Touch</h2>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Choose the channel that is most convenient for you. Our team will guide you through
            appointments, services, and support requests.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Our Office</h3>
              <p className="mt-1 text-sm text-slate-600">Ali Pur Chowk, Gujranwala</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-white">
                <FaPhoneAlt />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Phone</h3>
              <a href="tel:+92421111468" className="mt-1 block text-sm text-slate-600 hover:text-teal-700">
                (042) 111-1468
              </a>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-white">
                <FaEnvelope />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Email</h3>
              <a
                href="mailto:helpcentre@gmail.com"
                className="mt-1 block text-sm text-slate-600 hover:text-indigo-700"
              >
                helpcentre@gmail.com
              </a>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white">
                <FaRegClock />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Working Hours</h3>
              <p className="mt-1 text-sm text-slate-600">Mon-Sat | 9:00 AM - 8:00 PM</p>
            </article>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-teal-900 p-4 text-white">
            <p className="text-sm font-semibold">Careers and Collaborations</p>
            <p className="mt-1 text-sm text-slate-100/90">
              Interested in joining our mission? Reach out to explore opportunities with our team.
            </p>
            <button className="mt-3 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/25">
              Explore Jobs
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Send Us A Message</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Fill out the form below and our support desk will get back to you as soon as possible.
          </p>

          <form onSubmit={onSubmitHandler} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onChangeHandler}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={onChangeHandler}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={onChangeHandler}
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
                placeholder="Write your message here"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-800"
            >
              <FaPaperPlane className="text-xs" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
