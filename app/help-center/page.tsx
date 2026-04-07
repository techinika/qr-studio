import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/parts/Footer";
import Nav from "@/components/parts/Nav";
import { Mail, MessageCircle, Shield, Zap, BarChart3, Users, Globe, QrCode, FileText, Lock } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "Help Center | QR STUDIO - FAQs, Support & Guide",
  description: "Complete help center for QR STUDIO. Learn how to create, customize, and track QR codes. Find answers to FAQs about dynamic QR codes, password protection, analytics, and more. Contact support at products@techinika.com",
  keywords: [
    "QR code help",
    "QR code FAQ",
    "how to create QR code",
    "dynamic QR code guide",
    "QR code tracking",
    "QR code analytics",
    "password protected QR code",
    "QR code customization",
    "QR code support",
    "QR code troubleshooting",
    "best QR code generator",
    "how QR codes work",
    "QR code scanning issues",
    "QR code not working",
    "QR code generator guide",
  ],
  openGraph: {
    title: "Help Center | QR STUDIO - FAQs & Support",
    description: "Complete help center for QR STUDIO. Learn how to create, customize, and track QR codes. Find answers to all your QR code questions.",
    type: "website",
    url: "https://qr-studio.techinika.com/help-center",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | QR STUDIO",
    description: "Complete help center for QR STUDIO. FAQs and support for QR code creation and tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqCategories = [
  {
    title: "Getting Started",
    icon: <Zap className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "What is QR STUDIO?",
        a: "QR STUDIO is a professional dynamic QR code generator with real-time analytics, custom branding, and password protection. It allows you to create, track, and manage QR codes for free."
      },
      {
        q: "How do I create a QR code?",
        a: "Simply go to the Generate page, enter your URL or content, customize colors and logo if desired, and click Download. No signup required for basic QR codes."
      },
      {
        q: "Do I need to create an account?",
        a: "No! You can create and download basic QR codes without signing up. However, creating an account unlocks dynamic QR codes, analytics, folder organization, and team collaboration features."
      },
      {
        q: "What is the difference between static and dynamic QR codes?",
        a: "Static QR codes have the content embedded directly and cannot be changed after creation. Dynamic QR codes use a short URL that can be updated anytime, allowing you to change the destination without reprinting."
      }
    ]
  },
  {
    title: "Dynamic QR Codes",
    icon: <Globe className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "What are dynamic QR codes?",
        a: "Dynamic QR codes use a redirect system - when scanned, they point to our server which then forwards to your destination URL. This allows you to change the destination anytime without reprinting the QR code."
      },
      {
        q: "Can I edit my QR code after creating it?",
        a: "Yes! With dynamic QR codes, you can update the destination URL at any time. The QR code itself stays the same, but now points to your new content."
      },
      {
        q: "How do I track scans on my QR codes?",
        a: "Create a free account to access the analytics dashboard. There you can see total scans, scan locations, devices, and time of scans for each QR code."
      },
      {
        q: "Can I password protect my QR code?",
        a: "Yes! With a free account, you can add password protection to your dynamic QR codes. Users will need to enter the password to access your content."
      }
    ]
  },
  {
    title: "Scanning & Usage",
    icon: <QrCode className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "How do I scan a QR code?",
        a: "Use our built-in scanner at /scan page, or use your phone's camera app. Point your camera at the QR code and it will automatically detect and open the link."
      },
      {
        q: "Why isn't my QR code scanning?",
        a: "Ensure the QR code is clean and undamaged. Make sure there's enough contrast between the QR code and its background. Also ensure the QR code is large enough to be easily captured."
      },
      {
        q: "Can I scan QR codes from an image file?",
        a: "Yes! Our scanner supports uploading images. Go to /scan, click 'Scan from File', and upload your QR code image."
      },
      {
        q: "What happens if my QR code is disabled?",
        a: "If you disable a dynamic QR code, users will see a 'Discontinued' message when they scan it. You can re-enable it at any time from your workspace."
      }
    ]
  },
  {
    title: "Account & Billing",
    icon: <Users className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "Is QR STUDIO really free?",
        a: "The basic QR code generator is free to use without signup. Premium features like dynamic QR codes, analytics, and team collaboration are also available. Check our pricing page for current offers."
      },
      {
        q: "How do I upgrade to premium?",
        a: "Go to the Subscribe page from your dashboard to see available plans and upgrade options."
      },
      {
        q: "Can I add team members to my workspace?",
        a: "Yes! With a free account, you can invite up to 5 team members to collaborate on QR code management."
      },
      {
        q: "How do I delete my account?",
        a: "Contact us at products@techinika.com to request account deletion. We'll process your request as soon as possible."
      }
    ]
  },
  {
    title: "Security & Privacy",
    icon: <Shield className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "Is my data secure?",
        a: "Yes, we use industry-standard security measures including encryption and secure Firebase storage. Your QR code data is protected and only accessible by you."
      },
      {
        q: "What information do you collect?",
        a: "We collect minimal information needed to provide our service. For logged-in users, we store your email and QR code data. For visitors, we may track basic scan analytics. See our Privacy Policy for details."
      },
      {
        q: "Can I make my QR code private?",
        a: "QR codes are public by nature - anyone who has the code can scan it. However, you can add password protection to require a passkey before accessing the content."
      }
    ]
  },
  {
    title: "Troubleshooting",
    icon: <MessageCircle className="text-emerald-500" size={24} />,
    questions: [
      {
        q: "Why is my QR code not working?",
        a: "Check that: 1) The URL is correct and accessible, 2) The QR code isn't damaged, 3) For dynamic codes, it hasn't been disabled. Try scanning with a different device to isolate the issue."
      },
      {
        q: "The scanner isn't detecting my QR code",
        a: "Ensure good lighting and that the QR code fills at least 20% of the camera frame. Clean the camera lens and ensure the QR code has clear borders."
      },
      {
        q: "My scans aren't showing in analytics",
        a: "Only dynamic QR codes track scans accurately. Static QR codes use client-side tracking which may miss some scans. Make sure you're using a dynamic QR code from your account."
      },
      {
        q: "I can't log in with Google",
        a: "Make sure you're using a valid Google account. Check that pop-up blockers aren't preventing the login window. If issues persist, contact support."
      }
    ]
  }
];

