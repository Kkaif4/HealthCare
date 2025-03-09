import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { LinkedinIcon, TwitterIcon } from 'react-share';
import { Instagram } from 'react-bootstrap-icons'; 

const Footer = () => {
  return (
    <footer className="bg-dark/90 border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold text-primary mb-4">OptiLife AI</h3>
            <p className="text-light/80 mb-4">
              Revolutionizing fitness through AI-powered personalization
            </p>
            <div className="flex items-center space-x-4">
              <LinkedinIcon size={32} round className="hover:opacity-80 cursor-pointer" />
              <TwitterIcon size={32} round className="hover:opacity-80 cursor-pointer" />
              <Instagram size={32} round className="hover:opacity-80 cursor-pointer" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <div>
            <h4 className="text-light font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-light/80 hover:text-primary">Features</a></li>
              <li><a href="#how-it-works" className="text-light/80 hover:text-primary">How It Works</a></li>
              <li><a href="#pricing" className="text-light/80 hover:text-primary">Pricing</a></li>
              <li><a href="#testimonials" className="text-light/80 hover:text-primary">Testimonials</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-light font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-light/80 hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-light/80 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-light/80 hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-light/80 hover:text-primary">API Status</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-light font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center text-light/80">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-primary" />
                support@optilifeai.com
              </div>
              <div className="flex items-center text-light/80">
                <PhoneIcon className="h-5 w-5 mr-2 text-primary" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/20 mt-12 pt-8 text-center text-light/80">
          <p>© {new Date().getFullYear()} OptiLife AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;