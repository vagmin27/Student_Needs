import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  Target,
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Award,
  Globe,
  Rocket,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description:
        "Resume verification powered by Aptos blockchain ensures authenticity and prevents fraud.",
    },
    {
      icon: Zap,
      title: "Instant Referrals",
      description:
        "Connect with alumni instantly and get referrals for your dream companies.",
    },
    {
      icon: Users,
      title: "Alumni Network",
      description:
        "Access a powerful network of alumni ready to help students succeed.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description:
        "Accelerate your career with verified credentials and direct alumni connections.",
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Active Students" },
    { icon: Award, value: "500+", label: "Verified Alumni" },
    { icon: CheckCircle, value: "2000+", label: "Resumes Verified" },
    { icon: Rocket, value: "750+", label: "Successful Referrals" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "Blockchain technology ensures every verification is transparent and immutable.",
    },
    {
      icon: Globe,
      title: "Inclusive Community",
      description:
        "Building bridges between students and alumni across all backgrounds.",
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description:
        "Leveraging cutting-edge Web3 technology to solve real-world problems.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="gradient-text2">Revolutionizing </span>
            <span className="gradient-text3">Student Referrals</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            NextRef is a blockchain-powered platform connecting students with
            verified alumni for authentic job referrals.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card p-6 rounded-lg border text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold uppercase text-sm">
              Our Mission
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-6">
            Empowering Students Through Verified Connections
          </h2>

          <p className="text-muted-foreground mb-4">
            We bridge the gap between students and professionals using
            blockchain-verified credentials.
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-4 p-4 bg-card rounded-lg"
              >
                <Icon className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Core Values</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="bg-card p-6 rounded-lg border">
                <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold">{value.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Career?
        </h2>
        <p className="text-muted-foreground mb-6">
          Join students and alumni already benefiting from verified referrals.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-primary text-white rounded-lg"
        >
          Get Started
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default About;