const features = [
  {
    icon: <QrCode size={24} />,
    title: "Dynamic QR Codes",
    description: "Change destination URLs anytime without reprinting"
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Real-time Analytics",
    description: "Track scans, locations, devices, and time"
  },
  {
    icon: <Lock size={24} />,
    title: "Password Protection",
    description: "Secure content with custom passwords"
  },
  {
    icon: <FileText size={24} />,
    title: "Folder Organization",
    description: "Organize QR codes into folders"
  },
  {
    icon: <Users size={24} />,
    title: "Team Collaboration",
    description: "Work together with your team"
  },
  {
    icon: <Shield size={24} />,
    title: "Brand Customization",
    description: "Add logos and custom colors"
  }
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Help <span className="text-emerald-500">Center</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Everything you need to know about QR STUDIO. Can't find your answer? Contact us directly.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-slate-900 rounded-lg p-8 text-white mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black uppercase mb-2">Need More Help?</h2>
              <p className="text-slate-400">Our support team is ready to assist you with any questions.</p>
            </div>
            <a 
              href="mailto:products@techinika.com" 
              className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              <Mail size={20} />
              Contact Support
            </a>
          </div>
        </div>

        {/* Features Overview */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 text-center">
            What You Can Do with <span className="text-emerald-500">QR STUDIO</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 text-center">
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </h2>
          
          <div className="space-y-8">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} className="border border-slate-100 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 flex items-center gap-3">
                  {category.icon}
                  <h3 className="font-black text-slate-900 uppercase">{category.title}</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {category.questions.map((item, qIndex) => (
                    <details key={qIndex} className="group">
                      <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        {item.q}
                        <span className="text-emerald-500 group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <div className="px-6 pb-4 text-slate-500 text-sm leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-16 bg-emerald-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">
            Still Have Questions?
          </h2>
          <p className="text-slate-500 mb-6 max-w-xl mx-auto">
            We're here to help! Reach out to our support team and we'll get back to you as soon as possible.
          </p>
          <a 
            href="mailto:products@techinika.com" 
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all"
          >
            <Mail size={18} />
            products@techinika.com
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}