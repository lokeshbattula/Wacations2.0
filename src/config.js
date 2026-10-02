/**
 * Site-wide configuration. Replace placeholders before launch.
 */
export const CONFIG = {
  /** Enquiry form endpoint. While it contains "PLACEHOLDER", submissions are simulated. */
  enquiryEndpoint: 'https://PLACEHOLDER.example.com/api/enquiry',
  whatsappNumber: '919951839557',
  whatsappText: 'Hi Wacations! I’d love help planning a trip.',
  phone: '+91 99518 39557',
  phoneHref: 'tel:+919951839557',
  email: 'travel@wacations.in',
  socials: {
    instagram: 'https://instagram.com/',  // PLACEHOLDER: replace with real handle
    facebook: 'https://facebook.com/',    // PLACEHOLDER
    youtube: 'https://youtube.com/',      // PLACEHOLDER
  },
};

export const whatsappLink = (text = CONFIG.whatsappText) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
