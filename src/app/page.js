"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Zap, Users, Package, Factory, Truck, BarChart3, Shield, Menu, X, ArrowRight, CheckCircle } from "lucide-react"
import AnimeLightning from "@/components/animations/AnimeLightning"

export default function GTManagementLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)


  const features = [
    {
      icon: Users,
      title: "Customer Power Grid",
      description: "Electrify your customer relationships with lightning-fast CRM tools",
      color: "from-green-400 to-cyan-400",
    },
    {
      icon: Package,
      title: "Stock Lightning Network",
      description: "Control your inventory with storm-level precision and real-time tracking",
      color: "from-cyan-400 to-green-400",
    },
    {
      icon: Factory,
      title: "Manufacturing Storm Center",
      description: "Power up production with automated workflows and quality control",
      color: "from-green-400 to-blue-400",
    },
    {
      icon: Truck,
      title: "Vendor Voltage Hub",
      description: "Energize supplier relationships with seamless procurement management",
      color: "from-blue-400 to-green-400",
    },
    {
      icon: BarChart3,
      title: "Revenue Lightning Analytics",
      description: "Strike insights from your data with powerful financial reporting",
      color: "from-green-400 to-cyan-400",
    },
    {
      icon: Shield,
      title: "Access Control Grid",
      description: "Secure your operations with electrified user management systems",
      color: "from-cyan-400 to-green-400",
    },
  ]

  const subscriptions = [
    {
      name: "Bronze",
      monthlyPrice: "$39",
      annualPrice: "$390", // 10 months price (2 months free)
      period: isAnnual ? "/year" : "/month",
      description: "Perfect for small businesses getting started with digital transformation",
      color: "from-orange-400 to-yellow-400",
      borderColor: "border-orange-400/50",
      features: [
        "Up to 5 users",
        "Basic CRM & Customer Management",
        "Inventory Tracking (up to 1,000 items)",
        "Monthly Reports",
        "Email Support",
        "Mobile App Access",
        "Basic User Permissions"
      ],
      popular: false
    },
    {
      name: "Silver",
      monthlyPrice: "$59",
      annualPrice: "$590", // 10 months price (2 months free)
      period: isAnnual ? "/year" : "/month", 
      description: "Ideal for growing businesses that need advanced management tools",
      color: "from-gray-400 to-slate-400",
      borderColor: "border-gray-400/50",
      features: [
        "Up to 25 users",
        "Advanced CRM & Sales Pipeline",
        "Unlimited Inventory Management",
        "Production & Manufacturing Tools",
        "Supplier & Vendor Management",
        "Weekly Reports & Analytics",
        "Priority Support",
        "Advanced User Roles",
        "API Access"
      ],
      popular: true
    },
    {
      name: "Gold",
      monthlyPrice: "$89",
      annualPrice: "$890", // 10 months price (2 months free)
      period: isAnnual ? "/year" : "/month",
      description: "Complete enterprise solution with all features and premium support",
      color: "from-yellow-400 to-amber-400",
      borderColor: "border-yellow-400/50",
      features: [
        "Unlimited users",
        "Complete CRM Suite",
        "Advanced Analytics & BI",
        "Multi-location Management",
        "Custom Workflows & Automation",
        "Real-time Reporting Dashboard",
        "24/7 Premium Support",
        "Custom Integrations",
        "White-label Options",
        "Dedicated Account Manager"
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Storm Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(62,207,142,0.1),transparent_70%)]" />
        <div className="storm-particles absolute inset-0" />
      </div>

      {/* Lightning Flash Overlay */}
    

      {/* Header */}
      <header className="relative z-50 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Zap className="h-8 w-8 text-green-400 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 text-green-400 animate-ping opacity-20">
                  <Zap className="h-8 w-8" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                GT Management
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-green-400 transition-colors electric-hover">
                Features
              </a>
              <a href="#pricing" className="hover:text-green-400 transition-colors electric-hover">
                Pricing
              </a>
              <a href="#about" className="hover:text-green-400 transition-colors electric-hover">
                About
              </a>
              <a href="#contact" className="hover:text-green-400 transition-colors electric-hover">
                Contact
              </a>
              <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-semibold electric-button">
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-green-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#features" className="hover:text-green-400 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="hover:text-green-400 transition-colors">
                  Pricing
                </a>
                <a href="#about" className="hover:text-green-400 transition-colors">
                  About
                </a>
                <a href="#contact" className="hover:text-green-400 transition-colors">
                  Contact
                </a>
                <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-semibold w-full">
                  Get Started
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="container mx-auto text-center">


          {/* Anime.js Lightning Effect */}
      <AnimeLightning targetElements=".hero-text, h2 .bg-gradient-to-r" />

          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight hero-text">
              <span className="block mb-2 hero-text">Streamline Your</span>
              <span className="block mb-2 bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent hero-text">
                Business Operations
              </span>
              <span className="block text-4xl md:text-5xl hero-text">with GT Management</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Harness the power of lightning-fast efficiency and storm-level control for your complete business
              management platform
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-bold px-8 py-4 text-lg electric-button group"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Electrify Your Business
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 text-lg electric-button group bg-transparent"
              >
                <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                See the Power Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Power Stations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Control every aspect of your business with our electrified management centers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-green-400/50 transition-all duration-300 electric-card group backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="electric-stat">
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div className="electric-stat">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="electric-stat">
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Companies Powered</div>
            </div>
            <div className="electric-stat">
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-gray-300">Lightning Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Power Plans
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect subscription to electrify your business operations
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-green-400' : 'text-gray-400'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-green-500"
              />
              <span className={`text-lg font-medium ${isAnnual ? 'text-green-400' : 'text-gray-400'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold ml-2">
                  Save 2 months!
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptions.map((subscription, index) => (
              <Card
                key={index}
                className={`bg-gray-900/50 border-2 ${subscription.borderColor} hover:border-green-400/70 transition-all duration-300 electric-card group backdrop-blur-sm relative ${
                  subscription.popular ? 'scale-105 border-green-400/70' : ''
                }`}
              >
                {subscription.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${subscription.color} mb-4 mx-auto`}>
                    <Zap className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                    {subscription.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-green-400">
                      {isAnnual ? subscription.annualPrice : subscription.monthlyPrice}
                    </span>
                    <span className="text-gray-400 text-lg">{subscription.period}</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${(parseInt(subscription.monthlyPrice.replace('$', '')) * 12)} billed monthly
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{subscription.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {subscription.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      subscription.popular 
                        ? 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black' 
                        : 'bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                    } font-bold py-3 electric-button transition-all duration-300`}
                  >
                    {subscription.popular ? 'Get Started Now' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
            <Button 
              variant="outline" 
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black bg-transparent"
            >
              Compare All Features
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Electrify
              </span>{" "}
              Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of companies already powered by GT Management's lightning-fast platform
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Input
                placeholder="Enter your business email"
                className="max-w-md bg-gray-900/50 border-gray-700 focus:border-green-400 text-white placeholder-gray-400"
              />
              <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black font-bold px-8 py-3 electric-button">
                Start Free Trial
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  GT Management
                </span>
              </div>
              <p className="text-gray-400">Lightning-powered business management for the modern enterprise.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-400">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-400">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-400">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GT Management. All rights reserved. Powered by lightning.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
