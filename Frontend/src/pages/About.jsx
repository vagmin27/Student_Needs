import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
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
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Resume verification powered by Aptos blockchain ensures authenticity and prevents fraud.',
    },
    {
      icon: Zap,
      title: 'Instant Referrals',
      description: 'Connect with alumni instantly and get referrals for your dream companies.',
    },
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Access a powerful network of alumni ready to help students succeed.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Accelerate your career with verified credentials and direct alumni connections.',
    },
  ];

  const stats = [
    { icon: Users, value: '1000+', label: 'Active Students' },
    { icon: Award, value: '500+', label: 'Verified Alumni' },
    { icon: CheckCircle, value: '2000+', label: 'Resumes Verified' },
    { icon: Rocket, value: '750+', label: 'Successful Referrals' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Blockchain technology ensures every verification is transparent and immutable.',
    },
    {
      icon: Globe,
      title: 'Inclusive Community',
      description: 'Building bridges between students and alumni across all backgrounds.',
    },
    {
      icon: Sparkles,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge Web3 technology to solve real-world problems.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text2">Revolutionizing </span>
            <span className="gradient-text3">Student Referrals</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            NextRef is a blockchain-powered platform connecting students with verified alumni for authentic job referrals and career opportunities.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-6 border border-border/50 text-center hover:border-primary/50 transition-all"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                <span className="gradient-text3">Empowering Students </span>
                <span className="text-foreground">Through Verified Connections</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We believe every student deserves a fair chance to land their dream job. NextRef bridges the gap between talented students and industry professionals through blockchain-verified credentials and authentic referral opportunities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By leveraging the power of the Aptos blockchain, we ensure that every resume is verified by authorized college authorities, creating a trustworthy ecosystem where alumni can confidently provide referrals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/5 via-student/5 to-alumni/5 rounded-lg p-8 border border-border/50">
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4 bg-card/50 rounded-xl p-4 backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text2">Our Core </span>
            <span className="gradient-text3">Values</span>
          </h2>
          <p className="text-muted-foreground">
            The principles that guide us in building the future of student referrals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg p-8 border border-border/50 hover:border-primary/50 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text3">How It </span>
            <span className="gradient-text2">Works</span>
          </h2>
          <p className="text-muted-foreground">
            Simple, secure, and powered by blockchain technology
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Students and alumni connect their Aptos wallet to get started on the platform.',
                color: 'from-student/20 to-student/10',
              },
              {
                step: '02',
                title: 'Verify Credentials',
                description: 'College verifiers authenticate student resumes on-chain, creating trusted profiles.',
                color: 'from-verifier/20 to-verifier/10',
              },
              {
                step: '03',
                title: 'Get Referrals',
                description: 'Verified students apply for referrals, and alumni provide opportunities based on trust.',
                color: 'from-alumni/20 to-alumni/10',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${item.color} rounded-lg p-8 border border-border/50 h-full`}>
                  <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-student/5 to-alumni/10 rounded-xl p-12 border border-primary/20 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text2">Ready to Transform </span>
            <span className="gradient-text3">Your Career?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and alumni already benefiting from blockchain-verified referrals.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-primary to-student rounded-lg text-background font-semibold hover:shadow-lg transition-all"
          >
            Get Started Now
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;